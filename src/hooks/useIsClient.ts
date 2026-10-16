"use client";

import { useSyncExternalStore } from "react";

// ============================================================
// useIsClient – false during SSR and hydration, true afterwards
// ------------------------------------------------------------
// Replaces the `const [mounted, setMounted] = useState(false);
// useEffect(() => setMounted(true), [])` pattern without an extra
// effect-driven render (react-hooks/set-state-in-effect).
// ============================================================

const subscribe = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false // server snapshot (also used while hydrating)
  );
}
