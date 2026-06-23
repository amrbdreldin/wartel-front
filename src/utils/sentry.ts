import axios from "axios";

/**
 * Checks if an error is an expected user-level/client error.
 * Returns false for errors we deliberately do NOT want in Sentry:
 *   - 400, 401, 403, 422  → expected client/auth errors
 *   - 500+                → already captured server-side by the proxy via captureMessage
 *   - ECONNABORTED        → Axios timeout, normal network degradation, not a code bug
 *   - "No refresh token"  → expected: user session simply expired with no refresh cookie
 *   - "Network Error"     → transient upstream connectivity issue, not a code bug
 *
 * Returns true for genuine unexpected errors (uncaught code crashes, unhandled rejections, etc.)
 */
export function shouldCaptureError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    // Expected HTTP status codes – user/auth errors
    if (status && [400, 401, 403, 422].includes(status)) {
      return false;
    }

    // Upstream 5xx – already logged server-side by the proxy; avoid double-capture
    if (status && status >= 500) {
      return false;
    }

    // Axios timeout (ECONNABORTED) – transient network degradation, not a code bug
    if (error.code === "ECONNABORTED") {
      return false;
    }

    // Browser-level network failure (no response at all) – transient connectivity
    if (!error.response && error.message === "Network Error") {
      return false;
    }
  }

  // Expected auth-flow error: refresh token cookie is missing (session expired)
  if (error instanceof Error && error.message === "No refresh token") {
    return false;
  }

  return true;
}
