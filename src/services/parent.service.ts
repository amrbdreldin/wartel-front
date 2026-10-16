import { apiGet, apiPost, apiUpload, type ApiCallOptions, withResponseMeta } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { ChildCard, ParentDashboard, ParentTodaySession, RegisterChildRequest } from "@/types/parent.types";
import type { LoginResponse } from "@/types/auth.types";

// ============================================================
// Parent Service
// ============================================================

const BASE_URL = "/parent";

export const parentService = {
  getDashboard: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<ParentDashboard>>(`${BASE_URL}/dashboard`, options).then((r) => r.data),

  registerChild: (data: RegisterChildRequest, options?: ApiCallOptions) =>
    apiPost<ApiResponse<ChildCard>>(`${BASE_URL}/children`, data, options).then((r) => withResponseMeta(r)),

  switchToChild: (childId: string, options?: ApiCallOptions) =>
    apiPost<ApiResponse<{ token: string }>>(
      `${BASE_URL}/children/${childId}/switch`,
      undefined,
      options
    ).then((r) => r.data),

  loginAsStudent: (studentId: number, options?: ApiCallOptions) =>
    apiPost<ApiResponse<LoginResponse>>(
      `${BASE_URL}/login-as-student`,
      { student_id: studentId },
      options
    ).then((r) => r.data),

  getChildren: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<{ children: Array<{ id: number; name: string; enrollment_type: string }>; today_sessions?: ParentTodaySession[] }>>(`${BASE_URL}/children`, options).then((r) => r.data),

  addStudent: (data: FormData, options?: ApiCallOptions) =>
    apiUpload<ApiResponse<unknown>>(`${BASE_URL}/add-student`, data, options).then((r) => withResponseMeta(r)),

  attendChildren: (data: { session_id: number }, options?: ApiCallOptions) =>
    apiPost<ApiResponse<unknown>>(`${BASE_URL}/attend-children`, data, options).then((r) => r),
};
