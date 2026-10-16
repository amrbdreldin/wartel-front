"use client";

import { useTranslations, useLocale } from "next-intl";
import { useStudentWarnings } from "@/hooks/api/useStudentQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, AlertTriangle, Shield, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/DataTable";

// ============================================================
// Student Warnings & Academic Alerts Page
// ============================================================
export default function NotificationsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Fetch Warnings from the new endpoint exclusively
  const { data: warningsList, isLoading, isError, refetch } = useStudentWarnings();

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto px-4 py-8">
        <div className="pb-6 border-b border-border/50">
          <Skeleton className="h-9 w-48 rounded-lg mb-2" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="h-32 bg-muted border border-border rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h4 className="text-xl font-bold text-foreground">
            {t("student.warningsLoadError") || "تعذّر تحميل سجل الإنذارات"}
          </h4>
          <p className="text-muted-foreground text-sm">
            {t("student.warningsLoadErrorDesc") || "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm transition-all hover:bg-primary/90 hover:-translate-y-0.5 shadow-sm cursor-pointer"
          >
            {t("common.retry") || "إعادة المحاولة"}
          </button>
        </div>
      </div>
    );
  }

  const warnings = warningsList || [];
  const totalWarnings = warnings.length;
  const activeAlertsCount = warnings.filter(
    (w: any) => String(w.status_id) === "1" || w.status_name === "مفعل"
  ).length;

  const columns: Column<any>[] = [
    {
      key: "id",
      header: t("warningsTable.id"),
      render: (_, idx) => idx + 1,
    },
    {
      key: "level_name",
      header: t("warningsTable.level"),
      sortable: true,
      render: (warning: any) => {
        const isActive = String(warning.status_id) === "1" || warning.status_name === "مفعل";
        return (
          <span className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? "bg-destructive animate-pulse" : "bg-muted-foreground/40"}`} />
            {warning.level_name}
          </span>
        );
      },
    },
    {
      key: "reason_name",
      header: t("warningsTable.reason"),
      sortable: true,
      className: "font-bold text-foreground/80",
    },
    {
      key: "type",
      header: t("warningsTable.type"),
      render: (warning: any) => {
        return warning.type === "good" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            {t("warningsTable.typeGood")}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase shrink-0 bg-destructive/10 text-destructive border-destructive/20">
            {t("warningsTable.typeBad")}
          </span>
        );
      },
    },
    {
      key: "issued_at",
      header: t("warningsTable.issuedAt"),
      sortable: true,
      render: (warning: any) => {
        return warning.issued_at ? formatDate(warning.issued_at) : "-";
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
            {t("student.warningsTitle") || "سجل الإنذارات"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {t("student.warningsDesc") || "سجل بالإنذارات الأكاديمية الصادرة بحقك بناءً على الغياب أو المخالفات."}
          </p>
        </div>
        <Link 
          href={`/${locale}/student`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all border border-border/60"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t("student.profileDetails.backToStudent") || "العودة للوحة التحكم"}
        </Link>
      </div>

      {/* Info Banner: Active Protection System */}
      <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(var(--primary-rgb),0.02)] flex items-center gap-6 overflow-hidden relative">
        <div className="w-16 h-16 shrink-0 bg-primary/10 text-primary rounded-2xl flex justify-center items-center shadow-sm z-10">
          <ShieldCheck className="w-8 h-8 text-[#007070]" />
        </div>
        <div className="relative z-10 flex-1">
          <h2 className="font-extrabold text-primary text-lg mb-1">{t("student.activeProtectionSystem")}</h2>
          <p className="text-primary/80 text-sm font-semibold m-0 leading-relaxed">{t("student.activeProtectionDesc")}</p>
        </div>
        <Shield className="w-64 h-64 absolute rtl:left-[-2rem] ltr:right-[-2rem] opacity-5 text-primary z-0 stroke-[1] pointer-events-none" />
      </div>

      {/* Statistics Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stat Card 1: Total Warnings */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.04)] transition-all">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
            {t("student.profileDetails.warningsTab") || "إجمالي الإنذارات"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground font-sans">{totalWarnings}</span>
          </div>
        </div>

        {/* Stat Card 3: Account Status */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.04)] transition-all">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
            {t("student.profileDetails.status") || "حالة الحساب"}
          </p>
          <div className="flex items-center gap-2.5 mt-1">
            <span className={`w-3.5 h-3.5 rounded-full animate-ping shrink-0 ${activeAlertsCount >= 3 ? "bg-red-500" : activeAlertsCount > 0 ? "bg-amber-500" : "bg-emerald-500"}`} />
            <span className={`text-lg font-extrabold ${activeAlertsCount >= 3 ? "text-red-500" : activeAlertsCount > 0 ? "text-amber-500" : "text-emerald-500"}`}>
              {activeAlertsCount >= 3 
                ? (t("student.warningsLimitExceeded") || "مخالف للحد المسموح") 
                : activeAlertsCount > 0 
                ? (t("student.warningActive") || "تحت التنبيه") 
                : (t("student.accountProtected") || "حساب محمي")}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings Log Table */}
      {totalWarnings === 0 ? (
        <div className="bg-card rounded-[2rem] p-12 text-center border border-dashed border-border/60">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-foreground mb-2">
            {t("warningsTable.noWarnings") || "لا توجد إنذارات مسجلة"}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t("student.accountProtected") || "حسابك محمي تماماً ومواظبتك في الحلقات ممتازة. بارك الله فيك."}
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={warnings}
          title={
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span>{t("warningsTable.title") || "سجل الإنذارات الأكاديمية"}</span>
            </div>
          }
          pageSize={5}
          searchable
          searchKeys={["reason_name", "level_name"]}
          searchPlaceholder={t("common.search")}
        />
      )}

    </div>
  );
}
