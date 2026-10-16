---
name: ui-design
description: Use when designing, building or restyling any visible UI in Waratel — pages, cards, sections, stat tiles, badges, modals, buttons, spacing, colors, typography, dark mode, responsive behavior, hover/focus states or animation. This project has NO Figma; this skill is the design system. Pair with ui-patterns (ready recipes) and screen-design (designing a new screen from scratch).
---

# Waratel design system (no Figma — the code is the source of truth)

Stack: Tailwind v4 (`@theme inline` in `src/app/globals.css`, no tailwind.config), shadcn style `base-nova` on **Base UI** (`@base-ui/react`, not Radix), lucide-react icons, `tw-animate-css`.

## 1. Color — tokens only (multi-tenant!)
`TenantThemeProvider` overwrites CSS vars at runtime per academy (primary, accent, background, card, border, sidebar…, and `--radius`). A hard-coded color will **not** follow the tenant brand or dark mode.

| Intent | Use | Never |
|---|---|---|
| Brand / primary action / active / links | `bg-primary text-primary-foreground`, `text-primary`, `bg-primary/10` | `bg-teal-*`, `#008F8F` |
| Highlight / secondary CTA / accent icon | `accent`, `text-accent`, `bg-accent/10` | `orange-*` |
| Success / completed / present | `text-success-600 bg-success-50 border-success-100` (dark: `dark:text-success-400`) | `emerald-*`, `green-*` |
| Warning / pending / waiting | `text-warning-600 bg-warning-50 border-warning-100` (dark: `dark:text-warning-400`) | `amber-*`, `yellow-*` |
| Info / neutral-highlight | `info-*` | `blue-*`, `sky-*` |
| Error / danger / absent (status shades) | `text-danger-600 bg-danger-50` (dark: `dark:text-danger-400`) | `red-*`, `rose-*` |
| Destructive action (buttons) | `destructive`, `bg-destructive/10`; strong alert dot `bg-dark-red` | `red-*` |
| Surfaces | `bg-background` page, `bg-card` panels, `bg-muted` wells, `bg-popover` | `bg-white`, `bg-gray-*` |
| Text | `text-foreground`, `text-muted-foreground` for meta | `text-gray-*`, `text-slate-*` |
| Lines | `border-border` (often `/50`, `/60`) | `border-gray-*` |
| Charts | `chart-1..5` | random hex |

