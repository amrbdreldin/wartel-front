import type { AxiosRequestConfig } from "axios";
import { apiGet, apiPost, apiUpload, type ApiCallOptions } from "@/lib/api-client";
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
  direct_join?: "yes" | "no" | number | boolean;
  requires_audio?: number;
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
  age?: number | string;
  child_id?: number;
  firebase_token?: string;
  sons?: SonRequestItem[];
  audio?: File | null;
}

export interface JoinGroupResponse {
  direct_join?: boolean;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  telegram_tracking_url?: string;
  user?: {
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
  direct_join?: "yes" | "no" | number | boolean;
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

  joinGroup: (data: JoinGroupRequest, options?: ApiCallOptions) => {
    const requestOptions = {
      ...options,
      config: {
        ...options?.config,
        skipGlobalToast: true,
      } as AxiosRequestConfig & { skipGlobalToast?: boolean },
    };

    if (data.audio) {
      const formData = new FormData();
      formData.append("group_id", String(data.group_id));
      if (data.role_id !== undefined) formData.append("role_id", String(data.role_id));
      if (data.name) formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.password) formData.append("password", data.password);
      if (data.age !== undefined && data.age !== "") formData.append("age", String(data.age));
      if (data.child_id !== undefined) formData.append("child_id", String(data.child_id));
      if (data.firebase_token) formData.append("firebase_token", data.firebase_token);
      if (data.sons && data.sons.length > 0) {
        data.sons.forEach((son, idx) => {
          formData.append(`sons[${idx}][name]`, son.name);
          if (son.phone) formData.append(`sons[${idx}][phone]`, son.phone);
          if (son.password) formData.append(`sons[${idx}][password]`, son.password);
        });
      }
      formData.append("audio_test_path", data.audio);
      return apiUpload<ApiResponse<JoinGroupResponse>>(`${BASE_URL}/join`, formData, requestOptions).then((r) => r);
    }

    return apiPost<ApiResponse<JoinGroupResponse>>(`${BASE_URL}/join`, data, requestOptions).then((r) => r);
  },

  getAvailableGroups: (options?: ApiCallOptions): Promise<AvailableGroup[]> =>
    apiGet<ApiResponse<AvailableGroup[]>>("/student/available-groups", options).then((r) => r?.data ?? []),

  // Errors are rendered inside the apply card, so the global toast is skipped.
  // Groups with requires_audio = 1 expect the voice file under that same key.
  applyToGroup: (groupId: number, audio?: File | null, options?: ApiCallOptions) => {
    const requestOptions = {
      ...options,
      config: {
        ...options?.config,
        skipGlobalToast: true,
      } as AxiosRequestConfig & { skipGlobalToast?: boolean },
    };
    if (!audio) {
      return apiPost<ApiResponse<unknown>>(`${BASE_URL}/apply`, { group_id: groupId }, requestOptions);
    }
    const formData = new FormData();
    formData.append("group_id", String(groupId));
    formData.append("requires_audio", audio);
    return apiUpload<ApiResponse<unknown>>(`${BASE_URL}/apply`, formData, requestOptions);
  },
};
