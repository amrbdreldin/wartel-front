"use client";

import Cookies from "js-cookie";
import { USER_KEY } from "@/lib/constants";
import { endServerSession, restoreServerParentSession } from "@/lib/session-client";
import type { AppDispatch, RootState } from "@/store";
import {
    logout as logoutAction, selectAccessToken, selectIsAuthenticated, selectUser, setCredentials
} from "@/store/slices/authSlice";
import type { User } from "@/types/auth.types";
import { UserRole } from "@/types/enums";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale } from "next-intl";

// ============================================================
// useAuth – Auth state & actions
// ------------------------------------------------------------
// Access/refresh tokens are HttpOnly cookies managed by the server
// (see src/lib/server/session.ts); the proxy sets them when a login or
// switch response arrives. Here we only keep the readable user cookie
// and Redux in sync. `accessToken`/`refreshToken` params are accepted
// for backwards compatibility and ignored.
// ============================================================

const USER_COOKIE_DAYS = 400;

interface LoginData {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

function withRole(user: User): User {
  const resolved = { ...user };
  if (!resolved.role && resolved.role_id) {
    const roleIdStr = String(resolved.role_id);
    if (roleIdStr === "1" || roleIdStr === "3") resolved.role = UserRole.STUDENT;
    else if (roleIdStr === "2") resolved.role = UserRole.TEACHER;
    else if (roleIdStr === "5") resolved.role = UserRole.PARENT;
  }
  return resolved;
}

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale();
  const user = useSelector((state: RootState) => selectUser(state));
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const accessToken = useSelector((state: RootState) =>
    selectAccessToken(state)
  );

  const login = useCallback(
    (data: LoginData) => {
      const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
      const resolvedUser = withRole(data.user);

      // Readable profile cookie for the UI (the server renews it on every request)
      Cookies.set(USER_KEY, JSON.stringify(resolvedUser), {
        expires: USER_COOKIE_DAYS,
        path: "/",
        secure: isSecure,
        sameSite: "lax",
      });

      dispatch(setCredentials({ user: resolvedUser, accessToken: "", refreshToken: "" }));
    },
    [dispatch]
  );

  /** The proxy already saved the current (teacher/parent) session when the switch request succeeded */
  const switchToChild = useCallback((data: LoginData) => login(data), [login]);

  const restoreParentSession = useCallback(async (): Promise<User | null> => {
    const parentUser = await restoreServerParentSession();
    if (!parentUser) return null;
    const resolved = withRole(parentUser);
    dispatch(setCredentials({ user: resolved, accessToken: "", refreshToken: "" }));
    return resolved;
  }, [dispatch]);

  const logout = useCallback(async () => {
    await endServerSession("all");
    dispatch(logoutAction());

    // Use window.location for a full page reload/redirect to clear all states
    if (typeof window !== "undefined") {
      window.location.href = `/${locale}`;
    }
  }, [dispatch, locale]);

  /**
   * Clear auth state in-place without navigating away.
   * Use this when you want to show a login form on the current page
   * (e.g. the OngoingLoginModal's "Switch Account" flow).
   */
  const clearSession = useCallback(async () => {
    await endServerSession("all");
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    accessToken,
    login,
    logout,
    clearSession,
    switchToChild,
    restoreParentSession,
  };
}
