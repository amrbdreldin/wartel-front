"use client";

import { AlertTriangle, ShieldCheck, ArrowLeft, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useStudentWarnings } from "@/hooks/api/useStudentQueries";
import type { DashboardAlert } from "@/types/student.types";

interface WarningsCardProps {
  alerts: DashboardAlert[];
  locale: string;
}

const parseDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const normalized = dateStr.includes(" ") && !dateStr.includes("T")
    ? dateStr.replace(" ", "T")
    : dateStr;
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? new Date(dateStr) : d;
};

const formatAlertDate = (dateStr?: string, loc: string = "ar") => {
  if (!dateStr) return "-";
  try {
    const d = parseDate(dateStr);
    if (!d || isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(loc === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatAlertTime = (dateStr?: string, loc: string = "ar") => {
  if (!dateStr) return "";
  try {
    const d = parseDate(dateStr);
    if (!d || isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(loc === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

export function WarningsCard({ alerts = [], locale }: WarningsCardProps) {
  const t = useTranslations();
  const warningCount = alerts.length;

  // Optionally retrieve the warnings list from the endpoint to get enriched dynamic names
  const { data: warningsList } = useStudentWarnings();

  const getLevelName = (alert: DashboardAlert, matchedWarning?: any): string => {
    if (alert.level_name) return alert.level_name;
    if (matchedWarning?.level_name) return matchedWarning.level_name;
    const levelId = Number(alert.level_id);
    switch (levelId) {
      case 1:
        return t("warningsTable.level1") || "الإنذار الأول";
      case 2:
        return t("warningsTable.level2") || "الإنذار الثاني";
      case 3:
        return t("warningsTable.level3") || "الإنذار الثالث";
      case 4:
        return t("warningsTable.level4") || "الإنذار النهائي";
      default:
        return levelId ? `${t("warningsTable.level") || "المستوى"} ${levelId}` : t("student.alert") || "إنذار";
    }
  };

  const getReasonName = (alert: DashboardAlert, matchedWarning?: any): string => {
    if (alert.reason_name) return alert.reason_name;
    if (matchedWarning?.reason_name) return matchedWarning.reason_name;
    const reasonId = Number(alert.reason_id);
    switch (reasonId) {
      case 1:
      case 2:
        return t("warningsTable.reasonUnjustifiedAbsence") || t("student.warningUnjustifiedAbsence") || "غياب غير مبرر";
      default:
        return reasonId ? `${t("warningsTable.reason") || "السبب"} #${reasonId}` : "";
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col relative overflow-hidden h-full">
      
      {/* Red/Amber gradient border at the very top */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-red-600 via-amber-500 to-rose-500" />

      {/* Premium glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-destructive/5 rounded-full blur-3xl pointer-events-none group-hover:bg-destructive/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-destructive/20 to-destructive/5 text-destructive flex items-center justify-center text-2xl mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 border border-destructive/15 shadow-[0_8px_20px_rgba(239,68,68,0.05)]">
        <AlertTriangle className="h-6 w-6" />
      </div>

      {/* Title & Count Badge */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-extrabold text-lg text-foreground tracking-tight">
          {t("student.warningsTitle") || t("nav.warnings") || "سجل الإنذارات"}
        </h3>
        {warningCount > 0 && (
          <span className="bg-destructive/10 text-destructive text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
            {warningCount}
          </span>
        )}
      </div>

      {/* Warnings List Container */}
      <div className="space-y-2.5 my-3 overflow-y-auto overflow-x-hidden max-h-[220px] custom-scrollbar flex-1 w-full">
        {warningCount > 0 ? (
          alerts.map((alert) => {
            const matched = warningsList?.find((w: any) => String(w.id) === String(alert.id));
            const levelName = getLevelName(alert, matched);
            const reasonName = getReasonName(alert, matched);
            const formattedDate = formatAlertDate(alert.issued_at, locale);
            const formattedTime = formatAlertTime(alert.issued_at, locale);
            const hasCustomTitle = Boolean(alert.title && alert.title.trim());
            const displayTitle = hasCustomTitle ? alert.title!.trim() : (reasonName || levelName);
            const showReason = hasCustomTitle && Boolean(reasonName) && reasonName !== displayTitle;

            return (
              <div 
                key={alert.id}
                className="p-3.5 rounded-2xl bg-destructive/5 dark:bg-destructive/10 border border-destructive/15 dark:border-destructive/25 border-s-[4px] border-s-destructive space-y-2 relative overflow-hidden text-start w-full max-w-full box-border select-text"
              >
                {/* Top row: Level Badge with Pulsing indicator & Alert ID */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-destructive min-w-0">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse shrink-0" />
                    <span className="truncate">{levelName}</span>
                  </span>
                  <span className="text-[10px] font-bold font-mono text-muted-foreground bg-background/80 dark:bg-card/80 px-2 py-0.5 rounded-md border border-border/50 shrink-0">
                    #{alert.id}
                  </span>
                </div>

                {/* Main Title / Description */}
                <p className="font-extrabold text-xs text-foreground leading-snug line-clamp-2 break-words" title={displayTitle}>
                  {displayTitle}
                </p>

                {/* Separate reason if title was custom and reason is known */}
                {showReason && (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold min-w-0">
                    <AlertCircle className="w-3 h-3 text-destructive/80 shrink-0" />
                    <span className="truncate min-w-0">{reasonName}</span>
                  </div>
                )}

                {/* Date & Time Footer */}
                <div className="flex items-center justify-between pt-1.5 border-t border-destructive/10 dark:border-destructive/20 text-[10px] text-muted-foreground font-medium gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <Calendar className="w-3 h-3 text-destructive/70 shrink-0" />
                    <span className="truncate">{formattedDate}</span>
                  </div>
                  {formattedTime && (
                    <span className="font-mono text-[10px] opacity-75 shrink-0 whitespace-nowrap">
                      {formattedTime}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 flex-grow min-h-[160px] transition-all duration-300 hover:bg-muted/30">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(16,185,129,0.05)] border border-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 leading-relaxed">
              {t("student.noWarnings") || "لا توجد إنذارات مسجلة لحسابك."}
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
              {t("student.accountProtected") || "حسابك محمي"}
            </p>
          </div>
        )}
      </div>

      {/* Clickable footer link to warnings/notifications log */}
      <div className="mt-auto pt-4 border-t border-border/30">
        <Link
          href={`/${locale}/student/notifications`}
          className="text-xs font-extrabold text-[#007070] dark:text-[#00b3b3] hover:text-primary-dark inline-flex items-center justify-center gap-2 group/link border border-primary/20 hover:border-primary/40 px-4 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 w-full transition-all duration-300 shadow-sm"
        >
          <span>{t("student.goToNotifications") || "عرض سجل الإنذارات"}</span>
          {locale === "ar" ? (
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-x-1" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          )}
        </Link>
      </div>
    </div>
  );
}
