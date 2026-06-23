"use client";

import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { LogoutConfirmDialog } from "@/components/common/LogoutConfirmDialog";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

import { UserRole } from "@/types/enums";
import { Bell, Menu, ArrowLeftRight, GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { PARENT_TOKEN_KEY, PARENT_USER_KEY } from "@/lib/constants";
import { toast } from "sonner";
import { useGlobalNotifications } from "@/hooks/api/useGlobalNotifications";

// ============================================================
// Topbar – Dashboard top navigation bar
// ============================================================

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Topbar({ onMenuClick, onToggleCollapse }: TopbarProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, restoreParentSession } = useAuth();

  const [hasParentSession, setHasParentSession] = useState(false);
  const [isRestoringTeacher, setIsRestoringTeacher] = useState(false);

  useEffect(() => {
    const hasParent = !!Cookies.get(PARENT_TOKEN_KEY);
    Promise.resolve().then(() => {
      setHasParentSession(hasParent);
      if (hasParent) {
        const parentUserRaw = Cookies.get(PARENT_USER_KEY);
        if (parentUserRaw) {
          try {
            const parsed = JSON.parse(parentUserRaw);
            setIsRestoringTeacher(parsed.role === UserRole.TEACHER || String(parsed.role_id) === "2");
          } catch {
            setIsRestoringTeacher(false);
          }
        }
      } else {
        setIsRestoringTeacher(false);
      }
    });
  }, [user]);

  const handleReturnToParent = () => {
    const restoredUser = restoreParentSession();
    if (restoredUser) {
      const isTeacher = restoredUser.role === UserRole.TEACHER || String(restoredUser.role_id) === "2";
      toast.success(
        isTeacher
          ? t("returnToTeacherSuccess")
          : t("returnToParentSuccess")
      );
      router.push(`/${locale}/${isTeacher ? "teacher" : "parent"}`);
    }
  };

  const pathSegment = pathname?.split("/")[2] as UserRole;
  const activeRole = Object.values(UserRole).includes(pathSegment)
    ? pathSegment
    : (user?.role || UserRole.STUDENT);

  const isDirectTeacherAsStudent = !hasParentSession && 
    (user?.role === UserRole.TEACHER || String(user?.role_id) === "2") && 
    activeRole === UserRole.STUDENT;

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);



  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  // Global Notifications endpoint integration
  const { data: globalNotifsResponse, isLoading: globalNotifsLoading } = useGlobalNotifications();
  const globalNotifs = globalNotifsResponse?.data || [];
  const latestNotifId = globalNotifs[0]?.id || 0;

  const [lastSeenGlobalId, setLastSeenGlobalId] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("last_seen_global_notification_id");
      if (stored) {
        const val = parseInt(stored, 10);
        Promise.resolve().then(() => {
          setLastSeenGlobalId(val);
        });
      }
    }
  }, []);

  const unreadGlobalCount = globalNotifs.filter((n) => n.id > lastSeenGlobalId).length;

  const handleDropdownOpenChange = (open: boolean) => {
    if (open && latestNotifId) {
      localStorage.setItem("last_seen_global_notification_id", String(latestNotifId));
      setLastSeenGlobalId(latestNotifId);
    }
  };

  return (
    <header
      className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6"
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 cursor-pointer"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop menu toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex h-9 w-9 cursor-pointer"
        onClick={onToggleCollapse}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Return to Parent / Teacher Button */}
        {(hasParentSession || isDirectTeacherAsStudent) && (
          <Button
            variant="outline"
            size="sm"
            onClick={hasParentSession ? handleReturnToParent : () => router.push(`/${locale}/teacher`)}
            className="h-9 gap-1 sm:gap-1.5 px-2 sm:px-3 border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary transition-all font-semibold rounded-xl text-[10px] sm:text-xs cursor-pointer shadow-sm shrink-0 animate-in fade-in duration-300"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>{(hasParentSession ? isRestoringTeacher : true) ? t("backToTeacher") : t("backToParent")}</span>
          </Button>
        )}

        {/* Switch to Student Button (teacher only, no parent session active) */}
        {!hasParentSession && activeRole === UserRole.TEACHER && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${locale}/student`)}
            className="h-9 gap-1 sm:gap-1.5 px-2 sm:px-3 border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary transition-all font-semibold rounded-xl text-[10px] sm:text-xs cursor-pointer shadow-sm shrink-0 animate-in fade-in duration-300"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{t("switchToStudent")}</span>
          </Button>
        )}

        {/* Locale Switcher */}
        <LocaleSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <DropdownMenu onOpenChange={handleDropdownOpenChange}>
          <DropdownMenuTrigger
            className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={t("notifications")}
          >
            <Bell className="h-4 w-4" />
            {unreadGlobalCount > 0 && (
              <span
                className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-dark-red px-1 text-[10px] font-bold text-dark-red-foreground animate-in zoom-in duration-200"
              >
                {unreadGlobalCount > 99 ? "99+" : unreadGlobalCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl shadow-xl border border-border/80 bg-popover text-popover-foreground overflow-hidden max-h-[450px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
              <span className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-primary" />
                {locale === "ar" ? "التنبيهات العاجلة" : "Urgent Alerts"}
              </span>
              {unreadGlobalCount > 0 && (
                <Badge variant="outline" className="text-[10px] font-sans border-primary/20 bg-primary/5 text-primary">
                  {locale === "ar" ? `${unreadGlobalCount} جديدة` : `${unreadGlobalCount} new`}
                </Badge>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto py-1 max-h-[320px]">
              {globalNotifsLoading ? (
                <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
                  {locale === "ar" ? "جاري تحميل التنبيهات..." : "Loading alerts..."}
                </div>
              ) : globalNotifs.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <Bell className="h-5 w-5 opacity-40" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-foreground">
                      {locale === "ar" ? "لا توجد تنبيهات عاجلة حالياً" : "No urgent alerts currently"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {locale === "ar" ? "حسابك محدث بالكامل." : "Your account is up to date."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {globalNotifs.map((notif) => {
                    const isNew = notif.id > lastSeenGlobalId;
                    return (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 flex gap-3 transition-colors hover:bg-muted/40 cursor-default ${
                          isNew ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                          isNew ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-xs font-bold text-foreground leading-relaxed break-words">
                            {notif.message_body}
                          </p>
                          <p className="text-[9px] font-sans text-muted-foreground">
                            {notif.created_at}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <Link
          href={`/${locale}/${activeRole}`}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:block">
            {user?.full_name}
          </span>
        </Link>

        <LogoutConfirmDialog
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
        />
      </div>
    </header>
  );
}
