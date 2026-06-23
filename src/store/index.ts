import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import enrollmentReducer from "./slices/enrollmentSlice";
import notificationReducer from "./slices/notificationSlice";
import uiReducer from "./slices/uiSlice";

// ============================================================
// Root Reducer
// ============================================================
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notifications: notificationReducer,
  enrollment: enrollmentReducer,
});

// ============================================================
// Store
// ============================================================
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
