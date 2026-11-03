import { apiGet, apiPost, apiPut, apiUpload, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  InitiatePasswordResetResponse,
  ResetPasswordRequestResponse,
  User,
  RegisterDataResponse,
  EnrollmentSubmitResponse,
  UserReactivationRequest,
  AppDataResponse,
} from "@/types/auth.types";

// ============================================================
// Auth Service
// ============================================================

const AUTH_URL = "/auth";

/**
 * Unwraps an `ApiResponse<T>` while preserving top-level metadata (`message`, `success`)
 * on the returned object so callers can inspect either shape.
 */
function unwrapWithMeta<T extends object>(
  res: ApiResponse<T> & Partial<T>
): T & { message?: string; success?: boolean } {
  const payload =
    res && typeof res === "object" && "data" in res && res.data && typeof res.data === "object"
      ? { ...res.data }
      : ({ ...res } as unknown as T);

  return {
    ...payload,
    ...(res?.message !== undefined && !("message" in payload) ? { message: res.message } : {}),
    ...(res?.success !== undefined && !("success" in payload) ? { success: res.success } : {}),
  };
}

export const authService = {
  login: (data: LoginRequest, options?: ApiCallOptions) =>
    apiPost<ApiResponse<LoginResponse>>(`${AUTH_URL}/login`, data, options).then(unwrapWithMeta),

  register: (data: FormData, options?: ApiCallOptions) =>
    apiUpload<ApiResponse<EnrollmentSubmitResponse> & Partial<EnrollmentSubmitResponse>>(
      "/enrollment/submit",
      data,
      options
    ).then((r) => {
      const unwrapped = unwrapWithMeta(r);
      if (r?.telegram_tracking_url && !unwrapped.telegram_tracking_url) {
        unwrapped.telegram_tracking_url = r.telegram_tracking_url;
      }
      return unwrapped;
    }),

  parentRegister: (
    data: { mobile: string; password: string; full_name: string; firebase_token?: string },
    options?: ApiCallOptions
  ) =>
    apiPost<ApiResponse<LoginResponse>>(`${AUTH_URL}/parent/register`, data, options).then(
      unwrapWithMeta
    ),

  logout: (options?: ApiCallOptions) =>
    apiPost<ApiResponse<null>>(`${AUTH_URL}/logout`, undefined, options),

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

  getAuthUser: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<{ fcm_token?: string[] } & Record<string, unknown>>>(
      `${AUTH_URL}/user`,
      options
    ).then((r) => r.data),

  // ─── Password reset flow ─────────────────────────────────
  forgotPassword: (phone: string, options?: ApiCallOptions) =>
    apiPost<ApiResponse<InitiatePasswordResetResponse>>(
      `${AUTH_URL}/initiate-password-reset`,
      { phone },
      options
    ),

  resetPasswordRequest: (phone: string, options?: ApiCallOptions) =>
    apiPost<ApiResponse<ResetPasswordRequestResponse>>(
      `${AUTH_URL}/reset-password-request`,
      { phone },
      options
    ),

  verifyOtp: (payload: { phone: string; otp: string }, options?: ApiCallOptions) =>
    apiPost<ApiResponse<null>>(`${AUTH_URL}/verify-otp`, payload, options),

  resetPassword: (
    payload: {
      phone: string;
      otp: string;
      new_password: string;
      new_password_confirmation: string;
    },
    options?: ApiCallOptions
  ) => apiPost<ApiResponse<null>>(`${AUTH_URL}/password/reset`, payload, options),

  // ─── Reactivation request (terminated user) ──────────────────
  reactivationRequest: (data: UserReactivationRequest, options?: ApiCallOptions) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("reason", data.reason);
    return apiUpload<ApiResponse<Record<string, unknown>>>(
      "/user-reactivation-request",
      formData,
      options
    );
  },

  // ─── Registration form data ──────────────────────────────

  getRegisterData: (roleId: string | number, options?: ApiCallOptions) => {
    const config = options?.config || {};
    const params = config.params || {};
    return apiGet<ApiResponse<RegisterDataResponse>>("/register-data", {
      ...options,
      config: {
        ...config,
        params: {
          ...params,
          role_id: Number(roleId),
        },
      },
    }).then((r) => {
      const resp = r as unknown as { data?: RegisterDataResponse; tracks?: unknown };
      if (resp?.data?.tracks !== undefined) {
        return resp.data;
      }
      if (resp?.tracks !== undefined) {
        return resp as unknown as RegisterDataResponse;
      }
      return (resp?.data ?? resp) as RegisterDataResponse;
    });
  },

  // ─── General app data (live session link, …) ─────────────

  getAppData: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<AppDataResponse>>("/data", options).then((r) => r.data),
};
