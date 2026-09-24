"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { studentService } from "@/services/student.service";
import { PreviousSessionsTable } from "./_components/PreviousSessionsTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreviousSessionsPage() {
  const t = useTranslations();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-previous-sessions"],
    queryFn: () => studentService.getPreviousSessions(),
  });

  const sessions = React.useMemo(() => data?.data || [], [data?.data]);

  // Compute stats for header cards
  const stats = React.useMemo(() => {
    if (!sessions.length) {
      return {
        total: 0,
        attended: 0,
        absent: 0,
        rate: "0%",
        totalPoints: "0.00",
      };
    }

    const total = sessions.length;
    const attended = sessions.filter(
      (s) => s.is_attended || s.attendance_status?.id === 1
    ).length;
    const absent = sessions.filter(
      (s) =>
        s.attendance_status?.id === 2 ||
        (!s.is_attended && s.attendance_status !== null)
    ).length;

    const rateNum = total > 0 ? Math.round((attended / total) * 100) : 0;
    const rate = `${rateNum}%`;

    const pointsSum = sessions.reduce((acc, curr) => {
      const p = parseFloat(String(curr.points || "0"));
      return acc + (isNaN(p) ? 0 : p);
    }, 0);

    return {
      total,
      attended,
      absent,
      rate,
      totalPoints: pointsSum.toFixed(2),
    };
  }, [sessions]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Page Header */}
      <header className="pb-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                {t("student.previousSessions.pageTitle")}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-0.5 font-medium">
                {t("student.previousSessions.pageSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Statistics Banner */}
      <section
        aria-label={t("student.previousSessions.quickStats")}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Sessions Card */}
        <div className="p-5 rounded-3xl bg-card border border-border/60 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("student.previousSessions.stats.totalSessions")}
            </span>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-black text-foreground">
                {stats.total}
              </p>
            )}
          </div>
        </div>

        {/* Attended Sessions Card */}
        <div className="p-5 rounded-3xl bg-card border border-border/60 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("student.previousSessions.stats.attended")}
            </span>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.attended}
              </p>
            )}
          </div>
        </div>

        {/* Absent Sessions Card */}
        <div className="p-5 rounded-3xl bg-card border border-border/60 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("student.previousSessions.stats.absent")}
            </span>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {stats.absent}
              </p>
            )}
          </div>
        </div>

        {/* Attendance Rate / Total Points Card */}
        <div className="p-5 rounded-3xl bg-card border border-border/60 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("student.previousSessions.stats.attendanceRate")}
            </span>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-foreground">
                  {stats.rate}
                </p>
                {parseFloat(stats.totalPoints) > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {stats.totalPoints}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Table Section */}
      <section aria-label={t("student.previousSessions.pageTitle")}>
        <PreviousSessionsTable
          sessions={sessions}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </section>
    </div>
  );
}
