import { apiGet, apiPost, apiPut, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api.types";
import type {
  AttendanceEntry,
  SubmitAttendancePayload,
  SubmitGradesPayload,
  TeacherAbsenceRequest,
  TeacherGroup,
  TeacherRequest,
  TeacherDashboardData,
  TeacherGroupWithStudents,
  GroupStudentsDetailResponse,
  SessionAttendanceRecord,
  SubmitSessionAttendancePayload,
} from "@/types/teacher.types";
import type { WarningListItem } from "@/types/student.types";
import type { LoginResponse } from "@/types/auth.types";

// ============================================================
// Teacher Service
// ============================================================

const BASE_URL = "/teacher";
const LEAVES_URL = "/student";

export const teacherService = {
  getDashboard: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<TeacherDashboardData>>(`${BASE_URL}/dashboard`, options).then((r) => r.data),

  getGroupsWithStudents: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<TeacherGroupWithStudents[]>>(`${BASE_URL}/groups`, options).then((r) => r.data),

  getGroupStudents: (groupId: string | number, options?: ApiCallOptions) =>
    apiGet<ApiResponse<GroupStudentsDetailResponse>>(`${BASE_URL}/groups/${groupId}/students`, options).then((r) => r.data),

  getGroups: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<TeacherGroup[]>>(`${BASE_URL}/groups`, options).then((r) => r.data),


  getAttendance: (groupId: string, sessionDate: string, options?: ApiCallOptions) =>
    apiGet<ApiResponse<AttendanceEntry[]>>(`${BASE_URL}/groups/${groupId}/attendance`, {
      ...options,
      config: { ...options?.config, params: { date: sessionDate } },
    }).then((r) => r.data),

  submitAttendance: (data: SubmitAttendancePayload, options?: ApiCallOptions) =>
    apiPost<ApiResponse<null>>(`${BASE_URL}/attendance`, data, options),

  submitGrades: (data: SubmitGradesPayload, options?: ApiCallOptions) =>
    apiPost<ApiResponse<null>>(`${BASE_URL}/grades`, data, options),

  updateMeetingLink: (groupId: string, link: string, options?: ApiCallOptions) =>
    apiPut<ApiResponse<null>>(
      `${BASE_URL}/groups/${groupId}/meeting-link`,
      { meeting_link: link },
      options
    ),

  updateSessionUrl: (sessionId: string | number, url: string, options?: ApiCallOptions) =>
    apiPut<ApiResponse<{ success: boolean; message: string }>>(
      `${BASE_URL}/sessions/${sessionId}/url`,
      { url },
      options
    ),

  getLeaves: (params?: QueryParams, options?: ApiCallOptions) =>
    apiGet<ApiResponse<{ leaves: any[] }>>(`${LEAVES_URL}/leaves`, {
      ...options,
      config: { ...options?.config, params },
    }),

  submitExcuse: (data: { start_date: string; end_date: string; reason: string }, options?: ApiCallOptions) =>
    apiPost<ApiResponse<any>>(`${LEAVES_URL}/request-leave`, data, options),

  getSessionAttendance: (sessionId: string | number, options?: ApiCallOptions) =>
    apiGet<ApiResponse<SessionAttendanceRecord[]>>(`${BASE_URL}/sessions/${sessionId}/attendance`, options).then((r) => r.data),

  submitSessionAttendance: (sessionId: string | number, data: SubmitSessionAttendancePayload, options?: ApiCallOptions) =>
    apiPost<ApiResponse<{ session_id: number; records_count: number }>>(`${BASE_URL}/sessions/${sessionId}/attendance`, data, options),

  getNotifications: (params?: QueryParams, options?: ApiCallOptions) =>
    apiGet<PaginatedResponse<any>>(`${BASE_URL}/notifications`, {
      ...options,
      config: { ...options?.config, params },
    }),

  markNotificationAsRead: (id: string | number, options?: ApiCallOptions) =>
    apiPut<ApiResponse<any>>(`${BASE_URL}/notifications/${id}/read`, {}, options),

  markAllNotificationsAsRead: (options?: ApiCallOptions) =>
    apiPut<ApiResponse<any>>(`${BASE_URL}/notifications/read-all`, {}, options),

  getWarnings: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<WarningListItem[]>>(`/warnings`, options).then((r) => r.data),

  loginAsStudent: (studentId: number, options?: ApiCallOptions) =>
    apiPost<ApiResponse<LoginResponse>>(
      `/teacher/login-as-student`,
      { student_id: studentId },
      options
    ).then((r) => r.data),
};
