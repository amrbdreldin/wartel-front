// ============================================================
// Advertisement & Announcements Types
// ============================================================

export type AdPlacement = "header" | "card" | "popup";
export type AdMediaType = "none" | "image" | "video" | "youtube";

export interface AdRole {
  id: number;
  name: string;
}

export interface Ad {
  id: number;
  title: string;
  content: string | null;
  placement: AdPlacement;
  placement_name?: string;
  media_type: AdMediaType;
  media_type_name?: string;
  media_url: string | null;
  youtube_url?: string | null;
  youtube_embed_url: string | null;
  action_url: string | null;
  action_title: string | null;
  role_id?: number | null;
  role_name?: string;
  allowed_roles?: AdRole[];
  target_roles_text?: string | null;
  start_at: string;
  end_at: string | null;
  priority: number;
  created_at?: string;
}

export type AdsGroupedByPlacement = Partial<Record<AdPlacement, Ad[]>>;
export type AdsResponseData = Ad[] | AdsGroupedByPlacement;

export interface GetAdsParams {
  role_id?: number | string | null;
}

