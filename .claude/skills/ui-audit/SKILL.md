---
name: ui-audit
description: Use when the user asks to polish, unify, audit, "make it look better/consistent/professional", fix the design of an existing page/component, check dark mode or RTL, or migrate hard-coded colors to tokens. Audits against the Waratel design system, then fixes in small behavior-preserving steps.
---

# UI audit & polish

## 1. Scope
One page/feature at a time: the route's `page.tsx` + its `_components/` + any feature component it imports. Don't touch shared `components/ui/*` unless asked (they're shadcn base-nova primitives used everywhere).

## 2. Scan (paste counts in the report)
Run on the scoped files:
```bash
F="src/app/[locale]/(dashboard)/student/excuses"   # adjust
grep -rnE "#[0-9a-fA-F]{3,6}\b" "$F"                                                     # hex colors
grep -rnoE "(bg|text|border|from|via|to|ring)-(red|green|emerald|amber|yellow|orange|blue|sky|teal|gray|slate|zinc|rose)-[0-9]+" "$F"
grep -rnE "\b(pl|pr|ml|mr)-[0-9]|\b(left|right)-[0-9]|text-(left|right)\b|border-(l|r)\b|rounded-(l|r)-" "$F"
grep -rn "<button" "$F"                                                                  # raw buttons
grep -rnE "\[[0-9]+px\]" "$F"                                                            # arbitrary sizes
LC_ALL=C.UTF-8 grep -rnP "[\x{0600}-\x{06FF}]" "$F" --include=*.tsx | grep -vE "^\S+:\s*(//|\*|\{/\*)"   # hard-coded Arabic (comments excluded)
```

## 3. Checklist (mark ✅/❌ per item)
**Tokens** — no hex, no raw palette (see `ui-design` §1 mapping: amber/yellow→warning, emerald/green→success, red/rose→danger (destructive for action buttons), blue/sky→info, gray/slate→muted/foreground/border; categorical one-color-per-item palettes stay explicit); no `bg-white`.
**Direction** — logical props only; directional icons flip in RTL; numbers/phones `dir="ltr"`.
**Primitives** — `Button`/`Badge`/`Card`/`ResponsiveDialog`/`DataTable`/`Skeleton` instead of hand-rolled equivalents.
**Hierarchy** — exactly one `h1`; one primary action; consistent heading scale; meta in `text-muted-foreground`.
**Consistency** — same radius family, card padding, gap scale and icon size across the page; status badges styled the same everywhere for the same status.
**States** — loading skeleton matches layout, empty state, error + retry, disabled + loading button text, hover/focus/active.
**Responsive** — 375px: no horizontal scroll, tap targets ≥ 40px, tables usable, modals become bottom sheets; `lg`+: content not stretched edge-to-edge (`max-w-7xl`).
**Dark mode** — no invisible text, borders visible, `success/warning/info` text has `dark:*-400`.
**i18n** — no hard-coded strings; ar + en both present; Arabic doesn't overflow (it's ~20–30% longer than English sometimes, often shorter — test both).
**A11y** — icon-only buttons have `aria-label`, decorative icons `aria-hidden`, focus visible (see `accessibility`).

## 4. Fix
- Group fixes by kind (tokens → direction → primitives → states → layout). Behavior must not change: same data, handlers, translations.
- Prefer extracting a repeated block (StatCard, StatusBadge, EmptyState) into `src/components/common/` when it appears 3+ times.
- Keep diffs reviewable; don't reformat untouched lines.

## 5. Verify & report
- `npx eslint <changed files>`; `npx tsc --noEmit`.
- Report: table of checklist results before → after, list of fixes, and what to eyeball in the browser (routes × ar/en × light/dark × 375/1280).
