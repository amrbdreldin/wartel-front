"use client";

import { useTranslations, useLocale } from "next-intl";
import { useTeacherWarnings } from "@/hooks/api/useTeacherQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/DataTable";

export default function TeacherNotificationsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Fetch Warnings from the warnings API endpoint exclusively
  const { data: warningsList, isLoading } = useTeacherWarnings();

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
          <Skeleton className="h-28 rounded-2xl animate-pulse" />
          <Skeleton className="h-28 rounded-2xl animate-pulse" />
          <Skeleton className="h-28 rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
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
            {t("warningsTable.title") || "سجل الإنذارات الأكاديمية"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {t("warningsTable.desc") || "عرض تفصيلي لجميع الإنذارات الأكاديمية الصادرة وحالة كل منها."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link 
            href={`/${locale}/teacher`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all border border-border/60"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t("student.backToDashboard") || "العودة للوحة التحكم"}
          </Link>
        </div>
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

        {/* Stat Card 3: System Status */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.04)] transition-all">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
            {t("teacher.systemStatus") || "حالة النظام"}
          </p>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-lg font-extrabold text-emerald-500">
              {t("teacher.systemActive") || "نشط"}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings Log Table Section */}
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
