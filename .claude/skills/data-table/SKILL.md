---
name: data-table
description: Use when building or changing a table/list screen in Waratel — columns, row click, expandable rows, client or server pagination, search, sorting, status columns, row actions, or mobile behavior — e.g. excuses, werd, sessions, notifications, students, grades, requests.
---

# Tables with `DataTable`

Component: `src/components/ui/DataTable.tsx` (generic `DataTable<T>`). Examples: `student/excuses/_components/ExcusesTable.tsx` (client search+paging), `student/previous-sessions/_components/PreviousSessionsTable.tsx`, `student/werd/_components/WerdTable.tsx`, `student/notifications/page.tsx`.

## Columns
```tsx
const columns: Column<ExcuseRecord>[] = [
  { key: "date", header: t("date"), sortable: true, render: (r) => <span dir="ltr" className="tabular-nums">{formatDate(r.date, locale)}</span> },
  { key: "status", header: t("status"), render: (r) => <StatusBadge status={r.status} /> },
  { key: "actions", header: <span className="sr-only">{t("actions")}</span>, className: "text-end",
    render: (r) => <Button size="icon-sm" variant="ghost" aria-label={t("view")} onClick={(e) => { e.stopPropagation(); open(r.id); }}><Eye /></Button> },
];
```
- `key` must be unique; used for sorting when `sortable`.
- Status → badge with text (see `ui-patterns`); dates/numbers via `src/utils/format.ts`, `dir="ltr"` for numerals in RTL.
- Empty cells render `—` in `text-muted-foreground`.
- Row actions: stop propagation if `onRowClick` is set; icon buttons need `aria-label`.

## Props cheat-sheet
| Need | Props |
|---|---|
| States | `isLoading`, `isFetching` (dims), `isError`, `errorText` (backend message), `noDataText` |
| Header | `title`, `subtitle`, `extraControls` (filters/export buttons) |
| Client search | `searchable`, `searchKeys={["name", (r) => r.group?.name ?? ""]}`, `searchPlaceholder` |
| Client paging | `pageSize` |
| Server paging | `manualPagination`, `currentPage`, `totalPages`, `totalItems`, `onPageChange` (keep `page` in the query key + `keepPreviousData`) |
| Row click / expand | `onRowClick`, `renderExpandedRow`, `expandedRows`, `getRowId` |

## Server-side lists
```tsx
const [page, setPage] = useState(1);
const { data, isLoading, isFetching, isError, error } = useExcuses({ page, per_page: 15 });
const meta = data?.data?.meta;
<DataTable … manualPagination currentPage={page} totalPages={meta?.last_page} totalItems={meta?.total} onPageChange={setPage} isFetching={isFetching} />
```
Reset `page` to 1 when a filter/search changes (search on server lists: `useDebounce` 400ms, value in the query key).

## Mobile
The table scrolls horizontally inside its rounded frame. For student/parent-facing lists with > 4 columns, prefer a card list under `md` (`md:hidden` cards + `hidden md:block` table) — the cards show the 2–3 decision fields + status.

## Don't
Raw `<table>` in feature code; computing pagination twice; fetching all pages to paginate on the client when the API paginates.
