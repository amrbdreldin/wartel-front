"use client";

import { useSyncExternalStore } from "react";

// ============================================================
// useMediaQuery – Responsive breakpoint detection
// ============================================================

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(query).matches;
    },
    () => false
  );
}

// Pre-defined breakpoints (Tailwind defaults)
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
