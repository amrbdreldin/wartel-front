import { apiGet, apiPost, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

// ============================================================
// Group Service
// ============================================================

export interface GroupSessionDay {
  day: string;
  time: string;
}

export interface DirectJoinGroup {
  group_id: number;
  group_name: string;
  track_name: string;
  teacher_name: string;
  group_session_days: GroupSessionDay[];
}

export interface JoinGroupRequest {
  group_id: number;
  name?: string;
  phone?: string;
  password?: string;
  child_id?: number;
  firebase_token?: string;
}

export interface JoinGroupResponse {
  user: {
    id: number;
    full_name: string;
    phone: string;
    role_id: number;
    status_id: number;
    enrollment_type: string;
  };
}

const BASE_URL = "/groups";

export const groupService = {
  getDirectJoinGroup: (slug: string, options?: ApiCallOptions) =>
    apiGet<ApiResponse<DirectJoinGroup>>(`${BASE_URL}/direct-join/${slug}`, options).then((r) => r.data),

  joinGroup: (data: JoinGroupRequest, options?: ApiCallOptions) =>
    apiPost<ApiResponse<JoinGroupResponse>>(`${BASE_URL}/join`, data, {
      ...options,
      config: {
        ...options?.config,
        skipGlobalToast: true,
      } as any,
    }).then((r) => r),
};
