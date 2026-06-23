import { type NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

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
function isFileLike(value: any): value is { name?: string; arrayBuffer(): Promise<ArrayBuffer> } {
  return (
    value &&
    typeof value === "object" &&
    typeof value.arrayBuffer === "function"
  );
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
async function verifyRecaptcha(token: string): Promise<boolean> {
  // reCAPTCHA bypassed
  return true;
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

  const isLogin = pathStr === "auth/login";
  const isRegister = pathStr === "enrollment/submit";

  // Build target URL, preserving query string
  const search = req.nextUrl.search; // e.g. "?page=1&per_page=10"
  const targetUrl = `${API_BASE_URL}/${pathStr}${search}`;

  // Forward safe headers from client → upstream
  const forwardedHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardedHeaders.set(key, value);
    }
  });

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
            cleanFormData!.append(key, value as any, (value as any).name || "blob");
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
        } catch (err) {
          // Parse error
        }
      }
    }

    // Perform reCAPTCHA verification if no Authorization header exists OR if a recaptcha token is provided.
    // This handles:
    // - Public login/register: hasAuth is false -> verification is required.
    // - Ongoing login modal: hasAuth is true but recaptchaToken is sent -> verification is performed.
    // - Login as child: hasAuth is true and no recaptchaToken is sent -> verification is skipped.
    const hasAuth = !!req.headers.get("authorization");
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
            nonAuthCleanFormData.append(key, value as any, (value as any).name || "blob");
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
  try {
    upstream = await fetch(targetUrl, fetchOptions);
  } catch (err) {
    console.error("[proxy] Upstream fetch failed:", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { success: false, message: "Upstream API unreachable" },
      { status: 502 }
    );
  }

  // If the upstream API fails with a 5xx server error, log this to Sentry
  if (upstream.status >= 500) {
    Sentry.captureMessage(`Upstream API returned status ${upstream.status} for ${method} ${pathStr}`, {
      level: "error",
      extra: {
        status: upstream.status,
        statusText: upstream.statusText,
        targetUrl,
      },
    });
  }

  // Forward safe response headers back to client
  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!SKIP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  // Return proxied response
  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
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
