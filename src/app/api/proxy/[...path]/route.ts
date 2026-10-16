import { REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY } from "@/lib/constants";
import {
  backupActiveSession,
  clearActiveSession,
  extractAndStripTokens,
  isTrustedClientRequest,
  refreshSession,
  renewSession,
  setSessionCookie,
  writeTokens,
  type SessionTokens,
} from "@/lib/server/session";
import { type NextRequest, NextResponse } from "next/server";

// ============================================================
// API Proxy Route Handler
// ============================================================
// All client requests hit /api/proxy/... — this server-side
// handler forwards them to the real API_BASE_URL which is
// NEVER exposed to the browser (no NEXT_PUBLIC_ prefix).
// ============================================================

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "[proxy] Missing API_BASE_URL environment variable. " +
    "Add it to your .env.local (without NEXT_PUBLIC_ prefix)."
  );
}

// Helper to check if a form-data value is a File or Blob
function isFileLike(value: FormDataEntryValue): value is File {
  return typeof value === "object" && value !== null && typeof value.arrayBuffer === "function";
}

// HTTP methods we allow through the proxy
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
type AllowedMethod = (typeof ALLOWED_METHODS)[number];

// Headers we do NOT forward upstream (hop-by-hop / host-specific)
const SKIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "transfer-encoding",
  "te",
  "trailers",
  "upgrade",
  "proxy-authorization",
  "proxy-authenticate",
  "content-length", // fetch recalculates this
  "x-recaptcha-token", // Omit custom recaptcha token header from upstream call
  // The upstream API authenticates with the Bearer header only; never leak the
  // frontend's own cookies (tokens, consent, analytics) to another origin.
  "cookie",
  "x-wartel-client", // our same-origin marker, meaningless upstream
]);

// Headers we do NOT forward back to the client
const SKIP_RESPONSE_HEADERS = new Set([
  "transfer-encoding",
  "connection",
  "keep-alive",
  "content-encoding",
  "content-length",
]);

