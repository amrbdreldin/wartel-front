import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// AI crawlers are allowed (GEO/AEO) but throttled so a crawl burst can't overload the server.
// Keep in sync with AI_BOTS in src/lib/seo.ts.
const AI_BOT_REGEX =
  /gptbot|oai-searchbot|chatgpt-user|claudebot|claude-user|claude-searchbot|perplexitybot|perplexity-user|google-extended|applebot-extended|duckassistbot|meta-externalagent|amazonbot|ccbot|cohere-ai|mistralai-user/i;
const AI_BOT_LIMIT = 30; // requests per window, per bot family
const AI_BOT_WINDOW_MS = 60_000;
const aiBotHits = new Map<string, { count: number; resetAt: number }>();

/** Fixed-window limiter keyed by bot family (in-memory, per server instance). Returns Retry-After seconds when over the limit. */
function aiBotRetryAfter(bot: string): number | null {
  const now = Date.now();
  const entry = aiBotHits.get(bot);
  if (!entry || now >= entry.resetAt) {
    aiBotHits.set(bot, { count: 1, resetAt: now + AI_BOT_WINDOW_MS });
    return null;
  }
  entry.count += 1;
  return entry.count > AI_BOT_LIMIT ? Math.ceil((entry.resetAt - now) / 1000) : null;
}

export function middleware(request: NextRequest) {
  // Block abusive scraper bots early to save bandwidth/compute.
  // Keep this list in sync with BLOCKED_BOTS in src/lib/seo.ts.
  const userAgent = request.headers.get("user-agent") || "";
  const botRegex = /bytespider|petalbot|semrushbot|ahrefsbot|dotbot|mj12bot/i;
  if (botRegex.test(userAgent)) {
    return new NextResponse("Access Denied: Blocked Bot", { status: 403 });
  }

  // Throttle AI crawlers – 429 + Retry-After is the standard "slow down" signal they honour
  const aiBot = userAgent.match(AI_BOT_REGEX)?.[0].toLowerCase();
  if (aiBot) {
    const retryAfter = aiBotRetryAfter(aiBot);
    if (retryAfter !== null) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }
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
