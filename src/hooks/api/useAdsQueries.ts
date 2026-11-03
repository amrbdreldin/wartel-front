"use client";

import { useQuery } from "@tanstack/react-query";
import { adService } from "@/services/ad.service";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { resolveRoleId } from "@/utils/role";
import type { Ad, AdPlacement } from "@/types/ad.types";

// ============================================================
// Helpers
// ============================================================

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
 * 4. Route pathname detection (/teacher -> 2, /student -> 1, /parent -> 5).
 */
export function useResolvedRoleId(explicitRoleId?: number | string | null): number | string | null {
  const { user } = useAuth();
  const pathname = usePathname();

  if (explicitRoleId !== undefined && explicitRoleId !== null && explicitRoleId !== "") {
    return explicitRoleId;
  }

  if (user?.role_id !== undefined && user?.role_id !== null && user.role_id !== "") {
    return user.role_id;
  }

  if (user?.role) {
    return resolveRoleId(user.role);
  }

  // Pathname fallback
  if (pathname) {
    if (pathname.includes("/teacher")) return 2;
    if (pathname.includes("/student")) return 1;
    if (pathname.includes("/parent")) return 5;
  }

  return null;
}

// ============================================================
// Ads React Query Hook
// ============================================================

export function useAdsQuery(roleId?: number | string | null) {
  const resolvedRoleId = useResolvedRoleId(roleId);

  return useQuery({
    queryKey: ["ads", resolvedRoleId ?? "all"],
    queryFn: async () => {
      const response = await adService.getAds(
        resolvedRoleId !== null ? { role_id: resolvedRoleId } : undefined
      );
      const data = response?.data;
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

