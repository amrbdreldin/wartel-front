"use client";

import { Logo } from "@/components/common/Logo";
import { Separator } from "@/components/ui/separator";
import { getNavigationByRole } from "@/config/navigation";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/enums";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectNotifications } from "@/store/slices/notificationSlice";
import type { RootState } from "@/store";

// ============================================================
// Sidebar – Desktop sidebar navigation
// ============================================================

interface SidebarProps {
  collapsed?: boolean;
  locale: string;
}

export function Sidebar({ collapsed = false, locale }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { role } = useRole();
  
  // Dynamically resolve role based on path since auth login is bypassed for testing
  const pathSegment = pathname.split('/')[2] as UserRole;
  const activeRole = Object.values(UserRole).includes(pathSegment) ? pathSegment : (role || UserRole.STUDENT);

  const { user } = useAuth();
  const navGroups = getNavigationByRole(activeRole, user?.role_id);

  // Read notifications and compute unread counts
  const notifications = useSelector((state: RootState) => selectNotifications(state));
  const unreadMessagesCount = notifications.filter((n) => (n.type as string) === "chat" && !n.is_read).length;
  const unreadNotificationsCount = notifications.filter((n) => (n.type as string) !== "chat" && !n.is_read).length;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-30 flex flex-col border-e border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4">
        <Logo showText={!collapsed} size={collapsed ? "sm" : "md"} />
      </div>

      <Separator />

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-4">
            {group.titleKey && !collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                {t(group.titleKey)}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const resolvedHref = item.href.replace("[userId]", String(user?.id || ""));
                const href = `/${locale}${resolvedHref}`;
                // Check if active: match exact or starts-with for nested routes
                const isActive =
                  pathname === href ||
                  (resolvedHref !== `/${activeRole}` &&
                    pathname.startsWith(href));

                // Compute dynamic badge and red dot
                const isMessagesLink = item.labelKey === "nav.messages";
                const isNotificationsLink = item.labelKey === "nav.notifications";
                
                const badgeCount = isMessagesLink 
                  ? unreadMessagesCount 
                  : isNotificationsLink 
                  ? unreadNotificationsCount 
                  : 0;
                
                const hasRedDot = badgeCount > 0;

                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      title={collapsed ? t(item.labelKey) : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <div className="relative shrink-0">
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isActive
                              ? "text-sidebar-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        {hasRedDot && (
                          <span
                            className={cn(
                              "absolute -top-1 -end-1 flex h-2 w-2 rounded-full bg-dark-red ring-2 transition-all duration-300",
                              isActive ? "ring-sidebar-accent" : "ring-sidebar"
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      {!collapsed && <span>{t(item.labelKey)}</span>}
                      {!collapsed && badgeCount > 0 && (
                        <span
                          className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-dark-red px-1.5 text-xs font-bold text-dark-red-foreground animate-in zoom-in duration-300"
                          aria-label={t("unread", { count: badgeCount })}
                        >
                          {badgeCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
