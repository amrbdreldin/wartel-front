import { apiGet, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { GetPublicLibraryParams, PublicLibraryResponseData } from "@/types/library.types";

// ============================================================
// Public Library Service
// ============================================================

export const libraryService = {
  getPublicLibrary: (params?: GetPublicLibraryParams, options?: ApiCallOptions) => {
    const queryParams: Record<string, string | number> = {};

    if (params?.track_id) queryParams.track_id = params.track_id;
    if (params?.course_id) queryParams.course_id = params.course_id;
    if (params?.content_type_id) queryParams.content_type_id = params.content_type_id;
    if (params?.search) queryParams.search = params.search;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.page) queryParams.page = params.page;

    return apiGet<ApiResponse<PublicLibraryResponseData>>("/library", {
      ...options,
      config: {
        ...options?.config,
        params: {
          ...queryParams,
          ...options?.config?.params,
        },
      },
    }).then((r) => r.data);
  },
};
