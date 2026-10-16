---
name: accessibility
description: Use when building or reviewing interactive UI in Waratel — forms, buttons, modals/sheets, dropdowns, tabs, accordions, tables, audio/video, images, icons — or when the user mentions a11y, keyboard, screen reader, focus, ARIA, or contrast.
---

# Accessibility

## Semantic HTML first
- Navigates → `next/link`; acts → `Button` (`@/components/ui/button`, Base UI). Never `<div onClick>`; avoid raw `<button>` (loses focus styles).
- One `<h1>` per page; don't skip heading levels for size — restyle instead.
- Card lists → `<ul>/<li>`; tables via `DataTable` (real `<table>`, `<th>`).
- Dashboard shell already provides `<nav>` (Sidebar) — page content goes in the shell's main area.

## Forms
- Every input has a label: `FieldWrapper` wires `<Label htmlFor={name}>` to `id={name}`; pass `label` always (visually hidden with `sr-only` if needed).
- Errors: `FieldError` renders `role="alert"`; add `aria-invalid={hasError}` and `aria-describedby` when building new field primitives.
- Required: visual `*` + `required`/`aria-required`.
- Failed submit → `ScrollToFieldError` scrolls and focuses the first invalid field — keep it in every form.
- Correct `type`/`inputMode`/`autoComplete` (`tel`, `one-time-code` for OTP, `current-password`).

## Keyboard & focus
- Tab order follows visual RTL order; no positive `tabIndex`. Note `FormField`'s password toggle uses `tabIndex={-1}` — acceptable only because it's optional.
- Visible focus: Button has `focus-visible:ring-3 ring-ring/50`; don't remove `outline` without a ring.
- Icon-only buttons: `aria-label={t("…")}`; decorative icons `aria-hidden`.

## Dialogs, sheets, menus, tabs
- Use `Dialog`/`Sheet`/`ResponsiveDialog`, `DropdownMenu`, `Tabs`, `Accordion` from `components/ui` — Base UI handles focus trap, Esc, return focus, roving arrows.
- Every dialog has a `DialogTitle` (visually hidden if needed); description via `DialogDescription`.

## Media
- `next/image` alt translated; decorative `alt=""`.
- Audio (recitation recordings) / video: visible controls, label what's playing; never autoplay with sound.

## Dynamic content
- Toasts (sonner) are announced but transient — critical errors also inline.
- Loading regions `aria-busy`; skeletons `aria-hidden`.
- Unread dots/badges need text for SR (`<span className="sr-only">{t("unread")}</span>`).

## Contrast & color
- Body text ≥ 4.5:1; large text/UI ≥ 3:1. Check `text-muted-foreground` on `bg-muted`, white on `accent` (orange) and `warning-*` combos, and tenant colors in both themes.
- Status never by color alone (badge text/icon).

## Direction & language
`<html lang dir>` is set per locale in `[locale]/layout.tsx` — don't hard-code `dir` except `dir="ltr"` for phones/codes/numbers. ARIA strings are translated.
