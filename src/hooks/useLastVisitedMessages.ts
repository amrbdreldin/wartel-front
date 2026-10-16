"use client";

import { useSyncExternalStore } from "react";

// ============================================================
// useLastVisitedMessages – timestamp (ms) of the last visit to the
// messages page, stored in localStorage by the messages pages.
// Re-read on every render (e.g. route changes) and on cross-tab updates.
// 0 on the server and before hydration.
// ============================================================

export const LAST_VISITED_MESSAGES_KEY = "last_visited_messages";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const readClient = () => Number(localStorage.getItem(LAST_VISITED_MESSAGES_KEY) || 0);
const readServer = () => 0;

export function useLastVisitedMessages(): number {
  return useSyncExternalStore(subscribe, readClient, readServer);
}
