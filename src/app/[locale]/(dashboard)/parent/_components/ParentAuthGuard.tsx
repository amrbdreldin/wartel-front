"use client";

import { useAuth } from "@/hooks/useAuth";
import { DashboardSkeleton } from "@/components/common/DashboardSkeleton";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { PARENT_TOKEN_KEY } from "@/lib/constants";

export function ParentAuthGuard({ children }: { children: React.ReactNode }) {
  const { restoreParentSession } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hadParentBackup = !!Cookies.get(PARENT_TOKEN_KEY);

    if (hadParentBackup) {
      restoreParentSession();
    }
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

