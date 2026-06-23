"use client";

import { Logo } from "@/components/common/Logo";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { getNavigationByRole } from "@/config/navigation";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/enums";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RTL_LOCALES, type Locale } from "@/lib/constants";
import { useSelector } from "react-redux";
import { selectNotifications } from "@/store/slices/notificationSlice";
import type { RootState } from "@/store";

// ============================================================
// MobileSidebar – Sheet-based sidebar for mobile
// ============================================================

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  locale: string;
}

export function MobileSidebar({ open, onClose, locale }: MobileSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { role } = useRole();

  // Dynamically resolve role based on path since auth login is bypassed for testing
  const pathSegment = pathname.split('/')[2] as UserRole;
  const activeRole = Object.values(UserRole).includes(pathSegment) ? pathSegment : (role || UserRole.STUDENT);

  const { user } = useAuth();
  const navGroups = getNavigationByRole(activeRole, user?.role_id);
  
  const isRTL = RTL_LOCALES.includes(locale as Locale);

  // Read notifications and compute unread counts
  const notifications = useSelector((state: RootState) => selectNotifications(state));
  const unreadMessagesCount = notifications.filter((n) => (n.type as string) === "chat" && !n.is_read).length;
  const unreadNotificationsCount = notifications.filter((n) => (n.type as string) !== "chat" && !n.is_read).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side={isRTL ? "right" : "left"} className="w-[280px] p-0">
        <SheetHeader className="px-4 pt-4 pb-0">
          <SheetTitle>
            <Logo size="sm" />
          </SheetTitle>
        </SheetHeader>

        <Separator className="my-3" />

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-4">
              {group.titleKey && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  {t(group.titleKey)}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const resolvedHref = item.href.replace("[userId]", String(user?.id || ""));
                  const href = `/${locale}${resolvedHref}`;
                  const isActive =
                    pathname === href ||
                    (resolvedHref !== `/${role}` && pathname.startsWith(href));

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
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        <div className="relative shrink-0">
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          {hasRedDot && (
                            <span
                              className={cn(
                                "absolute -top-1 -end-1 flex h-2 w-2 rounded-full bg-dark-red ring-2 transition-all duration-300",
                                isActive ? "ring-accent" : "ring-background"
                              )}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <span>{t(item.labelKey)}</span>
                        {badgeCount > 0 && (
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
      </SheetContent>
    </Sheet>
  );
}
