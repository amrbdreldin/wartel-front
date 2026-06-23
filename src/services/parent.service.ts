import { apiGet, apiPost, apiUpload, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { ChildCard, ParentDashboard, RegisterChildRequest } from "@/types/parent.types";
import type { LoginResponse } from "@/types/auth.types";

// ============================================================
// Parent Service
// ============================================================

const BASE_URL = "/parent";

export const parentService = {
  getDashboard: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<ParentDashboard>>(`${BASE_URL}/dashboard`, options).then((r) => r.data),

  registerChild: (data: RegisterChildRequest, options?: ApiCallOptions) =>
    apiPost<ApiResponse<ChildCard>>(`${BASE_URL}/children`, data, options).then((r) => {
      const responseData = r.data;
      if (responseData && typeof responseData === "object") {
        (responseData as any).message = r.message;
        (responseData as any).success = r.success;
      }
      return responseData;
    }),

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
    apiGet<ApiResponse<Array<{ id: number; name: string; enrollment_type: string }>>>(`${BASE_URL}/children`, options).then((r) => r.data),

  addStudent: (data: FormData, options?: ApiCallOptions) =>
    apiUpload<ApiResponse<any>>(`${BASE_URL}/add-student`, data, options).then((r) => {
      const responseData = r.data;
      if (responseData && typeof responseData === "object") {
        (responseData as any).message = r.message;
        (responseData as any).success = r.success;
      }
      return responseData;
    }),
};
