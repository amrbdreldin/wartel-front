import type { Locale } from "@/lib/constants";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ============================================================
// UI Slice – Sidebar, theme, locale preferences
// ============================================================

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  locale: Locale;
}

const initialState: UIState = {
  sidebarOpen: false,
  sidebarCollapsed: false,
  theme: "light",
  locale: "ar",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },

    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setTheme,
  setLocale,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state: { ui: UIState }) =>
  state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state: { ui: UIState }) =>
  state.ui.sidebarCollapsed;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectLocale = (state: { ui: UIState }) => state.ui.locale;

export default uiSlice.reducer;
