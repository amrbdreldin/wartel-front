// ============================================================
// Advertisement & Announcements Types
// ============================================================

export type AdPlacement = "header" | "card" | "popup";
export type AdMediaType = "none" | "image" | "video" | "youtube";

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
  role_id: number | null;
  role_name?: string;
  start_at: string;
  end_at: string | null;
  priority: number;
  created_at?: string;
}

export interface GetAdsParams {
  role_id?: number | string | null;
}

