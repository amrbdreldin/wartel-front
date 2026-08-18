import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Simple Edge Rate Limiter (Tracks requests per IP across Edge Node executions)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 50; // Max requests
const RATE_WINDOW = 60 * 1000; // 1 minute window
const CLEANUP_INTERVAL = 2 * 60 * 1000; // Run cleanup every 2 minutes
const MAX_MAP_SIZE = 10_000; // Hard cap to prevent unbounded memory growth
let lastCleanup = Date.now();

// Purge stale entries AND enforce hard cap to prevent memory leak
function cleanupRateLimitMap() {
  const now = Date.now();

  // 1. Remove entries older than 2× the rate window
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.timestamp > RATE_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }

  // 2. If still over the hard cap, evict the oldest entries until at 50% capacity
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    const entries = [...rateLimitMap.entries()].sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    );
    const toRemove = entries.length - Math.floor(MAX_MAP_SIZE / 2);
    for (let i = 0; i < toRemove; i++) {
      rateLimitMap.delete(entries[i][0]);
    }
  }

  lastCleanup = now;
}

export function middleware(request: NextRequest) {
  // Block aggressive crawler / scraper bots early to save bandwidth/compute
  const userAgent = request.headers.get("user-agent") || "";
  const botRegex = /bytespider|petalbot|gptbot|claudebot|ccbot|google-extended|applebot-extended|amazonbot|semrushbot|ahrefsbot|dotbot|mj12bot|cohere-ai|meta-externalagent/i;
  if (botRegex.test(userAgent)) {
    return new NextResponse("Access Denied: Blocked Bot", { status: 403 });
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  request.headers.set("x-nonce", nonce);

  const { pathname } = request.nextUrl;

  // 1. Edge Geolocation Router for the Root Path
  if (pathname === "/") {
    const country = request.headers.get("x-vercel-ip-country");
    const arabicSpeakingCountries = ["SA", "AE", "EG", "JO", "QA", "KW", "BH", "OM"];
    const targetLocale = !country || arabicSpeakingCountries.includes(country) ? "ar" : "en";
    
    return NextResponse.redirect(new URL(`/${targetLocale}`, request.url));
  }

  // 2. Edge Rate Limiting (DOS Protection)
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (ip !== "unknown" && !pathname.startsWith("/_next/")) {
    const currentTime = Date.now();

    // Cleanup: run on timer OR when map exceeds hard cap (Memory Leak fix)
    if (currentTime - lastCleanup > CLEANUP_INTERVAL || rateLimitMap.size > MAX_MAP_SIZE) {
      cleanupRateLimitMap();
    }

    const clientData = rateLimitMap.get(ip) || { count: 0, timestamp: currentTime };
    
    if (currentTime - clientData.timestamp > RATE_WINDOW) {
      // Reset window
      rateLimitMap.set(ip, { count: 1, timestamp: currentTime });
    } else {
      clientData.count++;
      rateLimitMap.set(ip, clientData);
      
      if (clientData.count > RATE_LIMIT) {
        return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }

  // 3. Execute localization routing
  const response = intlMiddleware(request);

  // 4. Security Hardening: Content Security Policy & Standard Security Headers
  
  const isDev = process.env.NODE_ENV !== "production";
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://recaptcha.net/recaptcha/;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' blob: data: https://www.transparenttextures.com https://img.youtube.com https://*.ytimg.com https://*.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://recaptcha.net/recaptcha/ https://*.r2.dev https://admin.wartel-academy.com;
    connect-src 'self' https://api.warattel.com https://*.google-analytics.com https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://recaptcha.net/recaptcha/ https://*.r2.dev https://admin.wartel-academy.com;
    frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://www.recaptcha.net/recaptcha/ https://recaptcha.net/recaptcha/ https://www.youtube.com https://www.youtube-nocookie.com https://meet.jit.si https://*.jit.si https://meet.google.com;
    media-src 'self' blob: https://wartel.amrbdr.com https://api.warattel.com https://*.r2.dev https://admin.wartel-academy.com;
    worker-src 'self' blob:;
    child-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDev ? "" : "upgrade-insecure-requests;"}
  `.replace(/\s{2,}/g, " ").trim();

  // Set CSP and strict HTTP headers
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self \"https://meet.jit.si\" \"https://*.jit.si\" \"https://meet.google.com\"), microphone=(self \"https://meet.jit.si\" \"https://*.jit.si\" \"https://meet.google.com\"), geolocation=(self)"
  );
  // HSTS (Strict-Transport-Security) for Enterprise SSL enforcement (1 year)
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  return response;
}

export const config = {
  // Match all pathnames except for:
  // - API routes (/api/...)
  // - Static files (/_next/..., favicon, etc.)
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!api|_next|_vercel|monitoring|.*\\..*).*)",
  ],
};
export default middleware;
