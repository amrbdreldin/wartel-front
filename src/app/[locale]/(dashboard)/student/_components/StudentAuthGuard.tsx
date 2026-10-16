"use client";

import { DashboardSkeleton } from "@/components/common/DashboardSkeleton";
import { useEffect } from "react";
import { useIsClient } from "@/hooks/useIsClient";

export function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const mounted = useIsClient();

  useEffect(() => {
    // Clean up legacy switching flag if still present
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("switching_to_student");
    }
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

