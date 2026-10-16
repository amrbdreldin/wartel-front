---
name: performance
description: Use when optimizing load speed, bundle size, images, fonts, re-renders, polling, PWA/service worker behavior, SEO metadata, Core Web Vitals (LCP, CLS, INP), or build memory (OOM during `yarn build`), or when adding a heavy library (charts, editors, PDF, audio).
---

# Performance in Waratel

## Constraints
- Build runs on a small server: `--max-old-space-size=1536`, webpack (not turbopack) with cache disabled, `cpus: 1`. A heavy new dependency can OOM the build — check size first (`npx bundle-phobia`-style reasoning; prefer tree-shakable, ESM).
- Users are mostly on phones (students/parents) → optimize the 375px, 4G path.

## Bundle
- Heavy/rarely used UI (charts, audio recorder via `lamejs`, rich modals like `TamamModal`) → `next/dynamic(() => import(...), { ssr: false, loading: () => <Skeleton … /> })`.
- lucide: import named icons only (`import { Bell } from "lucide-react"`) — already tree-shaken; never `import * as Icons`.
- Don't add a library for something a 20-line util does (dates → `Intl`/`utils/format.ts`).
- `console.*` is stripped in production except error/warn.

## Data
- Right `staleTime` (`STALE_TIME.*`) — avoid refetch storms; `refetchOnWindowFocus` is off globally.
- Polling (`refetchInterval`) only while the view is open and relevant; stop when hidden/closed.
- `keepPreviousData` for pagination to avoid flashing skeletons.
- Select narrowly from Redux; memoize derived arrays (`useMemo`) that feed big lists.

## Rendering
- Skeletons sized like the final content (CLS). Fixed dimensions/aspect ratio for images and video embeds.
- Long lists (> ~200 rows) → server pagination, not rendering everything.
- Avoid effects that set state on every render; avoid inline object props on memoized children only when it's measurable.

## Images & fonts
- `next/image` with `sizes` and `priority` only for the LCP image (hero/logo). 6 raw `<img>` tags exist — migrate when touched.
- Fonts via `next/font` (Tajawal, Inter) with `display: swap`; tenant fonts load from Google Fonts at runtime — don't add more weights than needed.

## PWA
Service worker is generated into `public/` on build (`sw.js`, `workbox-*.js`) — don't edit those files. After changing caching-sensitive assets, remember users may get the old SW until `skipWaiting` activates.

## Measure
`yarn build` output (route sizes / First Load JS), Lighthouse mobile on `yarn start`, React DevTools profiler for re-renders. Report before/after numbers, not impressions.
