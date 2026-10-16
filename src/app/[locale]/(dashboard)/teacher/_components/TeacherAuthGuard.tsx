"use client";

import { DashboardSkeleton } from "@/components/common/DashboardSkeleton";

import { useIsClient } from "@/hooks/useIsClient";

export function TeacherAuthGuard({ children }: { children: React.ReactNode }) {
  const mounted = useIsClient();

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

