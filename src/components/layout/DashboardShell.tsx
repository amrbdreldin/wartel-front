"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { MobileSidebar } from "./MobileSidebar";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuth } from "@/hooks/useAuth";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

// ============================================================
// DashboardShell – Main layout wrapper
// ============================================================

interface DashboardShellProps {
  children: React.ReactNode;
  locale: string;
}

export function DashboardShell({ children, locale }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const tNotifications = useTranslations("notifications");
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated) {
      // Clean locale prefix (e.g. /ar/parent -> /parent, /ar/student/profile-details -> /student/profile-details)
      const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
      const isDashboardOrProfile =
        cleanPath === "/parent" ||
        cleanPath === "/student" ||
        cleanPath === "/teacher" ||
        cleanPath.includes("profile-details");

      requestNotificationToken(tNotifications("blocked_guide"), isDashboardOrProfile);
    }
  }, [isAuthenticated, tNotifications, pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} locale={locale} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300",
          collapsed ? "lg:ps-[72px]" : "lg:ps-[260px]"
        )}
      >
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          sidebarCollapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
