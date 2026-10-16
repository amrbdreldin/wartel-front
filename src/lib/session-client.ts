import { PARENT_USER_KEY } from "@/lib/constants";
import type { User } from "@/types/auth.types";
import Cookies from "js-cookie";

// ============================================================
// Client side of the HttpOnly session
// Tokens are never visible here — the server (api/proxy + api/session)
// owns them. These helpers only talk to those routes.
// ============================================================

/** Marks same-origin app requests so the proxy may use the session cookie (CSRF guard) */
export const CLIENT_REQUEST_HEADER = { "X-Wartel-Client": "1" } as const;

/** True when an auth response opened a server session (the proxy strips the tokens) */
export function hasEstablishedSession(res: unknown): boolean {
  const r = res as { session_established?: boolean; data?: { session_established?: boolean } } | null;
  return Boolean(r?.session_established || r?.data?.session_established);
}

/** A teacher/parent account is saved and can be restored (its user cookie is readable) */
export function hasParentBackup(): boolean {
  return typeof window !== "undefined" && Boolean(Cookies.get(PARENT_USER_KEY));
}

/** Removes the server session cookies. "active" keeps a teacher/parent backup. */
export async function endServerSession(scope: "all" | "active" = "all"): Promise<void> {
  try {
    await fetch("/api/session/logout", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "Content-Type": "application/json", ...CLIENT_REQUEST_HEADER },
      body: JSON.stringify({ scope }),
    });
  } catch {
    // Network failure: cookies stay, the next 401 will clear them
  }
}

/** Swaps the saved teacher/parent session back in; returns its user or null */
export async function restoreServerParentSession(): Promise<User | null> {
  try {
    const res = await fetch("/api/session/restore-parent", {
      method: "POST",
      credentials: "same-origin",
      headers: CLIENT_REQUEST_HEADER,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { user?: User };
    return json.user ?? null;
  } catch {
    return null;
  }
}
