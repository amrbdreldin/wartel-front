import { apiGet, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { FaqItem } from "@/types/faq.types";

// ============================================================
// FAQ Service
// ============================================================

export const faqService = {
  getFaqs: (options?: ApiCallOptions) =>
    apiGet<ApiResponse<FaqItem[]>>("/faqs", options),
};
