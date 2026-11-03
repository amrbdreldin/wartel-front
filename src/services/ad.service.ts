import { apiGet, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { Ad, GetAdsParams } from "@/types/ad.types";

// ============================================================
// Ads Service
// ============================================================

export const adService = {
  /**
   * Fetch active ads targeted by user role or for all users.
   *
   * @param params.role_id - Role ID filter (e.g., 1 for student, 2 for teacher, 5 for parent).
   *                         If omitted or null, returns ads available for all users.
   */
  getAds: (params?: GetAdsParams, options?: ApiCallOptions) => {
    const queryParams: Record<string, string | number> = {};

    if (params?.role_id !== undefined && params?.role_id !== null && params.role_id !== "") {
      queryParams.role_id = params.role_id;
    }

    return apiGet<ApiResponse<Ad[]>>("/ads", {
      ...options,
      config: {
        ...options?.config,
        params: {
          ...queryParams,
          ...options?.config?.params,
        },
      },
    });
  },
};

