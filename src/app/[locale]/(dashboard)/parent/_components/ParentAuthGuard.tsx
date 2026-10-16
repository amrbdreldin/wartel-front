"use client";

import { useAuth } from "@/hooks/useAuth";
import { DashboardSkeleton } from "@/components/common/DashboardSkeleton";
import { useState, useEffect } from "react";
import { hasParentBackup } from "@/lib/session-client";

export function ParentAuthGuard({ children }: { children: React.ReactNode }) {
  const { restoreParentSession } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // A parent who switched to a child comes back here: swap the saved parent session back in first
    const restore = hasParentBackup() ? restoreParentSession() : Promise.resolve(null);
    restore.finally(() => setMounted(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