- Status scales `success | warning | info | danger` have every shade 50–950 (`globals.css` maps them onto Tailwind's emerald/amber/blue/red, so they render identically). In dark mode the 50/100 tints flip to deep tints automatically — don't use `text-*-50/100` for light-on-color text; use `text-white`/`text-white/80`.
- If a needed color is missing, add a CSS var in **both** `:root` and `.dark`, then map it in `@theme inline`. Don't inline hex.
- Categorical palettes (one distinct color per item: achievement cards, learning paths, media types) intentionally stay explicit Tailwind colors — see `AchievementsSection`, `PathSelectionField`, `MediaCard`. Everything that means a *status* uses the tokens above.
- Status must also carry text/icon — never color alone.

## 2. Typography
- Fonts come from vars: `--font-arabic` (Tajawal, auto on `html[dir=rtl]`), `--font-sans` (Inter), `font-heading`. Never set font-family directly; tenants can swap fonts.
- Scale (dashboard):
  - Page title: `text-xl sm:text-2xl font-bold text-foreground` (one per page, `h1`)
  - Section title: `text-lg font-semibold`
  - Card title: `text-base font-semibold`
  - Body: `text-sm`, meta/labels: `text-xs text-muted-foreground`
  - Big numbers (stats/scores): `text-2xl sm:text-3xl font-extrabold tabular-nums`
- Max 2 weights per component. Arabic needs line-height: keep `leading-relaxed` on paragraphs.

## 3. Spacing, radius, elevation
- 4px scale only: gaps `gap-2/3/4/6`, card padding `p-4 sm:p-5 md:p-6`, page stack `space-y-4 sm:space-y-6`. No `mt-[13px]`.
- Radius follows `--radius` (tenant-controlled): controls `rounded-lg`/`rounded-xl`, cards `rounded-2xl`, hero/banners `rounded-2xl sm:rounded-3xl`, pills `rounded-full`. Don't mix arbitrary radii in one view.
- Elevation: cards `border border-border/50 shadow-sm`; hover lift only on clickable cards `hover:shadow-md hover:-translate-y-0.5`. Overlays `bg-black/80 backdrop-blur-sm` (handled by Dialog/Sheet).
- Signature surfaces: `.glass` (sticky bars, floating panels), `.gradient-primary`/`.gradient-brand` (hero banners, primary CTA via `SubmitButton`), `.text-gradient-brand` (one hero word max). Use sparingly — one gradient focal point per screen.

## 4. Layout & direction (Arabic RTL is the default locale)
- Logical utilities only: `ps/pe/ms/me`, `start-*/end-*`, `text-start/end`, `border-s/e`, `rounded-s/e`. **Never** `pl/pr/ml/mr/left/right/text-left/text-right`.
- Directional icons (ChevronRight, ArrowLeft, Send…) get `rtl:rotate-180` / `rtl:-scale-x-100`.
- Numbers, phones, codes, emails in RTL text: wrap with `dir="ltr"` + `tabular-nums` where alignment matters.
- Mobile-first: base = 375px, then `sm: md: lg: xl:`. Dashboard content max width `max-w-7xl mx-auto`.
- Split views (list + detail) collapse to one pane under `lg` (see `ContactUsView`).

## 5. Components to reuse (don't hand-roll)
`Button` (variants default/outline/secondary/ghost/destructive/link; sizes xs–lg, icon*), `LoadingButton`, `SubmitButton`, `Badge`, `Card*`, `ResponsiveDialog*` (Dialog on desktop, bottom Sheet on mobile), `Dialog`, `Sheet`, `Tabs`, `Accordion`, `DropdownMenu`, `Select`, `Avatar`, `Skeleton`/`SkeletonCard`, `DataTable`, `DatePicker`, `SectionDivider`, `GradientBar`, `OrDivider`, `LoadingSpinner`, forms in `src/components/forms/*`.
- Base UI uses the `render` prop for polymorphism (`<Badge render={<a href=… />} />`), not shadcn's `asChild`.
- **No raw `<button className="…bg-primary…">`** — use `Button` + `className` for size tweaks.

## 6. States — every interactive element
- hover: `hover:bg-muted` (ghost), `hover:bg-primary/90` (solid)
- focus: keep Button's `focus-visible:ring-3 ring-ring/50`; never `outline-none` without a ring
- active: `active:translate-y-px` (built into Button) or `active:scale-[0.98]`
- disabled: `disabled:opacity-50 disabled:pointer-events-none`
- loading: `Loader2 animate-spin` + **specific** text ("جاري الإرسال" / "Sending…"), not generic "Loading"

## 7. Motion
- Page/section entry: `animate-in fade-in duration-500` (+ `slide-in-from-bottom-4` for cards). Durations 150–300ms for interactions, ≤500ms for entries.
- Decorative loops (`animate-float-slow`, `animate-pulse-slow`) only on landing, wrapped `motion-safe:`.
- No layout shift: skeletons match final layout; buttons keep width while loading.

## 8. Dark mode is real
`.dark` on `<html>` (Redux `uiSlice.theme`). Every new screen must look right in both. Token classes handle it; for `success/warning/info` text add `dark:*-400`. Test with the ThemeToggle.

## Done check
Grep your diff for: `#[0-9a-f]{3,6}`, `(bg|text|border)-(red|green|emerald|amber|yellow|blue|gray|slate)-`, ` pl-| pr-| ml-| mr-|left-|right-|text-left|text-right`, `<button` with bg classes. Then view at 375px and 1280px, `ar` + `en`, light + dark.
