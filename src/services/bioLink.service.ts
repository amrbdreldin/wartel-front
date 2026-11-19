import type { AxiosRequestConfig } from "axios";
import { apiGet, apiPost, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

export type BioPlatform =
  | "facebook"
  | "youtube"
  | "linkedin"
  | "instagram"
  | "twitter"
  | "tiktok"
  | "telegram"
  | "whatsapp"
  | "snapchat"
  | "threads"
  | "website"
  | "email"
  | "phone"
  | "location"
  | "other";

export interface BioLinkItem {
  id: number;
  title: string;
  subtitle?: string | null;
  url: string;
  platform: BioPlatform | string;
  sort_order: number;
}

export interface BioLinkCategorySummary {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  theme_color?: string | null;
  links_count: number;
  public_url: string;
}

export interface BioLinkCategoryDetail {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  theme_color?: string | null;
  links: BioLinkItem[];
}

export type BioLinkCategoriesResponse = ApiResponse<BioLinkCategorySummary[]>;
export type BioLinkCategoryResponse = ApiResponse<BioLinkCategoryDetail | null>;

export const bioLinkService = {
  getCategories: (options?: ApiCallOptions): Promise<BioLinkCategoriesResponse> =>
    apiGet<BioLinkCategoriesResponse>("/bio-links", {
      ...options,
      config: {
        ...options?.config,
        skipGlobalToast: true,
      } as AxiosRequestConfig & { skipGlobalToast?: boolean },
    }),

  getCategoryBySlug: (slug: string, options?: ApiCallOptions): Promise<BioLinkCategoryResponse> =>
    apiGet<BioLinkCategoryResponse>(`/bio-links/${encodeURIComponent(slug)}`, {
      ...options,
      config: {
        ...options?.config,
        skipGlobalToast: true,
      } as AxiosRequestConfig & { skipGlobalToast?: boolean },
    }),

  trackClick: (linkId: number): Promise<ApiResponse<null>> =>
    apiPost<ApiResponse<null>>(`/bio-links/links/${linkId}/click`, undefined, {
      config: {
        skipGlobalToast: true,
      } as AxiosRequestConfig & { skipGlobalToast?: boolean },
    }),
};

/**
 * Sanitize external link URLs so only safe schemes are rendered.
 */
export function sanitizeBioLinkUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}
