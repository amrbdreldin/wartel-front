"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Lock,
  Calendar,
  Clock,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Award,
  AlertCircle,
  RotateCcw,
  Percent,
  History,
  FileText,
  UserCheck,
  Filter,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useTeacherStudentPreviousAttendance } from "@/hooks/api/useTeacherQueries";
import { Skeleton } from "@/components/ui/skeleton";
import type { PreviousAttendanceRecord } from "@/types/teacher.types";

interface StudentRecord {
  id: string;
  name: string;
  loginTime: string | null;
  decision: "present" | "excused" | "absent";
  score: string;
  notes: string;
  secret_note: string;
  group: string;
  subject: string;
}

interface StudentDetailsSidebarProps {
  student: StudentRecord | null;
  sessionId: string | number;
  setSelectedStudentDetails: (student: StudentRecord | null) => void;
  maxScore?: number;
  getGradeLabel?: (score: string, max: number) => { label: string; color: string };
  t: (key: string, values?: Record<string, string | number>) => string;
}

type AttendanceFilter = "all" | "present" | "absent" | "excused";

export function StudentDetailsSidebar({
  student,
  sessionId,
  setSelectedStudentDetails,
  t,
}: StudentDetailsSidebarProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const tCommon = useTranslations("common");
  const [filter, setFilter] = useState<AttendanceFilter>("all");

  // Reset filter when switching students
  useEffect(() => {
    setFilter("all");
  }, [student?.id]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedStudentDetails(null);
      }
    };
    if (student) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [student, setSelectedStudentDetails]);

  const {
    data: previousRecords,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useTeacherStudentPreviousAttendance(
    sessionId,
    student?.id,
    !!student?.id
  );

  // Format date helper: returns separated date and time for clean mobile display
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return { date: "--", time: null };
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { date: dateStr, time: null };

      const formattedDate = new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);

      // Check if time portion is present
      const hasTime =
        date.getHours() !== 0 ||
        date.getMinutes() !== 0 ||
        dateStr.includes("T") ||
        dateStr.includes(":");

      const formattedTime = hasTime
        ? new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).format(date)
        : null;

      return { date: formattedDate, time: formattedTime };
    } catch {
      return { date: dateStr, time: null };
    }
  };

  // Raw records list
  const records: PreviousAttendanceRecord[] = useMemo(() => {
    return Array.isArray(previousRecords) ? previousRecords : [];
  }, [previousRecords]);

  // Statistics calculation
  const totalSessions = records.length;
  const presentCount = records.filter(
    (r) =>
      r.status_id === 1 ||
      r.status?.id === 1 ||
      r.status?.name?.includes("حضور") ||
      r.status?.name === "present"
  ).length;
  const excusedCount = records.filter(
    (r) =>
      r.status_id === 3 ||
      r.status?.id === 3 ||
      r.status?.name?.includes("عذر") ||
      r.status?.name === "excused"
  ).length;
  const absentCount = records.filter(
    (r) =>
      r.status_id === 2 ||
      r.status?.id === 2 ||
      r.status?.name?.includes("غياب") ||
      r.status?.name === "absent"
  ).length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (filter === "all") return records;
    if (filter === "present") {
      return records.filter(
        (r) =>
          r.status_id === 1 ||
          r.status?.id === 1 ||
          r.status?.name?.includes("حضور") ||
          r.status?.name === "present"
      );
    }
    if (filter === "excused") {
      return records.filter(
        (r) =>
          r.status_id === 3 ||
          r.status?.id === 3 ||
          r.status?.name?.includes("عذر") ||
          r.status?.name === "excused"
      );
    }
    if (filter === "absent") {
      return records.filter(
        (r) =>
          r.status_id === 2 ||
          r.status?.id === 2 ||
          r.status?.name?.includes("غياب") ||
          r.status?.name === "absent"
      );
    }
    return records;
  }, [records, filter]);

  if (!student) return null;

  return (
    <>
      {/* Backdrop with smooth fade */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs animate-in fade-in duration-300"
        onClick={() => setSelectedStudentDetails(null)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer (Mobile Optimized) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("previousAttendance") || "سجل الحضور السابق"}
        className={cn(
          "fixed top-0 bottom-0 z-50 w-full sm:max-w-lg md:max-w-xl bg-background shadow-2xl flex flex-col overflow-hidden animate-in duration-300 transition-all",
          "rtl:right-0 rtl:left-auto rtl:border-s rtl:border-border rtl:slide-in-from-right",
          "ltr:left-0 ltr:right-auto ltr:border-e ltr:border-border ltr:slide-in-from-left"
        )}
      >
        {/* Mobile Swipe / Drag Handle Indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0 bg-background">
          <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header: Student Info & Close Button */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-border/80 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-black text-lg sm:text-xl shrink-0 shadow-md shadow-primary/20 select-none">
              {student.name.trim().charAt(0) || "ط"}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-foreground truncate">
                {student.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-primary font-bold">
                  {student.group}
                </span>
                <span>•</span>
                <span className="truncate">{student.subject}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedStudentDetails(null)}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-all active:scale-90 shrink-0"
            aria-label={tCommon("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Single Navigation Tab (Focused only on Previous Attendance) */}
        <div className="px-4 sm:px-6 pt-2.5 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-black rounded-t-xl border-b-2 border-primary text-primary bg-background shadow-xs -mb-[1px]">
              <History className="w-4 h-4 shrink-0 text-primary" />
              <span>{t("historyTab") || "السجل السابق"}</span>
              {totalSessions > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-black">
                  {totalSessions}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 pb-8">
          {/* Header Title & Subtitle */}
          <div>
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>{t("previousAttendance") || "سجل الحضور السابق"}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t("previousAttendanceDesc") || "سجلات الحضور والغياب والدرجات للحلقات السابقة"}
            </p>
          </div>

          {/* Loading Skeletons */}
          {isHistoryLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          ) : isHistoryError ? (
            /* Error State */
            <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-3 my-4">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-xs font-bold text-destructive">
                {t("errorDesc") || "تعذر تحميل سجل الحضور السابق"}
              </p>
              <button
                onClick={() => refetchHistory()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("retry") || "إعادة المحاولة"}</span>
              </button>
            </div>
          ) : records.length === 0 ? (
            /* Empty State */
            <div className="p-8 border border-dashed border-border/80 rounded-3xl text-center space-y-3 bg-muted/20 my-6">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <History className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-foreground">
                {t("noPreviousAttendance") || "لا توجد سجلات حضور سابقة"}
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {t("noPreviousAttendanceDetail") || "لم يتم رصد أي جلسات أو سجلات سابقة لهذا الطالب/ــة حتى الآن في هذا النظام."}
              </p>
            </div>
          ) : (
            <>
              {/* Summary Stats Cards Grid (Mobile-First 2x2, Desktop 4 cols) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {/* 1. Total Sessions */}
                <div className="p-3 bg-card border border-border/80 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{t("totalSessions") || "إجمالي الحلقات"}</span>
                  </div>
                  <div className="text-xl font-black text-foreground">
                    {totalSessions}
                  </div>
                </div>

                {/* 2. Attendance Rate */}
                <div className="p-3 bg-card border border-border/80 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mb-1.5">
                    <Percent className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{t("attendanceRate") || "نسبة الحضور"}</span>
                  </div>
                  <div className="space-y-1">
                    <div
                      className={cn(
                        "text-xl font-black",
                        attendanceRate >= 80
                          ? "text-emerald-600 dark:text-emerald-400"
                          : attendanceRate >= 50
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {attendanceRate}%
                    </div>
                    {/* Mini Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          attendanceRate >= 80
                            ? "bg-emerald-500"
                            : attendanceRate >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        )}
                        style={{ width: `${Math.min(100, Math.max(0, attendanceRate))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Present Count */}
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{t("presentCount") || "حضور"}</span>
                  </div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                    {presentCount}
                  </div>
                </div>

                {/* 4. Absent & Excused Count */}
                <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1 mb-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span className="truncate">{t("absentOrExcused") || "غياب / عذر"}</span>
                  </div>
                  <div className="text-xl font-black text-rose-700 dark:text-rose-300">
                    {absentCount + excusedCount}
                  </div>
                </div>
              </div>

              {/* Quick Status Filter Chips (Mobile Friendly) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar pt-1">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl font-black transition-all shrink-0 text-xs active:scale-95",
                    filter === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {t("filterAll") || tCommon("all") || "الكل"} ({totalSessions})
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("present")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black transition-all shrink-0 text-xs active:scale-95",
                    filter === "present"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                  )}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t("presentCount") || "حضور"}</span>
                  <span>({presentCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("absent")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black transition-all shrink-0 text-xs active:scale-95",
                    filter === "absent"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20"
                  )}
                >
                  <XCircle className="w-3 h-3" />
                  <span>{t("absentCount") || "غياب"}</span>
                  <span>({absentCount})</span>
                </button>

                {excusedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter("excused")}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-black transition-all shrink-0 text-xs active:scale-95",
                      filter === "excused"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                    )}
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>{t("excusedCount") || "عذر"}</span>
                    <span>({excusedCount})</span>
                  </button>
                )}
              </div>

              {/* Sessions List */}
              {filteredRecords.length === 0 ? (
                <div className="p-6 border border-dashed border-border/70 rounded-2xl text-center space-y-2.5 bg-muted/10 my-4">
                  <Filter className="w-6 h-6 text-muted-foreground mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground">
                    {t("noMatchingRecords") || "لا توجد سجلات مطابقة لهذا الفلتر"}
                  </p>
                  <button
                    onClick={() => setFilter("all")}
                    className="text-xs font-black text-primary hover:underline"
                  >
                    {t("resetFilter") || "عرض جميع السجلات"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-0.5">
                  {filteredRecords.map((record, index) => {
                    const isPresent =
                      record.status_id === 1 ||
                      record.status?.id === 1 ||
                      record.status?.name?.includes("حضور") ||
                      record.status?.name === "present";
                    const isExcused =
                      record.status_id === 3 ||
                      record.status?.id === 3 ||
                      record.status?.name?.includes("عذر") ||
                      record.status?.name === "excused";
                    const isExam = Number(record.session?.is_exam) === 1;
                    const hasPointsVal =
                      record.points !== null &&
                      record.points !== undefined &&
                      String(record.points) !== "0.00" &&
                      String(record.points) !== "0";

                    const { date: formattedDate, time: formattedTime } = formatDateTime(
                      record.session?.scheduled_at
                    );

                    return (
                      <div
                        key={record.attendance_id || index}
                        className={cn(
                          "group relative bg-card rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 shadow-xs hover:shadow-sm space-y-2.5",
                          isPresent
                            ? "border-emerald-500/30 hover:border-emerald-500/60"
                            : isExcused
                            ? "border-amber-500/30 hover:border-amber-500/60"
                            : "border-rose-500/30 hover:border-rose-500/60"
                        )}
                      >
                        {/* Top Row: Date, Time & Badges */}
                        <div className="flex items-start justify-between gap-2">
                          {/* Date and Time Info */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                                isPresent
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : isExcused
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                              )}
                            >
                              {isPresent ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : isExcused ? (
                                <HelpCircle className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-black text-foreground truncate">
                                {formattedDate}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium mt-0.5">
                                {formattedTime && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-muted-foreground/70" />
                                    <span>{formattedTime}</span>
                                  </span>
                                )}
                                {formattedTime && <span>•</span>}
                                <span className="font-bold text-foreground/80">
                                  {record.session?.id
                                    ? t("sessionNo", { id: record.session.id }) || `حلقة #${record.session.id}`
                                    : t("sessionDefault") || "جلسة"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status and Type Badges */}
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                            {/* Exam Badge */}
                            {isExam ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                                <Award className="w-3 h-3" />
                                <span>{t("examSession") || "جلسة اختبار"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-muted text-muted-foreground border border-border/50">
                                <span>{t("regularSession") || "حلقة عادية"}</span>
                              </span>
                            )}

                            {/* Attendance Status Badge */}
                            {isPresent ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{record.status?.name || t("presentCount") || "حضور"}</span>
                              </span>
                            ) : isExcused ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                <HelpCircle className="w-3 h-3" />
                                <span>{record.status?.name || t("excusedCount") || "عذر"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                                <XCircle className="w-3 h-3" />
                                <span>{record.status?.name || t("absentCount") || "غياب"}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle Row: Degree, Points, Recorder */}
                        {(hasPointsVal || record.degree || record.recorder?.full_name) && (
                          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs border-t border-border/50">
                            {hasPointsVal && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-black bg-primary/10 text-primary border border-primary/20 text-[11px]">
                                <Award className="w-3 h-3" />
                                <span>
                                  {t("pointsCount", { points: parseFloat(String(record.points)) }) ||
                                    `${record.points} درجة`}
                                </span>
                              </span>
                            )}

                            {record.degree && (
                              <span className="px-2 py-0.5 rounded-lg font-bold bg-muted text-foreground border border-border text-[11px]">
                                {typeof record.degree === "string"
                                  ? record.degree
                                  : record.degree?.name || ""}
                              </span>
                            )}

                            {record.recorder?.full_name && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground ms-auto font-medium">
                                <UserCheck className="w-3 h-3 text-muted-foreground" />
                                <span>{t("recordedBy", { name: record.recorder.full_name })}</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* Teacher Comment Note */}
                        {record.comment && (
                          <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 text-xs text-foreground/90 space-y-1">
                            <span className="font-bold text-muted-foreground text-[10px] block">
                              {t("notes") || "الملاحظات"}:
                            </span>
                            <p className="leading-relaxed font-medium">{record.comment}</p>
                          </div>
                        )}

                        {/* Teacher Secret Note */}
                        {record.secret_note && (
                          <div className="bg-amber-500/5 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                            <span className="font-black text-[10px] flex items-center gap-1 text-amber-700 dark:text-amber-400">
                              <Lock className="w-3 h-3" />
                              <span>{t("secretNote") || "ملاحظة سرية"}:</span>
                            </span>
                            <p className="leading-relaxed font-medium">{record.secret_note}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
