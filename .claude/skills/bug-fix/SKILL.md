---
name: bug-fix
description: Use when the user reports a bug in Waratel, broken behavior, a QA issue, a console/runtime error, "it doesn't work", wrong data on screen, double toasts, a redirect loop, or a regression — before changing any code.
---

# Bug fixing workflow

Goal: find the root cause, then make the smallest correct fix. Don't patch symptoms.

## 1. Pin the symptom
One line: route, role (student / teacher / parent / parent-viewing-child / teacher-as-student), locale, theme, device, steps, expected vs actual. If something unclear changes where to look, ask **one** question; otherwise proceed.

## 2. Locate
- Route → `src/app/[locale]/(dashboard|auth)/…/page.tsx` → `_components/` → hook in `src/hooks/api/` → service in `src/services/`.
- Visible text → grep it in `src/i18n/messages/ar.json`/`en.json` → grep the key in `src`.
- History: `git log -p -5 -- <file>` — regressions usually come from the last change there.

## 3. Usual root causes here
- **Double / unwanted toast**: component `onError` toasts while `src/lib/axios.ts` already did.
- **Query cache**: key missing a param (page/childId/locale); no `invalidateQueries` after a mutation; `enabled` wrong.
- **Auth**: 401 refresh loop or redirect on a public page (`isCurrentPagePublic`); parent vs child token; stale `role` after switching.
- **Locale/RTL**: works in en, broken in ar (missing key, `left/right` classes, Arabic slug encoding in the proxy).
- **Theme/tenant**: hard-coded colors invisible in dark mode or ignoring tenant brand.
- **Formik**: field `name` ≠ schema key; `undefined` initial value; `enableReinitialize` wiping input; button disabled by `isSubmitting` instead of `isPending`.
- **Next 16**: un-awaited `params`; `useSearchParams` without Suspense; hydration mismatch from `window`/`Date` in render.
- **Proxy/uploads**: content-type boundary, gzip headers, timeout (axios 15s; uploads use `apiUpload`).
- **CSP**: blocked host (see `third-party-integration`).
- **Nullable API fields**: `.map` on undefined, `data?.data?.x` shape mismatch vs types.

## 4. Fix
- Minimal diff in the right layer. Same bug in sibling screens (student/teacher/parent variants)? Fix those too and say so.
- Add a regression unit test when the bug is in pure logic (utils, schemas, services).
- No unrelated refactors.

## 5. Verify & report
Run the relevant parts of `test`. Report 2–4 lines: root cause → fix → files, plus how to reproduce manually (both locales if UI) and any related risk you saw but didn't touch.
