"use client";

import Cookies from "js-cookie";
import { REFRESH_TOKEN_KEY, TOKEN_KEY, USER_KEY, PARENT_TOKEN_KEY, PARENT_REFRESH_TOKEN_KEY, PARENT_USER_KEY } from "@/lib/constants";
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
// ============================================================

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
    (data: { user: User; accessToken: string; refreshToken: string }) => {
      const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
      
      const user = { ...data.user };
      if (!user.role && user.role_id) {
        const roleIdStr = String(user.role_id);
        if (roleIdStr === "1" || roleIdStr === "3") user.role = UserRole.STUDENT;
        else if (roleIdStr === "2") user.role = UserRole.TEACHER;
        else if (roleIdStr === "5") user.role = UserRole.PARENT;
      }

      Cookies.set(TOKEN_KEY, data.accessToken, { expires: 365, path: "/", secure: isSecure, sameSite: "lax" }); 
      Cookies.set(REFRESH_TOKEN_KEY, data.refreshToken, { expires: 365, path: "/", secure: isSecure, sameSite: "lax" });
      Cookies.set(USER_KEY, JSON.stringify(user), { expires: 365, path: "/", secure: isSecure, sameSite: "lax" });
      
      // Update Redux
      dispatch(setCredentials({ ...data, user }));
    },
    [dispatch]
  );

  const switchToChild = useCallback(
    (data: { user: User; accessToken: string; refreshToken: string }) => {
      const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
      
      const currentToken = Cookies.get(TOKEN_KEY);
      const currentRefresh = Cookies.get(REFRESH_TOKEN_KEY);
      const currentUser = Cookies.get(USER_KEY);
      
      if (currentToken && currentUser) {
        Cookies.set(PARENT_TOKEN_KEY, currentToken, { expires: 365, path: "/", secure: isSecure, sameSite: "lax" });
        if (currentRefresh) {
          Cookies.set(PARENT_REFRESH_TOKEN_KEY, currentRefresh, { expires: 365, path: "/", secure: isSecure, sameSite: "lax" });
        }
        Cookies.set(PARENT_USER_KEY, currentUser, { expires: 365, path: "/", secure: isSecure, sameSite: "lax" });
      }

      login(data);
    },
    [login]
  );

  const restoreParentSession = useCallback(() => {
    const parentToken = Cookies.get(PARENT_TOKEN_KEY);
    const parentRefresh = Cookies.get(PARENT_REFRESH_TOKEN_KEY) || "";
    const parentUserRaw = Cookies.get(PARENT_USER_KEY);

    if (parentToken && parentUserRaw) {
      try {
        const parentUser = JSON.parse(parentUserRaw) as User;
        if (!parentUser.role && parentUser.role_id) {
          const roleIdStr = String(parentUser.role_id);
          if (roleIdStr === "1" || roleIdStr === "3") parentUser.role = UserRole.STUDENT;
          else if (roleIdStr === "2") parentUser.role = UserRole.TEACHER;
          else if (roleIdStr === "5") parentUser.role = UserRole.PARENT;
        }
        
        login({
          user: parentUser,
          accessToken: parentToken,
          refreshToken: parentRefresh,
        });

        // Clean up parent backup cookies
        Cookies.remove(PARENT_TOKEN_KEY, { path: "/" });
        Cookies.remove(PARENT_REFRESH_TOKEN_KEY, { path: "/" });
        Cookies.remove(PARENT_USER_KEY, { path: "/" });

        return parentUser;
      } catch (e) {
        console.error("Failed to restore parent session:", e);
      }
    }
    return null;
  }, [login]);

  const logout = useCallback(() => {
    // Clear cookies with explicit path to ensure removal
    Cookies.remove(TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_KEY, { path: "/" });
    Cookies.remove(PARENT_TOKEN_KEY, { path: "/" });
    Cookies.remove(PARENT_REFRESH_TOKEN_KEY, { path: "/" });
    Cookies.remove(PARENT_USER_KEY, { path: "/" });
    
    // Update Redux state
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
  const clearSession = useCallback(() => {
    Cookies.remove(TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_KEY, { path: "/" });
    Cookies.remove(PARENT_TOKEN_KEY, { path: "/" });
    Cookies.remove(PARENT_REFRESH_TOKEN_KEY, { path: "/" });
    Cookies.remove(PARENT_USER_KEY, { path: "/" });
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
