import type { QrCodeResponse } from "@/services/qr.service";

// ============================================================
// QR Redirect – URL validation & API error extraction helpers
// ============================================================

export interface QrApiErrorShape {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

/**
 * Validates that a target URL uses http(s) or a safe relative path
 * to prevent javascript:/data: injection redirects.
 */
export function sanitizeRedirectUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts the exact message returned by the API from either an error response
 * (e.g., 404 Not Found) or a 200 payload missing a valid target_url.
 */
export function extractQrErrorMessage(
  err: unknown,
  apiResponse: QrCodeResponse | undefined,
  fallback: string
): string {
  const apiErr = err as QrApiErrorShape | null | undefined;
  const responseData = apiErr?.response?.data;

  if (responseData?.message && responseData.message.trim()) {
    return responseData.message;
  }

  const validationErrors = responseData?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const first = Object.values(validationErrors).flat()[0];
    if (first) return first;
  }

  if (apiResponse?.message && apiResponse.message.trim() && (!apiResponse.success || !apiResponse.data?.target_url)) {
    return apiResponse.message;
  }

  if (apiErr?.message && apiErr.message.trim()) {
    return apiErr.message;
  }

  return fallback;
}
