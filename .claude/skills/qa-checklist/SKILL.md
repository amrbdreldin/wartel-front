---
name: qa-checklist
description: Use when the user says a Waratel feature is "ready for QA", asks for a test plan, test cases, a QA handoff, "what should I test", or wants to self-check a change/branch before handing it over.
---

# QA checklist / handoff

Output a short, **specific** checklist for this change — not a generic one.

## 1. Scope
`git diff --stat main...HEAD` (or the uncommitted diff / named commits). Map files → screens and flows (routes under `src/app/[locale]/…`). Note shared code that can regress elsewhere: `components/ui/*`, `components/forms/*`, `DataTable`, `lib/axios.ts`, proxy route, `middleware.ts`, `navigation.ts`, `globals.css`.

## 2. Checklist (only rows that apply)
**Happy path** — steps with expected results.

**Roles** — student, teacher, parent, parent viewing a child, teacher switched to student, logged-out visitor (public pages: landing, courses, register, login). Each sees only what they should.

**Language & direction** — Arabic (RTL) + English: no raw keys, layout mirrored, arrows flipped, numbers/phones readable.

**Theme & tenant** — light + dark: no invisible text/borders; brand colors follow the academy theme.

**Forms** — required/invalid input errors in both languages, scroll to first error, double-submit safe, server validation errors shown once (no double toast), values kept on error, success message/view.

**Data states** — loading skeleton, empty, API error, long Arabic names, many rows/pagination, slow network.

**Real-time** — notifications (FCM) and polling (tickets every 15s) update without reload.

**Responsive & PWA** — 375px phone, tablet, desktop; no horizontal scroll; bottom sheets usable; installed PWA if relevant.

**Media** — audio recording/upload, images (size/type limits), YouTube/Jitsi embeds load (no CSP errors).

**Regression** — the 2–3 other screens that use the shared code changed.

## 3. Pre-flight
Run the `test` skill (i18n parity, tsc, eslint on changed files, `yarn test`, build if needed). No debug UI or `console.log` left.

## 4. Output
```
**QA Handoff — <feature> — <date>**
Where: <screens / URLs>   Accounts needed: <roles>

Test cases
1. <Action> → <expected>

Edge cases
- …

Regression to check
- …

Known limitations / not in scope
- …
```
Plain language; no file names unless QA asks.
