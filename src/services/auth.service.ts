import { apiGet, apiPost, apiPut, apiUpload, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  InitiatePasswordResetResponse,
  User,
  RegisterFormData,
} from "@/types/auth.types";

// ============================================================
// Auth Service
// ============================================================

const AUTH_URL = "/auth";

export const authService = {
  login: (data: LoginRequest, options?: ApiCallOptions) =>
    apiPost<ApiResponse<LoginResponse>>(`${AUTH_URL}/login`, data, options).then(
      (r) => {
        const responseData = r.data;
        if (responseData && typeof responseData === "object") {
          (responseData as any).message = r.message;
          (responseData as any).success = r.success;
        }
        return responseData;
      }
    ),

  register: (data: FormData, options?: ApiCallOptions) =>
    apiUpload<ApiResponse<any>>("/enrollment/submit", data, options).then(
      (r) => {
        const responseData = r.data;
        if (responseData && typeof responseData === "object") {
          (responseData as any).message = r.message;
          (responseData as any).success = r.success;
        }
        return responseData;
      }
    ),

  parentRegister: (data: { mobile: string; password: string; full_name: string; firebase_token?: string }, options?: ApiCallOptions) =>
    apiPost<ApiResponse<LoginResponse>>(`${AUTH_URL}/parent/register`, data, options).then(
      (r) => {
        const responseData = r.data;
        if (responseData && typeof responseData === "object") {
          (responseData as any).message = r.message;
          (responseData as any).success = r.success;
        }
        return responseData;
      }
    ),

  logout: (options?: ApiCallOptions) =>
    apiPost<ApiResponse<null>>(`${AUTH_URL}/logout`, undefined, options).then(
      (r) => r
    ),

  refreshToken: (refreshToken: string, options?: ApiCallOptions) =>
    apiPost<ApiResponse<RefreshTokenResponse>>(
      `${AUTH_URL}/refresh`,
      { refresh_token: refreshToken },
      options
    ).then((r) => r.data),

  getProfile: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<User>>(`${AUTH_URL}/me`, options).then((r) => r.data),

  updateProfile: (data: Partial<User>, options?: ApiCallOptions) =>
    apiPut<ApiResponse<User>>(`${AUTH_URL}/me`, data, options).then((r) => r.data),

  // ─── Password reset flow ─────────────────────────────────
  forgotPassword: (phone: string, options?: ApiCallOptions) =>
    apiPost<ApiResponse<InitiatePasswordResetResponse>>(`${AUTH_URL}/initiate-password-reset`, { phone }, options).then(
      (r) => r
    ),

  verifyOtp: (
    payload: { phone: string; otp: string },
    options?: ApiCallOptions
  ) =>
    apiPost<ApiResponse<null>>(`${AUTH_URL}/verify-otp`, payload, options).then(
      (r) => r
    ),

  resetPassword: (
    payload: {
      phone: string;
      otp: string;
      new_password: string;
      new_password_confirmation: string;
    },
    options?: ApiCallOptions
  ) =>
    apiPost<ApiResponse<null>>(`${AUTH_URL}/password/reset`, payload, options).then(
      (r) => r
    ),

  // ─── Registration form data ──────────────────────────────
  getFormData: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<RegisterFormData>>("/data", options).then((r) => r.data),
};


