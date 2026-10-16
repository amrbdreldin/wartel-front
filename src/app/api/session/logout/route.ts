import { clearActiveSession, clearAllSessions, isTrustedClientRequest } from "@/lib/server/session";
import { type NextRequest, NextResponse } from "next/server";

// ============================================================
// POST /api/session/logout
// Session cookies are HttpOnly, so only the server can remove them.
// Body { scope: "active" } drops just the current account (expired session);
// default drops everything, including a teacher/parent backup.
// ============================================================

export async function POST(req: NextRequest) {
  if (!isTrustedClientRequest(req)) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { scope } = (await req.json().catch(() => ({}))) as { scope?: string };
  const res = NextResponse.json({ success: true });
  if (scope === "active") clearActiveSession(res);
  else clearAllSessions(res);
  return res;
}
