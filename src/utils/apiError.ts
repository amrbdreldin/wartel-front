import { isAxiosError } from "axios";

// ============================================================
// API error helpers — typed access to the backend error body
// ({ message, errors }) without casting caught values to `any`.
// ============================================================

export interface ApiErrorBody {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

/** The backend error body, if the value is an axios error with a response */
export function getApiErrorBody(err: unknown): ApiErrorBody | undefined {
  return isAxiosError<ApiErrorBody>(err) ? err.response?.data : undefined;
}

/** Backend message → error.message → fallback */
export function getApiErrorMessage(err: unknown, fallback = ""): string {
  const body = getApiErrorBody(err);
  if (body?.message) return body.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/** First validation message from `errors`, if any */
export function getFirstValidationError(err: unknown): string | undefined {
  const errors = getApiErrorBody(err)?.errors;
  if (!errors || typeof errors !== "object") return undefined;
  return Object.values(errors).flat()[0];
}