// ─── reCAPTCHA verification helper ───────────────────────────
// OFF unless NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" (the same flag gates the client),
// and then requires RECAPTCHA_SECRET_KEY. While off, auth calls pass through as before.
const RECAPTCHA_SECRET_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" ? process.env.RECAPTCHA_SECRET_KEY : undefined;
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5);

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) return true;
  if (!token) return false;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET_KEY, response: token }),
      cache: "no-store",
    });
    const data = (await response.json()) as { success?: boolean; score?: number; "error-codes"?: string[] };

    if (!data.success) {
      console.error("[proxy] reCAPTCHA siteverify failed", data["error-codes"]);
      return false;
    }
    if (typeof data.score === "number" && data.score < RECAPTCHA_MIN_SCORE) {
      console.warn(`[proxy] reCAPTCHA score below threshold: ${data.score}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[proxy] reCAPTCHA verification request failed:", err);
    return false;
  }
}

// ─── Core proxy handler ───────────────────────────────────────
async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  const { path } = await Promise.resolve(params);
  const method = req.method.toUpperCase() as AllowedMethod;

  // Validate method
  if (!(ALLOWED_METHODS as readonly string[]).includes(method)) {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  const pathStr = path.join("/");
  // Encode each segment individually to properly handle Arabic/Unicode slugs
  // without double-encoding (Next.js decodes path params automatically)
  const encodedPathStr = path.map(segment => encodeURIComponent(segment)).join("/");

  const isLogin = pathStr === "auth/login";
  const isRegister = pathStr === "enrollment/submit";
  const sessionMode = getSessionMode(method, pathStr);

  // Build target URL, preserving query string
  const search = req.nextUrl.search; // e.g. "?page=1&per_page=10"
  const targetUrl = `${API_BASE_URL}/${encodedPathStr}${search}`;

  // Forward safe headers from client → upstream
  const forwardedHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardedHeaders.set(key, value);
    }
  });

  // Authenticate from the HttpOnly session cookie (same-origin requests only — CSRF guard)
  const clientAuth = req.headers.get("authorization");
  const cookieToken = isTrustedClientRequest(req) ? req.cookies.get(TOKEN_KEY)?.value : undefined;
  const usesSessionCookie = !clientAuth && Boolean(cookieToken);
  if (usesSessionCookie) forwardedHeaders.set("authorization", `Bearer ${cookieToken}`);

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: forwardedHeaders,
    // Disable Next.js fetch caching for proxy (always fresh)
    cache: "no-store",
  };

  let recaptchaToken = req.headers.get("x-recaptcha-token") || "";
  let cleanBodyText = "";
  let cleanFormData: FormData | null = null;

  // Intercept and parse body early if it is an auth action
  if (method === "POST" && (isLogin || isRegister)) {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      if (!recaptchaToken) {
        recaptchaToken = (formData.get("recaptcha_token") as string) || "";
      }
      
      // Reconstruct FormData without recaptcha_token so we don't pass it upstream
      cleanFormData = new FormData();
      formData.forEach((value, key) => {
        if (key !== "recaptcha_token") {
          if (isFileLike(value)) {
            cleanFormData!.append(key, value, value.name || "blob");
          } else {
            cleanFormData!.append(key, value);
          }
        }
      });
    } else {
      const text = await req.text();
      cleanBodyText = text;
      if (text) {
        try {
          const bodyJson = JSON.parse(text);
          if (!recaptchaToken) {
            recaptchaToken = bodyJson.recaptcha_token || "";
          }
          
          // Delete it from JSON so we don't pass it upstream
          delete bodyJson.recaptcha_token;
          cleanBodyText = JSON.stringify(bodyJson);
        } catch {
          // Not JSON — forward the body unchanged
        }
      }
    }

    // Perform reCAPTCHA verification if no Authorization header exists OR if a recaptcha token is provided.
    // This handles:
    // - Public login/register: hasAuth is false -> verification is required.
    // - Ongoing login modal: hasAuth is true but recaptchaToken is sent -> verification is performed.
    // - Login as child: hasAuth is true and no recaptchaToken is sent -> verification is skipped.
    const hasAuth = Boolean(clientAuth) || usesSessionCookie;
    const needsVerification = !hasAuth || !!recaptchaToken;
    if (needsVerification) {
      const isValid = await verifyRecaptcha(recaptchaToken);
      if (!isValid) {
        const acceptLang = req.headers.get("Accept-Language") || "ar";
        const isArabic = acceptLang.startsWith("ar");
        const errMsg = isArabic 
          ? "يرجى تأكيد أنك لست روبوتًا" 
          : "Please confirm you are not a robot";
        
        return NextResponse.json(
          { 
            success: false, 
            message: errMsg,
            errors: {
              recaptcha_token: [errMsg]
            }
          }, 
          { status: 400 }
        );
      }
    }
  }

  // Attach body for mutating methods
  if (method !== "GET" && method !== "DELETE") {
    if (isLogin || isRegister) {
      if (cleanFormData) {
        fetchOptions.body = cleanFormData;
        // Let fetch generate its own boundary by stripping the old content-type
        forwardedHeaders.delete("content-type");
      } else if (cleanBodyText) {
        fetchOptions.body = cleanBodyText;
      }
    } else {
      const contentType = req.headers.get("content-type") ?? "";
      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const nonAuthCleanFormData = new FormData();
        formData.forEach((value, key) => {
          if (isFileLike(value)) {
            nonAuthCleanFormData.append(key, value, value.name || "blob");
          } else {
            nonAuthCleanFormData.append(key, value);
          }
        });
        fetchOptions.body = nonAuthCleanFormData;
        // Let fetch generate its own boundary by stripping the old content-type
        forwardedHeaders.delete("content-type");
      } else {
        const text = await req.text();
        if (text) fetchOptions.body = text;
      }
    }
  }

  // ── Perform upstream request ──────────────────────────────
  let upstream: Response;
  let refreshed: SessionTokens | null = null;
  let sessionExpired = false;
  try {
    upstream = await fetch(targetUrl, fetchOptions);

    // Expired access token → refresh server-side once, then retry the original request
    if (upstream.status === 401 && usesSessionCookie && !pathStr.startsWith("auth/")) {
      const refreshToken = req.cookies.get(REFRESH_TOKEN_KEY)?.value;
      refreshed = refreshToken ? await refreshSession(API_BASE_URL!, refreshToken) : null;
      if (refreshed) {
        forwardedHeaders.set("authorization", `Bearer ${refreshed.accessToken}`);
        upstream = await fetch(targetUrl, fetchOptions);
      } else {
        sessionExpired = true;
      }
    }
  } catch (err) {
    console.error("[proxy] Upstream fetch failed:", err);
    return NextResponse.json(
      { success: false, message: "Upstream API unreachable" },
      { status: 502 }
    );
  }

  // If the upstream API fails with a 5xx server error, log this
  if (upstream.status >= 500) {
    console.error(`[proxy] Upstream API returned status ${upstream.status} for ${method} ${pathStr}`, {
      status: upstream.status,
      statusText: upstream.statusText,
      targetUrl,
    });
  }

  // Forward safe response headers back to client
  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!SKIP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  // Auth responses: move tokens into HttpOnly cookies and strip them from the body.
  // Everything else streams straight through to avoid buffering in memory.
  let body: BodyInit | null = upstream.body;
  let issued: SessionTokens | null = null;
  let issuedUser: unknown = null;
  if (sessionMode && upstream.ok) {
    const text = await upstream.text();
    body = text;
    try {
      const json = JSON.parse(text) as Record<string, unknown>;
      issued = extractAndStripTokens(json);
      if (issued) {
        const data = json.data as Record<string, unknown> | undefined;
        issuedUser = data?.user ?? json.user ?? null;
        body = JSON.stringify(json);
      }
    } catch {
      // Not JSON — pass the original text through
    }
  }

  const response = new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });

  if (issued) {
    if (sessionMode === "switch") backupActiveSession(response, req);
    writeTokens(response, req, issued);
    if (issuedUser && typeof issuedUser === "object") {
      setSessionCookie(response, req, USER_KEY, JSON.stringify(issuedUser));
    }
  } else if (refreshed) {
    writeTokens(response, req, refreshed);
  }

  if (sessionExpired) {
    clearActiveSession(response);
  } else if (usesSessionCookie || issued) {
    renewSession(response, req);
  }

  return response;
}

// Endpoints whose successful response carries tokens for a new session.
// "switch" keeps the current account as a backup (teacher/parent → student).
function getSessionMode(method: string, path: string): "login" | "switch" | null {
  if (method !== "POST") return null;
  if (path === "auth/login" || path === "auth/parent/register" || path === "groups/join" || path === "auth/refresh") {
    return "login";
  }
  if (
    path === "teacher/login-as-student" ||
    path === "parent/login-as-student" ||
    /^parent\/children\/[^/]+\/switch$/.test(path)
  ) {
    return "switch";
  }
  return null;
}

// ─── Route exports ────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await params);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, await params);
}
