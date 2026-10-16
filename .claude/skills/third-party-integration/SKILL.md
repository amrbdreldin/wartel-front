---
name: third-party-integration
description: Use when adding or changing an external service, script, SDK, iframe, video/meeting embed (YouTube, Jitsi, Google Meet), image/media host (R2, admin domain), font, analytics, Firebase/FCM, reCAPTCHA, or any new domain the browser must reach — or when debugging a CSP "Refused to load/connect/frame" error or a proxy/upload issue.
---

# Third-party integrations (CSP, proxy, env)

## CSP lives in `src/middleware.ts`
A static CSP string is built per request (a nonce is generated and set as `x-nonce`, but scripts currently rely on `'unsafe-inline'`). Add the new origin to the **narrowest** directive:
| Loading… | Directive |
|---|---|
| `<script>` / SDK | `script-src` |
| XHR/fetch/websocket | `connect-src` |
| `<iframe>` (video, meeting) | `frame-src` (+ `Permissions-Policy` for camera/mic) |
| `<img>` / `next/image` source | `img-src` (also allowed by `images.remotePatterns: **` in `next.config.mjs`) |
| audio/video | `media-src` |
| CSS / fonts | `style-src` / `font-src` (only Google Fonts today — tenant fonts load from there) |
- Never add `*` or `https:`; use exact hosts or `https://*.domain`.
- Don't add CSP in `next.config.mjs` (would conflict).
- Note: Next 16 renames `middleware` → `proxy` (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`). Don't migrate unless asked.

## Backend calls go through the proxy
`src/app/api/proxy/[...path]/route.ts` forwards to `API_BASE_URL` (server-only env). Don't add new `NEXT_PUBLIC_` backend URLs. Keep: per-segment `encodeURIComponent` (Arabic slugs), stripping hop-by-hop headers and the browser `cookie`, re-building `FormData` without the incoming `content-type`, dropping `content-encoding`/`content-length` on the way back, and the HttpOnly session handling (cookie → Bearer, server refresh, token stripping — see `nextjs-data`).

## Env
`.env.local` holds secrets — never read, print or commit it. Server-only vars: no prefix. Browser vars: `NEXT_PUBLIC_*` (public by definition). Document new vars for the user instead of editing env files.

## Existing integrations
Firebase (FCM push: `src/lib/firebase.ts`, `utils/firebaseMessaging.ts`, `FirebaseNotificationListener`, service worker), Google Analytics via `@next/third-parties` (`DynamicAnalyticsProvider`), reCAPTCHA v3 (`utils/recaptcha.ts`; server verify currently bypassed), YouTube embeds, Jitsi/Google Meet sessions, PWA (`@ducanh2912/next-pwa`, disabled in dev), WhatsApp floating link.

## Load scripts lazily
`next/script` with `strategy="lazyOnload"`/`afterInteractive`, or dynamic `import()` inside the effect that needs it. Never block first paint.

## Verify
`yarn dev`, open the feature, DevTools console → no `Refused to …` CSP errors; Network → requests go to `/api/proxy/…`. Production-only behavior (PWA, `upgrade-insecure-requests`) needs `yarn build && yarn start`.
