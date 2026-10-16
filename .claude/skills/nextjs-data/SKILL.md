---
name: nextjs-data
description: Use when fetching or mutating API data in Waratel — TanStack Query hooks, query keys, cache invalidation, polling, the axios client and its global error toasts, token refresh, the /api/proxy route handler, file uploads, or server-side fetches (generateMetadata, tenant config). For an end-to-end recipe of a new endpoint see api-endpoint.
---

# Data layer in Waratel

## Request path
Component → hook (`src/hooks/api/use<Domain>Queries.ts`) → service (`src/services/<domain>.service.ts`) → `apiGet/apiPost/apiPut/apiPatch/apiDelete/apiUpload` (`src/lib/api-client.ts`) → axios instance (`src/lib/axios.ts`, baseURL `/api/proxy`) → route handler `src/app/api/proxy/[...path]/route.ts` → real backend (`API_BASE_URL`, server-only env).

- Never call the backend URL directly from the browser, and never expose it via `NEXT_PUBLIC_*`.
- Never use `axios`/`fetch` directly in components — go through a service.

## Responses
`ApiResponse<T> = { success, message, data }`; paginated lists are either `PaginatedResponse<T>` (`data[]` + `meta`) or `ApiResponse<{ data: T[]; meta }>` — check the actual endpoint and type it in `src/types`.

## Hooks (TanStack Query v5)
- Query key factory per domain, exported from the hook file:
  ```ts
  export const excuseKeys = {
    all: ["excuses"] as const,
    lists: () => [...excuseKeys.all, "list"] as const,
    list: (p?: QueryParams) => [...excuseKeys.lists(), p] as const,
    detail: (id?: number | string | null) => [...excuseKeys.all, "detail", String(id ?? "")] as const,
  };
  ```
  Every variable the queryFn uses (page, filters, id, child id) **must** be in the key.
- Pass the locale: `const lang = useLocale() as Locale;` → `service.x(params, { lang })` (sends `Accept-Language`). Include `lang` in the key if the response is localized and cached long.
- `enabled: Boolean(id)` for dependent queries; `placeholderData: keepPreviousData` for pagination; `staleTime: STALE_TIME.SHORT|MEDIUM|LONG` from `src/lib/constants.ts` (default 60s, no refetch on focus).
- Polling only while visible/needed: `refetchInterval: id ? 15000 : false`.
- Mutations: `useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.lists() }) })`. Invalidate every list/detail/dashboard count the write affects.
- In components use `isPending` from the mutation for disabling/loading — not Formik's `isSubmitting`.

## Errors & toasts (important)
`src/lib/axios.ts` already toasts **every** non-401 error (backend `message`, or each validation message in `errors`). So:
- In `onError`, don't call `toast.error` again — map field errors into Formik (`setErrors`) or do nothing.
- For endpoints that render their own errors, pass `config: { skipGlobalToast: true }` (or add to `silentEndpoints`).
- 401 reaching the browser means the session is gone (the proxy already tried a server-side refresh): axios calls `/api/session/logout` (scope "active") and redirects to `/{locale}/login` unless the page is public (`isCurrentPagePublic`). Add new public routes there.
- Success: `toast.success(res.message || t("…"))` in the component's `mutate(..., { onSuccess })`.

## Uploads
`apiUpload(url, formData)` (no timeout, multipart). The proxy re-builds FormData and must strip incoming `content-type`, and strip `content-encoding`/`content-length` from responses — keep that intact when editing the proxy.

## Server side
- Tenant/branding: `getTenantConfig(host)` in `src/utils/saas.ts` (used in `[locale]/layout.tsx` metadata).
- Server fetches can't use the axios cookie interceptor; read cookies via `next/headers` if ever needed.

## Auth / session (HttpOnly — never read tokens in the browser)
- Tokens are **HttpOnly cookies owned by the server** (`src/lib/server/session.ts`). The proxy attaches `Authorization` from the cookie (only for same-origin requests: `X-Wartel-Client: 1` header or `Sec-Fetch-Site: same-origin`), refreshes on 401 (deduplicated), and renews every cookie to 400 days on each request.
- Auth responses: the proxy moves tokens into cookies, **strips them from the body** and adds `session_established: true`. Endpoints are whitelisted in `getSessionMode()` in the proxy route — `login` (auth/login, auth/parent/register, groups/join, auth/refresh) or `switch` (teacher/parent login-as-student, parent/children/{id}/switch → current account backed up to `wartel_parent_*`). A new endpoint that returns tokens must be added there.
- Client: check success with `hasEstablishedSession(res)` (`src/lib/session-client.ts`), then `useAuth().login({ user })`. Logout/restore go through `/api/session/logout` and `/api/session/restore-parent`. Raw `fetch` to the proxy must send `CLIENT_REQUEST_HEADER`.
- Readable cookies: `wartel_user`, `wartel_parent_user` (UI info only). User object in Redux `authSlice`; the server passes a cookie snapshot to `<Providers serverAuth>` so SSR matches hydration.
- Don't put server data in Redux — TanStack Query owns server state (see `redux-slice`).
