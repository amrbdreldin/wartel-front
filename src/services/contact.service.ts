import { apiGet, apiPost, apiUpload, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  ContactMessage,
  ContactThread,
  ContactThreadsData,
  CreateContactThreadPayload,
  ReplyContactThreadPayload,
} from "@/types/contact.types";

// ============================================================
// Contact & Support Tickets Service
// ============================================================

export const contactService = {
  /**
   * Fetch paginated contact threads
   */
  getThreads: (
    params?: { page?: number; per_page?: number },
    options?: ApiCallOptions
  ) =>
    apiGet<ApiResponse<ContactThreadsData>>("/contact-threads", {
      ...options,
      config: {
        ...options?.config,
        params: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 15,
          ...options?.config?.params,
        },
      },
    }),

  /**
   * Fetch a single thread details with messages
   */
  getThread: (id: number | string, options?: ApiCallOptions) =>
    apiGet<ApiResponse<ContactThread>>(`/contact-threads/${id}`, options),

  /**
   * Create a new contact thread
   */
  createThread: (
    payload: CreateContactThreadPayload,
    options?: ApiCallOptions
  ) => {
    if (payload.file) {
      const formData = new FormData();
      formData.append("subject", payload.subject);
      formData.append("message", payload.message);
      formData.append("file", payload.file);
      return apiUpload<ApiResponse<ContactThread>>(
        "/contact-threads",
        formData,
        options
      );
    }

    return apiPost<ApiResponse<ContactThread>, { subject: string; message: string }>(
      "/contact-threads",
      {
        subject: payload.subject,
        message: payload.message,
      },
      options
    );
  },

  /**
   * Reply to an existing contact thread
   */
  replyThread: (
    payload: ReplyContactThreadPayload,
    options?: ApiCallOptions
  ) => {
    if (payload.file) {
      const formData = new FormData();
      formData.append("message", payload.message);
      formData.append("file", payload.file);
      return apiUpload<ApiResponse<ContactMessage>>(
        `/contact-threads/${payload.threadId}/reply`,
        formData,
        options
      );
    }

    return apiPost<ApiResponse<ContactMessage>, { message: string }>(
      `/contact-threads/${payload.threadId}/reply`,
      {
        message: payload.message,
      },
      options
    );
  },
};
