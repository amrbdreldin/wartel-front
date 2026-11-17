// ============================================================
// App-wide Constants
// ============================================================

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Wartel Academy";
/**
 * In production, call the backend API directly from the browser so requests
 * use the visitor's IP/session instead of sharing the Next.js server IP
 * (which triggers upstream WAF/OpenResty 403 blocks).
 * In development, default to the local Next.js /api/proxy route.
 */
const configuredApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_BASE_URL =
  configuredApiBase && configuredApiBase !== "/api/proxy"
    ? configuredApiBase
    : process.env.NODE_ENV === "production"
      ? "https://admin.wartel-academy.com/api"
      : "/api/proxy";
export const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "ar";

// Supported locales
export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

// RTL locales
export const RTL_LOCALES: Locale[] = ["ar"];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Session / Auth
export const TOKEN_KEY = "wartel_access_token";
export const REFRESH_TOKEN_KEY = "wartel_refresh_token";
export const USER_KEY = "wartel_user";
export const PARENT_TOKEN_KEY = "wartel_parent_access_token";
export const PARENT_REFRESH_TOKEN_KEY = "wartel_parent_refresh_token";
export const PARENT_USER_KEY = "wartel_parent_user";
export const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24h

// Stale times (React Query)
export const STALE_TIME = {
  SHORT: 30_000,          // 30 seconds
  MEDIUM: 2 * 60_000,     // 2 minutes
  LONG: 5 * 60_000,       // 5 minutes
  INFINITE: Infinity,     // Never stale
} as const;

// Wartel Brand Colors (for runtime manipulation)
export const BRAND_COLORS = {
  primary: "#008F8F",
  primaryLight: "#00B3B3",
  primaryDark: "#006B6B",
  secondary: "#ED8A22",
  secondaryLight: "#F5A94D",
  secondaryDark: "#C97316",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
} as const;
