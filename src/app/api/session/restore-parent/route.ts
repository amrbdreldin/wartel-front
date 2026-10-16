import {
  PARENT_REFRESH_TOKEN_KEY,
  PARENT_TOKEN_KEY,
  PARENT_USER_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  USER_KEY,
} from "@/lib/constants";
import { clearParentBackup, isTrustedClientRequest, setSessionCookie } from "@/lib/server/session";
import { parseUserCookie } from "@/store/slices/authSlice";
import { type NextRequest, NextResponse } from "next/server";

// ============================================================
// POST /api/session/restore-parent
// Teacher/parent → student switch backs the original account up in
// HttpOnly cookies; this swaps it back in and returns its user.
// ============================================================

export async function POST(req: NextRequest) {
  if (!isTrustedClientRequest(req)) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const token = req.cookies.get(PARENT_TOKEN_KEY)?.value;
  const userRaw = req.cookies.get(PARENT_USER_KEY)?.value;
  const user = parseUserCookie(userRaw);
  if (!token || !userRaw || !user) {
    return NextResponse.json({ success: false, message: "No saved session" }, { status: 404 });
  }

  const res = NextResponse.json({ success: true, user });
  setSessionCookie(res, req, TOKEN_KEY, token);
  setSessionCookie(res, req, USER_KEY, userRaw);
  const refresh = req.cookies.get(PARENT_REFRESH_TOKEN_KEY)?.value;
  if (refresh) setSessionCookie(res, req, REFRESH_TOKEN_KEY, refresh);
  else res.cookies.set(REFRESH_TOKEN_KEY, "", { path: "/", maxAge: 0 });
  clearParentBackup(res);
  return res;
}
