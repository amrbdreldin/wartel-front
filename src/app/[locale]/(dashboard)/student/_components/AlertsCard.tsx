"use client";

import { AlertTriangle, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUnreadCount } from "@/store/slices/notificationSlice";

interface AlertsCardProps {
  alerts: any[];
  locale: string;
}

export function AlertsCard({ alerts, locale }: AlertsCardProps) {
  const t = useTranslations();
  // Unread Firebase notification count from Redux (real-time)
  const unreadNotifCount = useSelector(selectUnreadCount);
  // Combined badge: API academic alerts + unread Firebase notifications
  const totalBadgeCount = alerts.length + unreadNotifCount;

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col relative overflow-hidden h-full">
      
      {/* Red gradient border at the very top */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-destructive via-red-500 to-rose-500" />

      {/* Premium glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-destructive/5 rounded-full blur-3xl pointer-events-none group-hover:bg-destructive/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-destructive/20 to-destructive/5 text-destructive flex items-center justify-center text-2xl mb-4 group-hover:rotate-12 group-hover:scale-115 transition-all duration-500 border border-destructive/15 shadow-[0_8px_20px_rgba(239,68,68,0.05)]">
        <AlertTriangle className="h-6 w-6" />
      </div>

      {/* Title & Count Badge */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-extrabold text-lg text-foreground tracking-tight">{t("student.alerts")}</h3>
        {totalBadgeCount > 0 && (
          <span className="bg-destructive/10 text-destructive text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
            {totalBadgeCount}
          </span>
        )}
      </div>

      {/* Alerts List Container */}
      <div className="space-y-3 mb-4 overflow-y-auto max-h-[140px] custom-scrollbar flex-1">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="p-3.5 rounded-2xl bg-destructive/5 dark:bg-destructive/10 border border-destructive/10 dark:border-destructive/20 border-s-[4px] border-s-destructive text-destructive font-extrabold text-xs flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.01] hover:bg-destructive/8 relative overflow-hidden"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping shrink-0" />
              <span className="truncate">
                {alert.reason_id === "2" 
                  ? t("student.warningUnjustifiedAbsence") 
                  : `${t("student.alert")} #${alert.id}`}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 flex-grow min-h-[160px] transition-all duration-300 hover:bg-muted/30">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(16,185,129,0.05)] border border-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 leading-relaxed">
              {t("student.noAlerts")}
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
              {t("student.accountProtected")}
            </p>
          </div>
        )}
      </div>

      {/* Clickable footer link with Arrow */}
      <div className="mt-auto pt-4 border-t border-border/30 flex justify-center">
        <span className="text-xs font-extrabold text-[#007070] dark:text-[#00b3b3] group-hover:text-primary-dark inline-flex items-center gap-1.5 transition-all duration-300">
          <span>{t("student.goToNotifications") || "عرض الإشعارات"}</span>
          {locale === "ar" ? (
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          )}
        </span>
      </div>

      {/* Overlay Link — correctly routes to the notifications page */}
      <Link href={`/${locale}/student/notifications`} className="absolute inset-0 z-10" aria-label={t("student.goToNotifications")}></Link>
    </div>
  );
}
