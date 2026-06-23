"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCheck,
  CheckCircle2,
  Clock,
  MessageCircle,
  MessageSquareQuote,
  Info,
  Bell,
  Shield,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useTeacherNotifications, useTeacherWarnings } from "@/hooks/api/useTeacherQueries";
import { teacherService } from "@/services/teacher.service";
import type { Notification } from "@/store/slices/notificationSlice";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface NotificationsViewProps {
  showTelegramSync?: boolean;
}

export function NotificationsView({ showTelegramSync = false }: NotificationsViewProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Fetch notifications from TanStack Query
  const { data: response, isLoading: notificationsLoading, refetch } = useTeacherNotifications();
  const { data: warningsList, isLoading: warningsLoading } = useTeacherWarnings();

  // Local state for notifications to enable instant UI updates
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "urgent" | "admin" | "chat">("all");
  const [mainTab, setMainTab] = useState<"notifications" | "warnings">("notifications");

  // Sync local state when API data changes
  useEffect(() => {
    if (response?.data) {
      setLocalNotifications(response.data);
    }
  }, [response]);

  const unreadCount = localNotifications.filter((n) => !n.is_read).length;

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    // 1. Optimistically update local state instantly
    setLocalNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    // 2. Call API asynchronously in the background
    try {
      await teacherService.markAllNotificationsAsRead();
      refetch(); // sync with server
    } catch (error) {
      console.warn("Could not mark all notifications as read on the server:", error);
      // Handle silently to support simulation if the backend endpoint is pending
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    const target = localNotifications.find((n) => n.id === id);
    if (!target || target.is_read) return;

    // 1. Optimistically update local state instantly
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    // 2. Call API asynchronously in the background
    try {
      await teacherService.markNotificationAsRead(id);
      refetch(); // sync with server
    } catch (error) {
      console.warn(`Could not mark notification ${id} as read on the server:`, error);
      // Handle silently to support simulation if the backend endpoint is pending
    }
  };

  // Category mapping helper
  const getNotificationCategory = (notif: Notification): "urgent" | "admin" | "chat" => {
    const typeStr = notif.type as string;
    if (typeStr === "warning" || typeStr === "danger") return "urgent";
    if (typeStr === "chat") return "chat";
    return "admin";
  };

  // Render helpers based on type
  const getNotificationStyles = (notif: Notification) => {
    const category = getNotificationCategory(notif);

    switch (category) {
      case "urgent":
        return {
          borderClass: "border-s-4 border-destructive",
          iconBgClass: "bg-destructive/10 text-destructive",
          iconNode: <AlertTriangle className="w-5 h-5" />,
          metaClasses: "bg-destructive text-white",
          metaText: t("student.urgentWarning"),
        };
      case "chat":
        return {
          borderClass: "border-s-4 border-cyan-500",
          iconBgClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-500",
          iconNode: <MessageSquareQuote className="w-5 h-5" />,
          metaClasses: "bg-cyan-500 text-white",
          metaText: t("student.privateMessage"),
        };
      default:
        return {
          borderClass: "border-s-4 border-success-500",
          iconBgClass: "bg-success-500/10 text-success-500",
          iconNode: <CheckCircle2 className="w-5 h-5" />,
          metaClasses: "bg-success-500 text-white",
          metaText: t("student.filterAdmin"),
        };
    }
  };

  const formatNotificationTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHrs < 1) {
        const mins = Math.floor(diffMs / (1000 * 60));
        return mins <= 1 ? t("student.timeOneHour") : `${mins} د`;
      } else if (diffHrs < 24) {
        return `${diffHrs} س`;
      } else if (diffHrs < 48) {
        return t("student.timeYesterday");
      } else {
        return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
      }
    } catch {
      return t("student.timeYesterday");
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Filters
  const filteredNotifs = localNotifications.filter((n) => {
    if (activeTab === "all") return true;
    return getNotificationCategory(n) === activeTab;
  });

  const warnings = warningsList || [];
  const totalWarnings = warnings.length;

  const isPageLoading = notificationsLoading || warningsLoading;

  if (isPageLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto px-4 py-8">
        <div className="pb-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-48 rounded-lg mb-2" />
            <Skeleton className="h-4 w-80 rounded" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="h-32 bg-muted border border-border rounded-3xl animate-[pulse_2s_infinite]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-2xl animate-[pulse_2s_infinite]" />
          <Skeleton className="h-28 rounded-2xl animate-[pulse_2s_infinite]" />
          <Skeleton className="h-28 rounded-2xl animate-[pulse_2s_infinite]" />
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-border/30 pb-3 flex-wrap gap-4">
            <Skeleton className="h-6 w-40 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 rounded-3xl animate-[pulse_2s_infinite]" />
            <Skeleton className="h-32 rounded-3xl animate-[pulse_2s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary animate-pulse" />
            {t("teacher.notificationsTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {t("teacher.notificationsDesc")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {unreadCount > 0 && mainTab === "notifications" && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all border border-primary/20 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <CheckCheck className="w-4 h-4" />
              {t("student.markAllAsRead")}
            </button>
          )}
          <Link 
            href={`/${locale}/teacher`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all border border-border/60"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t("student.backToDashboard")}
          </Link>
        </div>
      </div>

      {/* Info Banner: Halaqas Substitute Protection System */}
      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(var(--primary-rgb),0.02)] flex items-center gap-6 overflow-hidden relative">
        <div className="w-16 h-16 shrink-0 bg-primary/10 text-primary rounded-2xl flex justify-center items-center shadow-sm z-10">
          <ShieldCheck className="w-8 h-8 text-[#007070]" />
        </div>
        <div className="relative z-10 flex-1">
          <h2 className="font-extrabold text-primary text-lg mb-1">{t("teacherBoard.smartRequestsSystem")}</h2>
          <p className="text-primary/80 text-sm font-semibold m-0 leading-relaxed">{t("teacherBoard.smartRequestsDesc")}</p>
        </div>
        <Shield className="w-64 h-64 absolute rtl:left-[-2rem] ltr:right-[-2rem] opacity-5 text-primary z-0 stroke-[1] pointer-events-none" />
      </div>

      {/* Statistics Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1: Total Notifications / Warnings */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.04)] transition-all">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
            {mainTab === "notifications" ? t("teacher.totalNotifications") : t("student.profileDetails.warningsTab")}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground font-sans">
              {mainTab === "notifications" ? localNotifications.length : totalWarnings}
            </span>
          </div>
        </div>

        {/* Stat Card 2: Unread Notifications / Active Warnings */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.04)] transition-all">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
            {mainTab === "notifications" ? t("teacher.unreadNotifications") : t("student.warningActive")}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-black font-sans", 
              mainTab === "notifications" 
                ? (unreadCount > 0 ? "text-destructive" : "text-foreground")
                : (totalWarnings > 0 ? "text-destructive" : "text-foreground")
            )}>
              {mainTab === "notifications" ? unreadCount : totalWarnings}
            </span>
            {mainTab === "notifications" && unreadCount > 0 && (
              <span className="text-xs font-bold text-destructive animate-pulse bg-destructive/10 px-2 py-0.5 rounded-full">
                {t("student.xNew", { count: unreadCount })}
              </span>
            )}
          </div>
        </div>

        {/* Stat Card 3: System Status */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.04)] transition-all">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
            {t("teacher.systemStatus")}
          </p>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-lg font-extrabold text-emerald-500">
              {t("teacher.systemActive")}
            </span>
          </div>
        </div>
      </div>

      {/* Telegram Sync Banner (Optional) */}
      {showTelegramSync && (
        <div
          className="bg-gradient-to-r from-sky-600 to-sky-800 text-white rounded-3xl p-6 shadow-info-500/30 shadow-lg flex flex-wrap justify-between items-center gap-4 animate-in fade-in duration-300"
          role="region"
          aria-label="Telegram Sync Banner"
        >
          <div className="flex items-center gap-4">
            <MessageCircle className="w-10 h-10 opacity-90 fill-white/20 stroke-2" />
            <div>
              <h2 className="font-bold text-lg mb-1 text-white">{t("student.telegramSync")}</h2>
              <p className="text-white/95 font-medium text-sm m-0">{t("student.telegramSyncDesc")}</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-400"></span>
            </span>
            {t("student.activeNow")}
          </div>
        </div>
      )}

      {/* Main Tab Switcher */}
      <div className="flex border-b border-border/40 pb-px mb-6">
        <button
          onClick={() => setMainTab("notifications")}
          className={`pb-4 px-6 font-extrabold text-sm border-b-2 transition-all cursor-pointer ${
            mainTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("warningsTable.tabNotifications") || "الإشعارات العامة"}
        </button>
        <button
          onClick={() => setMainTab("warnings")}
          className={`pb-4 px-6 font-extrabold text-sm border-b-2 transition-all cursor-pointer ${
            mainTab === "warnings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-2">
            {t("warningsTable.tabWarnings") || "سجل الإنذارات"}
            {totalWarnings > 0 && (
              <span className="bg-destructive/10 text-destructive text-[10px] font-black px-2 py-0.5 rounded-full">
                {totalWarnings}
              </span>
            )}
          </span>
        </button>
      </div>

      {mainTab === "notifications" ? (
        /* Filter Tabs & Content Section */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border/30 pb-3">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {t("teacher.teacherNotifications")}
            </h3>

            {/* Filter Pills */}
            <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1" aria-label="Filter notifications">
              {[
                { id: "all", label: t("student.filterAll") },
                { id: "urgent", label: t("student.filterUrgent") },
                { id: "admin", label: t("student.filterAdmin") },
                { id: "chat", label: t("student.filterPrivate") },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap px-5 py-1.5 rounded-full font-bold text-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Notifications Grid */}
          {filteredNotifs.length === 0 ? (
            <div className="bg-card rounded-[2rem] p-12 text-center border border-dashed border-border/60">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                {t("teacher.noNotifications")}
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {t("teacher.noNotificationsDesc")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotifs.map((notif) => {
                const styles = getNotificationStyles(notif);

                return (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        markAsRead(notif.id);
                      }
                    }}
                    className={cn(
                      "bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
                      styles.borderClass,
                      notif.is_read
                        ? "opacity-65 bg-muted/20 border-border/30"
                        : "bg-card hover:border-primary/30 hover:-translate-y-0.5"
                    )}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-3">
                          <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center", styles.iconBgClass)}>
                            {styles.iconNode}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-base font-extrabold text-foreground leading-snug">
                              {notif.title.startsWith("notif") ? t(notif.title) : notif.title}
                            </h4>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={cn("text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider", styles.metaClasses)}>
                                {styles.metaText}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase shrink-0", notif.is_read ? "bg-muted text-muted-foreground border-border" : "bg-primary/10 text-primary border-primary/20 animate-pulse")}>
                          {notif.is_read ? t("student.statusCompleted") : t("parent.unread")}
                        </span>
                      </div>

                      <p className="text-xs text-foreground/80 font-bold leading-relaxed mt-3">
                        {notif.message.startsWith("notif") ? t(notif.message) : notif.message}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border/30 mt-4">
                      <div className="text-[10px] font-sans text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <time dateTime={notif.created_at}>
                          {formatNotificationTime(notif.created_at)}
                        </time>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Warnings Log Table Section */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              {t("warningsTable.title") || "سجل الإنذارات الأكاديمية"}
            </h3>
          </div>

          {totalWarnings === 0 ? (
            <div className="bg-card rounded-[2rem] p-12 text-center border border-dashed border-border/60">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                {t("warningsTable.noWarnings") || "لا توجد إنذارات مسجلة"}
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {t("teacher.noWarningsDesc") || "لا توجد إنذارات أكاديمية مسجلة حالياً لطلابك/ــاتك."}
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-[2rem] border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md">
              <table className="w-full min-w-[800px] border-collapse text-start" role="table">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th scope="col" className="px-6 py-4 text-start text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {t("warningsTable.id")}
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {t("warningsTable.level")}
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {t("warningsTable.reason")}
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {t("warningsTable.type")}
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {t("warningsTable.issuedAt")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {warnings.map((warning: any, idx: number) => {
                    const isActive = String(warning.status_id) === "1" || warning.status_name === "مفعل";
                    return (
                      <tr 
                        key={warning.id} 
                        className="transition-colors hover:bg-muted/10 group/row"
                      >
                        <td className="px-6 py-4 text-sm font-sans font-medium text-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-foreground">
                          <span className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? "bg-destructive animate-pulse" : "bg-muted-foreground/40"}`} />
                            {warning.level_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-foreground/80">
                          {warning.reason_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {warning.type === "good" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                              {t("warningsTable.typeGood")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase shrink-0 bg-destructive/10 text-destructive border-destructive/20">
                              {t("warningsTable.typeBad")}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-sans text-muted-foreground font-medium">
                          {warning.issued_at ? formatDate(warning.issued_at) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
