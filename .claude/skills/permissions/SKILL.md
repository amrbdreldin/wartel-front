---
name: permissions
description: Use when adding a page, sidebar item, or feature that only some roles (student, teacher, parent, student-child, teacher-as-student) should see, when touching src/config/navigation.ts or src/utils/permissions.ts, or when debugging "user can't see X", wrong dashboard after login, or redirect loops.
---

# Roles & access in Waratel

## Model
- `UserRole` enum (`src/types/enums.ts`): `student`, `teacher`, `parent`. Current role in Redux `authSlice` (`selectRole`, `selectUser`).
- `useRole()` (`src/hooks/useRole.ts`): `role, isStudent, isTeacher, isParent, isStudentChild` (`user.role_id === "3"`), `hasRole`, `hasAnyRole`.
- Route access: `ROUTE_ACCESS` in `src/utils/permissions.ts` — `/student` is reachable by student, teacher (switch-to-student via `TeacherSwitchToStudentModal`) and parent (viewing a child); `/teacher` teacher only; `/parent` parent only. `canAccessRoute`, `getDefaultRoute`.
- Parents can act for a child: separate cookies `wartel_parent_access_token` etc. (`src/lib/constants.ts`). Be careful which token a request uses on child screens.
- Sidebar: `getNavigationByRole(role)` in `src/config/navigation.ts` → `NavGroup[]` of `{ labelKey, href, icon }`. `[userId]` in `href` is replaced with the current user id in `Sidebar.tsx`.

## Add a role-specific page
1. Route under `src/app/[locale]/(dashboard)/<role>/…`.
2. Nav item in the role's array in `navigation.ts` (`labelKey` under `nav.*` in ar + en; lucide icon).
3. New top-level prefix? add it to `ROUTE_ACCESS` and update `src/utils/__tests__/permissions.test.ts`.
4. Element-level gating inside a shared screen: `const { isTeacher, isStudentChild } = useRole()` — hide actions the role can't perform; the backend is the real authority, the UI only avoids dead buttons.

## Debugging
- Wrong landing after login → `getDefaultRoute` + `LoginForm` redirect logic.
- Sees another role's menu → `role` in Redux stale after switch; check the switch flow and logout reset.
- Bounced to login on a public page → add it to `isCurrentPagePublic()` in `src/lib/axios.ts`.
- Run `yarn test src/utils/__tests__/permissions.test.ts src/hooks/__tests/useRole.test.ts`.
