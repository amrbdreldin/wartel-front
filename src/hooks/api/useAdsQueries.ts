"use client";

import { useQuery } from "@tanstack/react-query";
import { adService } from "@/services/ad.service";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { resolveRoleId } from "@/utils/role";
import type { Ad, AdPlacement, AdsResponseData } from "@/types/ad.types";

const AD_PLACEMENTS: readonly AdPlacement[] = ["header", "card", "popup"];

// ============================================================
// Helpers
// ============================================================

/**
 * Normalizes API ads payload which may be either a flat Ad[] array
 * or an object grouped by placement ({ header: [], card: [], popup: [] }).
 */
export function normalizeAdsData(data?: AdsResponseData | null): Ad[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if (typeof data === "object") {
    return AD_PLACEMENTS.flatMap((placement) => {
      const group = data[placement];
      if (!Array.isArray(group)) return [];
      return group.map((ad) => ({
        ...ad,
        placement: ad.placement || placement,
      }));
    });
  }

  return [];
}

/**
 * Checks if an ad is currently active based on start_at and end_at.
 */
export function isAdActive(ad: Ad): boolean {
  const now = Date.now();

  if (ad.start_at) {
    const start = new Date(ad.start_at).getTime();
    if (!Number.isNaN(start) && now < start) {
      return false;
    }
  }

  if (ad.end_at) {
    const end = new Date(ad.end_at).getTime();
    if (!Number.isNaN(end) && now > end) {
      return false;
    }
  }

  return true;
}

/**
 * Sorts ads by priority descending (higher number shows first).
 */
export function sortAdsByPriority(ads: Ad[]): Ad[] {
  return [...ads].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

/**
 * Filters ads for a specific placement and sorts them by priority.
 */
export function getAdsByPlacement(ads: Ad[] = [], placement: AdPlacement): Ad[] {
  return sortAdsByPriority(
    ads.filter((ad) => ad.placement === placement && isAdActive(ad))
  );
}

/**
 * Automatically resolves the active role ID based on:
 * 1. Explicit parameter if provided.
 * 2. Current user's role_id.
 * 3. Current user's role name resolved via resolveRoleId.
 * 4. Route segment detection (/teacher, /student, /parent) via resolveRoleId.
 * Always returned as a string so "2" and 2 share one cache entry.
 */
const isPresent = (value: unknown): value is number | string =>
  value !== undefined && value !== null && value !== "";

/** Dashboard route segments that map to a role (e.g. "/ar/teacher/…" → teacher). */
const DASHBOARD_ROLE_SEGMENTS = ["teacher", "student", "parent"] as const;

export function useResolvedRoleId(explicitRoleId?: number | string | null): string | null {
  const { user } = useAuth();
  const pathname = usePathname();

  if (isPresent(explicitRoleId)) return String(explicitRoleId);
  if (isPresent(user?.role_id)) return String(user.role_id);
  if (user?.role) return resolveRoleId(user.role);

  // Pathname fallback – match whole segments only
  const segments = pathname?.split("/") ?? [];
  const routeRole = DASHBOARD_ROLE_SEGMENTS.find((role) => segments.includes(role));
  return routeRole ? resolveRoleId(routeRole) : null;
}

// ============================================================
// Ads React Query Hook
// ============================================================

export const adsKeys = {
  list: (roleId: string | null) => ["ads", roleId ?? "all"] as const,
};

export function useAdsQuery(roleId?: number | string | null) {
  const resolvedRoleId = useResolvedRoleId(roleId);

  return useQuery({
    queryKey: adsKeys.list(resolvedRoleId),
    queryFn: async () => {
      const response = await adService.getAds(
        resolvedRoleId !== null ? { role_id: resolvedRoleId } : undefined
      );
      return normalizeAdsData(response?.data);
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

