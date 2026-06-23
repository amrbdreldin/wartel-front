"use client";

import { DashboardSkeleton } from "@/components/common/DashboardSkeleton";
import { useState, useEffect } from "react";

export function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Clean up legacy switching flag if still present
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("switching_to_student");
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

