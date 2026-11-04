import type { AxiosRequestConfig } from "axios";
import { apiGet, apiPost, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

// ============================================================
// Group Service
// ============================================================

export interface GroupSessionDay {
  day: string;
  time: string;
}

export interface DirectJoinGroupRole {
  id: number;
  name: string;
}

export interface DirectJoinGroup {
  group_id: number;
  group_name: string;
  track_name: string;
  teacher_name: string;
  group_session_days: GroupSessionDay[];
  allowed_roles?: DirectJoinGroupRole[];
}

export interface SonRequestItem {
  name: string;
  phone?: string;
  password?: string;
}

export interface JoinGroupRequest {
  group_id: number;
  role_id?: number | string;
  name?: string;
  phone?: string;
  password?: string;
  child_id?: number;
  firebase_token?: string;
  sons?: SonRequestItem[];
}

export interface JoinGroupResponse {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user: {
    id: number;
    full_name: string;
    phone: string;
    role_id: number;
    status_id: number;
    enrollment_type: string;
    role?: string;
  };
}

export interface AvailableGroup {
  id: number;
  name: string;
  display_name: string;
  track_id: number;
  track_name: string;
  course_id: number;
  course_name: string;
  teacher_id: number;
  teacher_name: string;
  type: string;
  start_date: string;
  max_number: number;
  requires_audio: number;
  has_tamam: number;
  has_buddy: number;
  has_attendance: number;
  session_days: GroupSessionDay[];
}

const BASE_URL = "/groups";

export const groupService = {
  getDirectJoinGroup: (slug: string, options?: ApiCallOptions): Promise<DirectJoinGroup[]> =>
    apiGet<ApiResponse<DirectJoinGroup[] | DirectJoinGroup>>(`${BASE_URL}/direct-join/${slug}`, options).then((r) => {
      const data = r?.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return [data as DirectJoinGroup];
      return [];
    }),

  joinGroup: (data: JoinGroupRequest, options?: ApiCallOptions) =>
    apiPost<ApiResponse<JoinGroupResponse>>(`${BASE_URL}/join`, data, {
      ...options,
      config: {
        ...options?.config,
        skipGlobalToast: true,
      } as AxiosRequestConfig & { skipGlobalToast?: boolean },
    }).then((r) => r),

  getAvailableGroups: (options?: ApiCallOptions): Promise<AvailableGroup[]> =>
    apiGet<ApiResponse<AvailableGroup[]>>("/student/available-groups", options).then((r) => r?.data ?? []),

  // Errors are rendered inside the apply dialog, so the global toast is skipped.
  applyToGroup: (groupId: number, options?: ApiCallOptions) =>
    apiPost<ApiResponse<unknown>>(
      `${BASE_URL}/apply`,
      { group_id: groupId },
      {
        ...options,
        config: {
          ...options?.config,
          skipGlobalToast: true,
        } as AxiosRequestConfig & { skipGlobalToast?: boolean },
      }
    ),
};
