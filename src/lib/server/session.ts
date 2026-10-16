// Server-only module (route handlers). Never import it from client components.
import {
  PARENT_REFRESH_TOKEN_KEY,
  PARENT_TOKEN_KEY,
  PARENT_USER_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  USER_KEY,
} from "@/lib/constants";
import type { NextRequest, NextResponse } from "next/server";

// ============================================================
// Server-owned session cookies
// ------------------------------------------------------------
// Access/refresh tokens live ONLY in HttpOnly cookies set here, so page
// JavaScript (and therefore any XSS) can never read them. The API proxy
// attaches them as a Bearer header and refreshes them transparently.
// User-info cookies stay readable (not secret) because the UI needs them.
// Every authenticated request renews all cookies for SESSION_MAX_AGE
// (rolling), so active users effectively never get logged out by the browser.
// ============================================================

/** 400 days — the maximum cookie lifetime browsers (Chrome) allow */
export const SESSION_MAX_AGE = 400 * 24 * 60 * 60;

const AUTH_COOKIES = [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY] as const;
const PARENT_COOKIES = [PARENT_TOKEN_KEY, PARENT_REFRESH_TOKEN_KEY, PARENT_USER_KEY] as const;
const HTTP_ONLY = new Set<string>([TOKEN_KEY, REFRESH_TOKEN_KEY, PARENT_TOKEN_KEY, PARENT_REFRESH_TOKEN_KEY]);

export interface SessionTokens {
  accessToken: string;
  refreshToken?: string;
}

function isHttps(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim() === "https";
  return req.nextUrl.protocol === "https:";
}

export function setSessionCookie(res: NextResponse, req: NextRequest, name: string, value: string) {
  res.cookies.set(name, value, {
    httpOnly: HTTP_ONLY.has(name),
    secure: isHttps(req),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

function deleteCookie(res: NextResponse, name: string) {
  res.cookies.set(name, "", { path: "/", maxAge: 0 });
}

/** Store freshly issued tokens (login, switch, refresh) */
export function writeTokens(res: NextResponse, req: NextRequest, tokens: SessionTokens) {
  setSessionCookie(res, req, TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) setSessionCookie(res, req, REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/** Re-issue the current cookies with a fresh max-age (rolling session) */
export function renewSession(res: NextResponse, req: NextRequest) {
  for (const name of [...AUTH_COOKIES, ...PARENT_COOKIES]) {
    if (res.cookies.has(name)) continue; // already written by this response
    const value = req.cookies.get(name)?.value;
    if (value) setSessionCookie(res, req, name, value);
  }
}

/** Expired/invalid session: drop the active account (parent backup is kept, as before) */
export function clearActiveSession(res: NextResponse) {
  AUTH_COOKIES.forEach((name) => deleteCookie(res, name));
}

/** Drop the parent/teacher backup (after it was restored) */
export function clearParentBackup(res: NextResponse) {
  PARENT_COOKIES.forEach((name) => deleteCookie(res, name));
}

/** Full logout: active account and any parent/teacher backup */
export function clearAllSessions(res: NextResponse) {
  [...AUTH_COOKIES, ...PARENT_COOKIES].forEach((name) => deleteCookie(res, name));
}

/** Parent/teacher → student switch: keep the current account to return to later */
export function backupActiveSession(res: NextResponse, req: NextRequest) {
  const token = req.cookies.get(TOKEN_KEY)?.value;
  const user = req.cookies.get(USER_KEY)?.value;
  if (!token || !user) return;
  setSessionCookie(res, req, PARENT_TOKEN_KEY, token);
  setSessionCookie(res, req, PARENT_USER_KEY, user);
  const refresh = req.cookies.get(REFRESH_TOKEN_KEY)?.value;
  if (refresh) setSessionCookie(res, req, PARENT_REFRESH_TOKEN_KEY, refresh);
}

/**
 * Basic CSRF guard for cookie-authenticated calls: only same-origin requests
 * (our axios client sends X-Wartel-Client; browsers send Sec-Fetch-Site) may use the cookies.
 */
export function isTrustedClientRequest(req: NextRequest): boolean {
  if (req.headers.get("x-wartel-client") === "1") return true;
  return req.headers.get("sec-fetch-site") === "same-origin";
}

// ── Token extraction from upstream auth responses ───────────

type JsonObject = Record<string, unknown>;
const isObject = (v: unknown): v is JsonObject => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Finds tokens in `{...}` or `{ data: {...} }`, removes them from the payload
 * (the browser must never see them) and marks that object with `session_established`.
 */
export function extractAndStripTokens(body: unknown): SessionTokens | null {
  if (!isObject(body)) return null;
  for (const holder of [body, body.data]) {
    if (!isObject(holder)) continue;
    const access = holder.access_token ?? holder.token;
    if (typeof access !== "string" || !access) continue;
    const refresh = typeof holder.refresh_token === "string" ? holder.refresh_token : undefined;
    delete holder.access_token;
    delete holder.token;
    delete holder.refresh_token;
    holder.session_established = true;
    body.session_established = true;
    return { accessToken: access, refreshToken: refresh };
  }
  return null;
}

// ── Refresh (deduplicated) ──────────────────────────────────

const REFRESH_RESULT_TTL_MS = 30_000;
const refreshInFlight = new Map<string, Promise<SessionTokens | null>>();

/**
 * Exchanges a refresh token once, even when many requests expire at the same moment
 * (rotating refresh tokens would otherwise invalidate each other). The result is kept
 * briefly so requests still carrying the old cookie reuse the new tokens.
 */
export function refreshSession(apiBaseUrl: string, refreshToken: string): Promise<SessionTokens | null> {
  const existing = refreshInFlight.get(refreshToken);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = (await res.json()) as unknown;
      return extractAndStripTokens(json);
    } catch (err) {
      console.error("[session] refresh failed:", err);
      return null;
    }
  })();

  refreshInFlight.set(refreshToken, promise);
  promise.finally(() => setTimeout(() => refreshInFlight.delete(refreshToken), REFRESH_RESULT_TTL_MS));
  return promise;
}
