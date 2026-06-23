import { NotificationType } from "@/types/enums";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ============================================================
// Notification Slice – In-app notifications
// ============================================================

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },

    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.is_read) {
        item.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.is_read = true;
      });
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: { notifications: NotificationState }) =>
  state.notifications.items;
export const selectUnreadCount = (state: { notifications: NotificationState }) =>
  state.notifications.unreadCount;

export default notificationSlice.reducer;
