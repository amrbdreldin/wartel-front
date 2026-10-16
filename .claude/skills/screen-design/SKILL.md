---
name: screen-design
description: Use when asked to build a NEW screen, page, dashboard, feature view or landing section that has no Figma/mockup — "design a page for X", "make the UI for this endpoint", "build the teacher reports screen", "the design is up to you", or when the user only gives an API response / a rough idea. Plans the layout from data and user goals, confirms a wireframe, then builds with ui-design + ui-patterns.
---

# Designing a screen without Figma

Goal: a screen that looks like it belongs to Waratel (not a generic template) and answers the user's real question on that page.

## 1. Understand (no code yet)
- **Who**: student / teacher / parent (child account? teacher acting as student?). Device: students & parents are mostly on phones → design 375px first.
- **Job**: the one question the user opens this page to answer (e.g. "did my son attend this week?", "which students haven't submitted werd?"). Write it in one line.
- **Data**: read the service + types (`src/services/*.service.ts`, `src/types/*.types.ts`) or the API sample the user gave. List the fields, mark which ones drive a decision (status, date, score, count) vs. detail.
- **Actions**: primary (max one), secondary, destructive. Which need a modal?
- **Closest existing screen**: find a sibling in `src/app/[locale]/(dashboard)/<role>/` with the same shape (list, detail, form, stats). Reuse its structure — consistency beats novelty.

## 2. Pick the layout archetype
| Need | Archetype | Reference |
|---|---|---|
| Overview / home | Hero banner + stat row + 2–3 priority cards | `student/page.tsx`, `teacher/page.tsx` |
| Many records, compare/filter | Header + `DataTable` | `student/excuses`, `student/werd` |
| Few rich records | Header + card grid | `student/my-groups`, `student/grades` |
| Conversation / inbox | List + detail split | `components/contact/ContactUsView.tsx` |
| One record | Header with back + summary card + sections/tabs | `…/profile-details` |
| Create / edit | Modal (≤6 fields) or page form (more) | `CreateTicketModal`, `RegisterForm` |

## 3. Wireframe → confirm
Before coding a whole new screen, show a short ASCII wireframe for mobile and desktop plus the hierarchy decisions, e.g.:
```
Mobile                     Desktop (lg)
[icon] Title     [+ New]   [icon] Title                    [+ New]
[stat][stat]               [stat]   [stat]   [stat]
[stat]                     ┌ table ──────────────────────────────┐
┌ card ─────────┐          │ name | date | status pill | actions │
│ name   [pill] │          └─────────────────────────────────────┘
│ date · group  │
└───────────────┘
```
Ask for OK only if the screen is new and non-trivial; for a small addition to an existing page just build it consistently.

## 4. Design rules that make it look intentional
- **Hierarchy**: one focal element (hero number, primary CTA or the table). Everything else is quieter: muted text, outline buttons.
- **Data-first**: show the decision fields up front (status pill, date, score); move IDs/notes into detail/expand.
- **Density by role**: teacher screens = denser (tables, compact cards); student/parent = larger touch targets, friendlier cards, encouraging empty states.
- **Rhythm**: same padding inside all cards of a page; section gaps > in-card gaps.
- **Color budget**: primary for action/active, accent for one highlight, semantic colors only for status. One gradient surface per screen at most.
- **Islamic/Quran context**: calm, respectful tone; no playful emoji in core flows; Arabic copy written natively, not translated word-for-word.
- **Every state designed**: loading (skeleton shaped like content), empty (icon + why + next action), error (+ retry), partial data (missing fields show "—").
- Avoid template-look: no three identical icon cards with lorem text, no centered everything, no random gradients/shadows.

## 5. Build
1. Route `src/app/[locale]/(dashboard)/<role>/<page>/page.tsx` + `_components/` (see `nextjs-component`).
2. Data via service + hook (see `api-endpoint`).
3. Blocks from `ui-patterns`, tokens from `ui-design`, text via `i18n` (ar + en together).
4. Nav item in `src/config/navigation.ts` if it's a top-level page (see `permissions`).

## 6. Visual verification (required — there is no design to compare to)
Run `yarn dev` and check `/ar/...` and `/en/...` at 375px, 768px, 1280px, light + dark:
- nothing overflows horizontally; long Arabic names truncate/wrap gracefully
- direction-aware icons point the right way in RTL
- loading/empty/error states actually render (throttle network or force an empty response)
If you can't open a browser, say so and list exactly what the user should look at.
