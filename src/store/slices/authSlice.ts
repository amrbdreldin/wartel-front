import type { User } from "@/types/auth.types";
import { UserRole } from "@/types/enums";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { USER_KEY } from "@/lib/constants";

// ============================================================
// Auth Slice – User, tokens, role
// ============================================================

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * What the server can safely tell the client about the session (read from the
 * request cookies in `[locale]/layout.tsx`). Tokens are never embedded in the HTML.
 */
export interface ServerAuthSnapshot {
  user: User | null;
}

function withResolvedRole(user: User | null): User | null {
  if (user && !user.role && user.role_id) {
    const roleIdStr = String(user.role_id);
    if (roleIdStr === "1" || roleIdStr === "3") user.role = UserRole.STUDENT;
    else if (roleIdStr === "2") user.role = UserRole.TEACHER;
    else if (roleIdStr === "5") user.role = UserRole.PARENT;
  }
  return user;
}

/** Parses the user cookie value; null when missing or malformed */
export function parseUserCookie(raw: string | undefined | null): User | null {
  if (!raw) return null;
  try {
    return withResolvedRole(JSON.parse(raw) as User);
  } catch {
    return null;
  }
}

/**
 * Initial auth state. The server renders from the cookie snapshot and the browser
 * from the same readable user cookie, so the first client render matches the HTML.
 * Tokens are HttpOnly (server-owned) and never part of client state; the server
 * removes the user cookie whenever it ends a session, so `user` implies a session.
 */
export const createInitialAuthState = (server?: ServerAuthSnapshot): AuthState => {
  // Same rule on both sides (user cookie only) so server HTML and first client render always match
  const user =
    typeof window === "undefined" ? server?.user ?? null : parseUserCookie(Cookies.get(USER_KEY));
  return {
    user,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: Boolean(user),
    isLoading: typeof window === "undefined" && !server,
  };
};

const initialState: AuthState = createInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = withResolvedRole({ ...action.payload.user });
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateUser, updateTokens, logout, setLoading } =
  authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectRole = (state: { auth: AuthState }) => {
  const user = state.auth.user;
  if (!user) return undefined;
  if (user.role) return user.role as UserRole;
  if (user.role_id) {
    const roleIdStr = String(user.role_id);
    if (roleIdStr === "1" || roleIdStr === "3") return UserRole.STUDENT;
    if (roleIdStr === "2") return UserRole.TEACHER;
    if (roleIdStr === "5") return UserRole.PARENT;
  }
  return undefined;
};
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;

export default authSlice.reducer;
