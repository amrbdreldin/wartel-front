"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Ad } from "@/types/ad.types";

// ============================================================
// Ads – shared helpers (URL safety + per-session dismissal store)
// ============================================================

const DISMISS_KEY_PREFIX = "wartel_dismissed_ad_";
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

export const getAdDismissKey = (adId: number) => `${DISMISS_KEY_PREFIX}${adId}`;

/** True for absolute http(s) URLs only. */
export function isHttpUrl(url?: string | null): url is string {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/** True for same-origin relative paths ("/x"), rejecting protocol-relative ("//evil.com"). */
export function isRelativePath(url?: string | null): url is string {
  return !!url && url.startsWith("/") && !url.startsWith("//");
}

/**
 * Returns a safe href for backend-provided URLs (blocks `javascript:`, `data:` …),
 * or null when the URL is not an http(s) URL or a relative path.
 */
export function getSafeHref(url?: string | null): string | null {
  const trimmed = url?.trim();
  if (isHttpUrl(trimmed) || isRelativePath(trimmed)) return trimmed;
  return null;
}

/** Extracts a safe YouTube embed URL from an ad object. */
export function getYoutubeEmbedUrl(ad: Ad): string | null {
  if (ad.youtube_embed_url) {
    try {
      const parsed = new URL(ad.youtube_embed_url);
      if (parsed.protocol === "https:" && YOUTUBE_HOSTS.has(parsed.hostname)) {
        return parsed.toString();
      }
    } catch {
      // Fall back to the regex parser below
    }
  }

  const rawUrl = ad.youtube_url || ad.media_url || "";
  const match = rawUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
}

export const hasAdMedia = (ad: Ad) => !!ad.media_type && ad.media_type !== "none";

// ── Dismissal store (sessionStorage + subscribers) ──────────

const listeners = new Set<() => void>();
// In-memory fallback for when sessionStorage is unavailable (private mode / quota)
const memoryDismissed = new Set<number>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isAdDismissed(adId: number): boolean {
  if (memoryDismissed.has(adId)) return true;
  try {
    return sessionStorage.getItem(getAdDismissKey(adId)) === "1";
  } catch {
    return false;
  }
}

export function dismissAd(adId: number) {
  try {
    sessionStorage.setItem(getAdDismissKey(adId), "1");
  } catch {
    // Storage unavailable – keep it dismissed for this page lifetime
    memoryDismissed.add(adId);
  }
  listeners.forEach((listener) => listener());
}

/** Whether the ad was dismissed this session. Treated as dismissed during SSR to avoid a flash. */
export function useIsAdDismissed(adId: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isAdDismissed(adId),
    () => true
  );
}

/** Ads not yet dismissed this session, order preserved. Empty during SSR. */
export function useVisibleAds(ads: Ad[]): Ad[] {
  // Snapshot must be a primitive so React can compare it between renders
  const visibleKey = useSyncExternalStore(
    subscribe,
    () => ads.filter((ad) => !isAdDismissed(ad.id)).map((ad) => ad.id).join(","),
    () => ""
  );

  return useMemo(() => {
    const ids = new Set(visibleKey.split(",").filter(Boolean).map(Number));
    return ads.filter((ad) => ids.has(ad.id));
  }, [ads, visibleKey]);
}
