---
name: api-endpoint
description: Use when wiring a backend endpoint end-to-end into a Waratel screen — types, service method, query/mutation hook with keys, cache invalidation, and the loading/empty/error UI. Rules live in nextjs-data; this is the recipe.
---

# Wiring an endpoint end-to-end

Reference implementation: `contact.service.ts` + `hooks/api/useContactQueries.ts` + `components/contact/*`.

## 1. Types — `src/types/<domain>.types.ts`
Type exactly what the backend returns (ask for / inspect a sample response). Optional fields as `?`, nullable as `| null`. Enums for statuses go in `src/types/enums.ts` if shared.

## 2. Service — `src/services/<domain>.service.ts`
```ts
const BASE_URL = "/teacher";

export const teacherService = {
  getRequests: (params?: QueryParams, options?: ApiCallOptions) =>
    apiGet<ApiResponse<RequestsData>>(`${BASE_URL}/requests`, {
      ...options,
      config: { ...options?.config, params: { page: 1, per_page: 15, ...params } },
    }),
  approveRequest: (id: number, payload: ApproveRequestPayload, options?: ApiCallOptions) =>
    apiPost<ApiResponse<RequestItem>, ApproveRequestPayload>(`${BASE_URL}/requests/${id}/approve`, payload, options),
};
```
- Always accept `options?: ApiCallOptions` last (locale + extra config).
- File? Build `FormData` and use `apiUpload`.

## 3. Hook — `src/hooks/api/use<Domain>Queries.ts` (`"use client"`)
- Add/extend the `<domain>Keys` factory.
- `useXList(params)` → `useQuery({ queryKey: keys.list(params), queryFn: () => service.getX(params, { lang }), placeholderData: keepPreviousData })`.
- `useXDetail(id)` → `enabled: Boolean(id)`.
- `useApproveX()` → `useMutation` + `invalidateQueries` for every affected list/detail/dashboard key (also other domains' keys if counts shown there change, e.g. notifications/dashboard).

## 4. UI
```tsx
const { data, isLoading, isError, error, refetch, isFetching } = useTeacherRequests({ page });
const items = data?.data?.data ?? [];
const { mutate, isPending } = useApproveRequest();

mutate({ id, payload }, {
  onSuccess: (res) => { toast.success(res.message || t("approvedSuccess")); onClose(); },
  // no toast in onError — axios interceptor already showed it
});
```
Render loading / error (+retry) / empty / data (see `ui-patterns`); disable the action with `isPending`; show `isFetching` subtly (DataTable dims itself).

## 5. Optional: test the service
`src/services/__tests__/<domain>.service.test.ts` — mock `@/lib/api-client` and assert URL/params/FormData (copy `contact.service.test.ts`). Run `yarn test`.

## 6. Checklist
- [ ] types match real response (no `any`)
- [ ] service method + `options` passthrough
- [ ] key contains every param; invalidation after writes
- [ ] 4 UI states; `isPending` on buttons; specific loading text
- [ ] ar + en strings
- [ ] new external host? → `third-party-integration`
