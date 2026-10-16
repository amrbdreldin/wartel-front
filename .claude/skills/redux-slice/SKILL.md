---
name: redux-slice
description: Use when adding or changing a Redux Toolkit slice in Waratel, deciding whether state belongs in Redux vs TanStack Query vs local/URL state, or debugging auth/role/theme/notification state not updating or not resetting on logout.
---

# Redux in Waratel

Store `src/store/index.ts` (RTK, `combineReducers`): `auth`, `ui` (sidebar, theme, locale), `notifications` (unread counts), `enrollment` (registration draft). Provider in `src/store/provider.tsx` (also hosts QueryClient + `Toaster`). **No redux-persist is wired** (package installed, unused) — state resets on reload; auth is restored from cookies.

## Where does state go?
| State | Home |
|---|---|
| Anything from the API (lists, details, counts) | TanStack Query (`nextjs-data`) |
| Who is logged in, role, user object | `authSlice` |
| Cross-page UI prefs (theme, sidebar collapsed) | `uiSlice` |
| Live counters pushed by FCM | `notificationSlice` |
| Selected tab / filter / page / selected id | URL search params (shareable) or `useState` |
| Form values | Formik |
| Drafts that must survive reload | `localStorage` helper like `src/utils/sessionDraftStorage.ts` |

Don't copy query results into Redux.

## New slice
`src/store/slices/<name>Slice.ts`:
```ts
interface XState { … }
const initialState: XState = { … };
const xSlice = createSlice({ name: "x", initialState, reducers: { setX: (s, a: PayloadAction<…>) => { … }, resetX: () => initialState } });
export const { setX, resetX } = xSlice.actions;
export const selectX = (state: RootState) => state.x.value;   // narrow selectors
export default xSlice.reducer;
```
Register in `combineReducers`. Select narrowly (`useSelector(selectX)`), never the whole state. Reset user-scoped slices on logout.

## Theme
`uiSlice.theme` → `ThemeToggle` toggles `.dark` on `<html>`; `TenantThemeProvider` re-applies tenant colors on class change. Don't toggle `.dark` elsewhere.
