import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, { createInitialAuthState, type ServerAuthSnapshot } from "./slices/authSlice";
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
// Store factory
// One store per request on the server (never share user state between requests),
// one per app instance in the browser (created once by <Providers>).
// ============================================================
export const makeStore = (serverAuth?: ServerAuthSnapshot) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: { auth: createInitialAuthState(serverAuth) },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
  });

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
