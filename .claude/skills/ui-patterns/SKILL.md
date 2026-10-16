---
name: ui-patterns
description: Use when building a recurring UI block in Waratel — page header/banner, stat cards/KPI row, status badge, empty state, error state with retry, loading skeleton, list+detail split view, card grid, modal form, confirm dialog, success view, or toast feedback. Copy-ready recipes that follow ui-design tokens.
---

# Waratel UI patterns (copy, then adapt)

All snippets assume `const t = useTranslations("<ns>")`, `cn` from `@/lib/utils`, tokens per `ui-design`. If a pattern is needed in 3+ places and no shared component exists, extract it to `src/components/common/` (e.g. `PageHeader`, `StatCard`, `EmptyState`, `StatusBadge`) instead of copying again.

## Page wrapper
```tsx
<div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
```

## Page header (plain)
```tsx
<header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
  <div className="flex items-center gap-3 min-w-0">
    <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
      <Trophy className="size-5" aria-hidden />
    </div>
    <div className="min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
    </div>
  </div>
  <Button size="lg" className="gap-2"><Plus aria-hidden />{t("create")}</Button>
</header>
```

## Hero banner (dashboard home / feature landing — one per page)
```tsx
<section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-card p-4 sm:p-6">
  …title + CTA…
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4 pt-4 border-t border-border/40">…StatCards…</div>
</section>
```

## Stat card
```tsx
const tone = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-50 text-success-600 dark:text-success-400",
  warning: "bg-warning-50 text-warning-600 dark:text-warning-400",
  danger: "bg-destructive/10 text-destructive",
} as const;

<div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-3 sm:p-4">
  <div className="min-w-0">
    <p className="text-xs text-muted-foreground font-medium">{label}</p>
    <p className="text-xl sm:text-2xl font-bold tabular-nums text-foreground mt-0.5">{value}</p>
  </div>
  <div className={cn("size-9 rounded-xl grid place-items-center shrink-0", tone[variant])}>
    <Icon className="size-4" aria-hidden />
  </div>
</div>
```
Loading: same box with `<Skeleton className="h-4 w-20" />` + `<Skeleton className="h-7 w-12 mt-1" />`.

## Status badge (map enum → tone, always with text)
```tsx
const STATUS_TONE: Record<ExcuseStatus, string> = {
  [ExcuseStatus.PENDING]: "bg-warning-50 text-warning-600 border-warning-100 dark:text-warning-400",
  [ExcuseStatus.APPROVED]: "bg-success-50 text-success-600 border-success-100 dark:text-success-400",
  [ExcuseStatus.REJECTED]: "bg-destructive/10 text-destructive border-destructive/20",
};
<Badge variant="outline" className={cn("gap-1 rounded-full", STATUS_TONE[status])}>{t(`status.${status}`)}</Badge>
```
Unknown status → `bg-muted text-muted-foreground` fallback, never crash.

## Data states — every query-driven block renders all 4
```tsx
if (isLoading) return <SectionSkeleton />;          // same shape as content
if (isError) return <ErrorState message={apiMsg} onRetry={refetch} />;
if (!items.length) return <EmptyState icon={Inbox} title={t("emptyTitle")} hint={t("emptyHint")} action={…} />;
return <Content />;
```
Empty state:
```tsx
<div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl border border-dashed border-border bg-card/50">
  <div className="size-14 rounded-2xl bg-muted grid place-items-center mb-4"><Icon className="size-7 text-muted-foreground" aria-hidden /></div>
  <h3 className="text-base font-semibold text-foreground">{title}</h3>
  <p className="text-sm text-muted-foreground mt-1 max-w-sm">{hint}</p>
  {action && <div className="mt-5">{action}</div>}
</div>
```
Error state: same frame, `AlertCircle` in `bg-destructive/10 text-destructive`, message from `err.response?.data?.message` with `t("common.errorOccurred")` fallback, `<Button variant="outline" onClick={() => refetch()}>{t("common.retry")}</Button>`.

## Card grid
```tsx
<ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
  {items.map((it) => <li key={it.id}><article className="h-full rounded-2xl border border-border/50 bg-card p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">…</article></li>)}
</ul>
```
Loading: `<SkeletonCardList count={6} />`. Clickable card → wrap in `Link` (whole card) with `focus-visible:ring-3 ring-ring/50`.

## List + detail split (tickets, messages)
Follow `src/components/contact/ContactUsView.tsx`: `grid lg:grid-cols-12`, list `lg:col-span-5`, detail `lg:col-span-7`; under `lg` show one pane, selected id in `?param=` via `router.replace(…, { scroll: false })`, back button with `rtl:rotate-180` arrow.

## Tables
Use `DataTable` (see `data-table` skill). Never a raw `<table>`.

## Modal with a form
`ResponsiveDialog` + `ResponsiveDialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto"` + header (title + muted description) + Formik form (see `forms`) + footer: primary `LoadingButton isLoading={isPending}` and `Button variant="outline"` cancel. Block close while `isPending`. Reset state on close.

## Confirm destructive action
`Dialog` with title, one-line consequence, `Button variant="destructive"` confirm (loading-aware) + outline cancel. See `LogoutConfirmDialog`.

## Feedback
- After every mutation: `toast.success(res.message || t("…Success"))`. Errors are already toasted globally by `src/lib/axios.ts` — **don't toast again in `onError`** (double toast) unless the request sets `skipGlobalToast`.
- Big flows end in a success view in place (icon in `bg-success-50`, title, next steps, one CTA), not a silent redirect.

## Sticky action bar (mobile forms / long pages)
`<div className="sticky bottom-0 -mx-4 px-4 py-3 glass border-t border-border/50 sm:static sm:mx-0 sm:p-0 sm:bg-transparent sm:border-0">`
