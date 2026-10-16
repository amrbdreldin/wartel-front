---
name: nextjs-component
description: Use when creating a new React component or page, adding a dashboard page for a role, splitting an existing component, or deciding where "use client" goes in src/app/[locale] or src/components. Covers file placement, server/client boundary, reusing ui/forms primitives, typing, and loading/empty/error states.
---

# Components & pages in Waratel

**This is Next.js 16** (App Router, React 19). APIs differ from older versions — check `node_modules/next/dist/docs/` before using a Next API you're unsure about (e.g. `params` is a `Promise`, `middleware` is being renamed `proxy`).

## 1. Reuse first
Grep before writing: `src/components/ui/*` (shadcn base-nova on Base UI), `src/components/forms/*`, `src/components/common/*`, sibling `_components/` folders. Look for an existing screen with the same shape (see `screen-design` table).

## 2. Placement
| What | Where |
|---|---|
| Route | `src/app/[locale]/(dashboard)/<role>/<page>/page.tsx` (or `(auth)/…`, public at `[locale]/…`) |
| Used only by that route | `…/<page>/_components/PascalCase.tsx` |
| Shared across roles in one domain | `src/components/<domain>/` (e.g. `contact/`, `student/`) |
| App-wide building block | `src/components/common/` |
| shadcn primitive | `src/components/ui/` (add via `npx shadcn add <x>` — it uses base-nova/Base UI) |
| Types | `src/types/<domain>.types.ts` |

## 3. Server vs client
- Dashboard pages are client components today (`"use client"` + TanStack Query hooks) — follow that for consistency.
- Server components: layouts, `generateMetadata`, static/public pages. Use `getTranslations` there, `useTranslations` in client.
- `"use client"` is required for hooks, Redux, `Cookies`, `window`, event handlers. Don't read `window`/`Date.now()` during render (hydration mismatch) — use effects or `useMediaQuery`.
- `useSearchParams` needs a `<Suspense>` boundary (see `ContactUsView` inner/outer split).
- Dynamic params: `params: Promise<{ locale: string; id: string }>` → `const { id } = await params` (server) or `use(params)` / `useParams()` (client).

## 4. New dashboard page checklist
1. `page.tsx` with page wrapper `space-y-4 sm:space-y-6 animate-in fade-in duration-500` and a single `h1` (see `ui-patterns`).
2. Data via a hook in `src/hooks/api/use<Domain>Queries.ts` (not an inline `useQuery` with an ad-hoc key — see `api-endpoint`).
3. Loading / error / empty / data branches.
4. Nav entry in `src/config/navigation.ts` + route access in `src/utils/permissions.ts` if it's a new prefix (see `permissions`).
5. i18n keys in `ar.json` + `en.json` under the right namespace.
6. Internal links: `` `/${locale}/…` `` with `next/link` (no i18n navigation wrapper exists). `useLocale()` for the locale.

## 5. Component shape
```tsx
"use client";

interface ExamCardProps {
  exam: ExamResult;
  onOpen?: (id: number) => void;
  className?: string;
}

export function ExamCard({ exam, onOpen, className }: ExamCardProps) {
  const t = useTranslations("student");
  …
}
```
- Named exports, `PascalCase.tsx`, props interface above, `className` passthrough merged with `cn()`.
- Strict TS: no `any` (lint flags it) — type API data in `src/types`. Narrow errors with `isAxiosError` or a typed cast, not `any`.
- Keep files < ~250 lines; split presentational parts into `_components/`.
- Images: `next/image` with `sizes`; remote hosts are allowed by `images.remotePatterns` but also need CSP `img-src` (see `third-party-integration`).

## 6. Done
`npx eslint <files>`, `npx tsc --noEmit`, open the route in `ar` and `en`.
