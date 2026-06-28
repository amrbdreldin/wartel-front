import { apiGet, apiPost, apiPut, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api.types";
import type {
  ExcuseRecord,
  ExcuseSubmission,
  GradeRecord,
  LibraryResponseData,
  StudentDashboard,
  StudentNotification,
  StudentSettings,
  TamamSubmission,
  ExamGradesResponseData,
  StudentLeavesResponseData,
  StudentDashboardResponseData,
  TamamHistoryResponseData,
  TamamSubmissionRequest,
  TamamRecord,
  ExamDetails,
  ExamSubmitResponse,
  ExamResultData,
  StudentDetailedProfileResponse,
  WarningListItem,
  WerdRecord,
} from "@/types/student.types";

// ============================================================
// Student Service
// ============================================================

const BASE_URL = "/student";

export const studentService = {
  getDashboard: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<StudentDashboardResponseData>>(`${BASE_URL}/dashboard`, options).then((r) => r),

  submitTamam: (data: TamamSubmissionRequest, options?: ApiCallOptions) =>
    apiPost<ApiResponse<TamamRecord>>(`${BASE_URL}/tamam`, data, options).then((r) => r),

  getTamamHistory: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<TamamHistoryResponseData>>(`${BASE_URL}/tamam/history`, options).then((r) => r),

  searchBuddies: (phone: string, options?: ApiCallOptions) =>
    apiPost<ApiResponse<{ id: number; name: string; status: string }>>(`${BASE_URL}/search-buddies`, { phone }, options).then((r) => r),

  submitBuddyPair: (studentId: number, options?: ApiCallOptions) =>
    apiPost<ApiResponse<any>>(`${BASE_URL}/buddy-pairs`, { student_id: studentId }, options).then((r) => r),

  getGrades: (params?: QueryParams, options?: ApiCallOptions) =>
    apiGet<PaginatedResponse<GradeRecord>>(`${BASE_URL}/grades`, {
      ...options,
      config: { ...options?.config, params },
    }),

  getExcuses: (params?: QueryParams, options?: ApiCallOptions) =>
    apiGet<PaginatedResponse<ExcuseRecord>>(`${BASE_URL}/excuses`, {
      ...options,
      config: { ...options?.config, params },
    }),

  submitExcuse: (data: ExcuseSubmission, options?: ApiCallOptions) =>
    apiPost<ApiResponse<any>>(`${BASE_URL}/request-leave`, data, options).then((r) => r),

  getNotifications: (params?: QueryParams, options?: ApiCallOptions) =>
    apiGet<PaginatedResponse<StudentNotification>>(`${BASE_URL}/notifications`, {
      ...options,
      config: { ...options?.config, params },
    }),

  getLibrary: (params?: QueryParams, options?: ApiCallOptions) =>
    apiGet<ApiResponse<LibraryResponseData>>(`${BASE_URL}/library`, {
      ...options,
      config: {
        ...options?.config,
        params,
      },
    }).then((r) => r),

  getSettings: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<StudentSettings>>(`${BASE_URL}/settings`, options).then((r) => r),

  updateSettings: (data: Partial<StudentSettings>, options?: ApiCallOptions) =>
    apiPut<ApiResponse<StudentSettings>>(`${BASE_URL}/settings`, data, options).then((r) => r),

  updateProfile: (data: any, options?: ApiCallOptions) =>
    apiPut<ApiResponse<any>>(`${BASE_URL}/profile`, data, options).then((r) => r),

  getLeaves: (params?: QueryParams, options?: ApiCallOptions) => {
    return apiGet<ApiResponse<StudentLeavesResponseData>>(`${BASE_URL}/leaves`, {
      ...options,
      config: {
        ...options?.config,
        params,
      },
    }).then((r) => r);
  },

  getExamGrades: (params?: QueryParams, options?: ApiCallOptions) => {
    return apiGet<ApiResponse<ExamGradesResponseData>>(`${BASE_URL}/exam-grades`, {
      ...options,
      config: {
        ...options?.config,
        params,
      },
    }).then((r) => r);
  },

  getSessionAttendance: (sessionId: string | number, options?: ApiCallOptions) =>
    apiGet<ApiResponse<any>>(`${BASE_URL}/sessions/${sessionId}/attendance`, options).then((r) => r.data),

  submitSessionAttendance: (data: any, options?: ApiCallOptions) =>
    apiPost<ApiResponse<any>>(`${BASE_URL}/attendance`, data, options),

  getExam: (examId: string | number, options?: ApiCallOptions) =>
    apiGet<ApiResponse<ExamDetails>>(`${BASE_URL}/exams/${examId}`, options).then((r) => r),

  submitExamAnswers: (examId: string | number, answers: Record<string, any>, options?: ApiCallOptions) =>
    apiPost<ApiResponse<ExamSubmitResponse>>(`${BASE_URL}/exams/${examId}/submit`, { answers }, options).then((r) => r),

  getExamResult: (examId: string | number, options?: ApiCallOptions) =>
    apiGet<ApiResponse<ExamResultData>>(`${BASE_URL}/exams/${examId}/result`, options).then((r) => r),

  getDetailedProfile: (userId: string | number, options?: ApiCallOptions) =>
    apiGet<ApiResponse<StudentDetailedProfileResponse>>(`${BASE_URL}/${userId}/profile-details`, options).then((r) => r.data),

  markNotificationAsRead: (id: string | number, options?: ApiCallOptions) =>
    apiPut<ApiResponse<any>>(`${BASE_URL}/notifications/${id}/read`, {}, options),

  markAllNotificationsAsRead: (options?: ApiCallOptions) =>
    apiPut<ApiResponse<any>>(`${BASE_URL}/notifications/read-all`, {}, options),

  getWarnings: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<WarningListItem[]>>(`/warnings`, options).then((r) => r.data),

  getWerds: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<WerdRecord[]>>(`/werds`, options).then((r) => r),
};

