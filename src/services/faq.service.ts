import { apiGet, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { FaqCategory } from "@/types/faq.types";

// ============================================================
// FAQ Service
// ============================================================

export const faqService = {
  getFaqs: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<FaqCategory[]>>("/faqs", options),
};
