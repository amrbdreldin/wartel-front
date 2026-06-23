import type { User } from "@/types/auth.types";
import { UserRole } from "@/types/enums";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "@/lib/constants";

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

const getInitialAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }
  try {
    const token = Cookies.get(TOKEN_KEY) || null;
    const refresh = Cookies.get(REFRESH_TOKEN_KEY) || null;
    const userRaw = Cookies.get(USER_KEY);
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    if (user && !user.role && user.role_id) {
      const roleIdStr = String(user.role_id);
      if (roleIdStr === "1" || roleIdStr === "3") user.role = UserRole.STUDENT;
      else if (roleIdStr === "2") user.role = UserRole.TEACHER;
      else if (roleIdStr === "5") user.role = UserRole.PARENT;
    }
    return {
      user,
      accessToken: token,
      refreshToken: refresh,
      isAuthenticated: !!token && !!user,
      isLoading: false,
    };
  } catch {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
};

const initialState: AuthState = getInitialAuth();

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
      const user = { ...action.payload.user };
      if (!user.role && user.role_id) {
        const roleIdStr = String(user.role_id);
        if (roleIdStr === "1" || roleIdStr === "3") user.role = UserRole.STUDENT;
        else if (roleIdStr === "2") user.role = UserRole.TEACHER;
        else if (roleIdStr === "5") user.role = UserRole.PARENT;
      }
      state.user = user;
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
