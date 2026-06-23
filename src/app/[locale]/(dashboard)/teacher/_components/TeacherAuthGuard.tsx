"use client";

import { DashboardSkeleton } from "@/components/common/DashboardSkeleton";
import { useState, useEffect } from "react";

export function TeacherAuthGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

