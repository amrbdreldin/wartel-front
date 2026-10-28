import { type NextRequest, NextResponse } from "next/server";

// ============================================================
// File Download Route Handler
// ============================================================
// Storage (Cloudflare R2 / backend storage) doesn't send CORS
// headers, so the browser can't fetch files as blobs, and the
// `download` attribute is ignored cross-origin. This handler
// fetches the file server-side and returns it as an attachment.
// Usage: /api/download?url=<file url>&name=<file name without ext>
// ============================================================

// Only these hosts may be fetched — keeps this from being an open proxy
const ALLOWED_HOST_SUFFIXES = [".r2.dev", "wartel.amrbdr.com"];

function isAllowedHost(hostname: string) {
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => hostname === suffix.replace(/^\./, "") || hostname.endsWith(suffix)
  );
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  const name = req.nextUrl.searchParams.get("name") || "file";

  let target: URL;
  try {
    target = new URL(rawUrl ?? "");
  } catch {
    return NextResponse.json({ message: "Invalid url" }, { status: 400 });
  }

  if (target.protocol !== "https:" || !isAllowedHost(target.hostname)) {
    return NextResponse.json({ message: "Host not allowed" }, { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, { cache: "no-store" });
  } catch (err) {
    console.error("[download] Upstream fetch failed:", err);
    return NextResponse.json({ message: "File unreachable" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: "File not found" }, { status: upstream.status || 404 });
  }

  // Keep the original extension (jpg / png / pdf ...)
  const ext = target.pathname.split(".").pop()?.toLowerCase();
  const fileName = ext && ext.length <= 5 ? `${name}.${ext}` : name;
  // ASCII fallback + UTF-8 name so Arabic titles survive
  const asciiName = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
  );
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new NextResponse(upstream.body, { status: 200, headers });
}
