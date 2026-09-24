"use client";

import React, { useState, useEffect } from "react";
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
  maxScore: number;
  getGradeLabel: (score: string, max: number) => { label: string; color: string };
  t: (key: string, values?: Record<string, string | number>) => string;
}

export function StudentDetailsSidebar({
  student,
  sessionId,
  setSelectedStudentDetails,
  maxScore,
  getGradeLabel,
  t,
}: StudentDetailsSidebarProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const tCommon = useTranslations("common");
  const [activeTab, setActiveTab] = useState<"history" | "current">("history");
  const [prevStudentId, setPrevStudentId] = useState<string | null>(student?.id ?? null);

  // Sync tab back to history when switching students
  if (student && student.id !== prevStudentId) {
    setPrevStudentId(student.id);
    setActiveTab("history");
  }

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

  if (!student) return null;

  // Format date helper
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "--";
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  // Calculate statistics from previous attendance records
  const records: PreviousAttendanceRecord[] = Array.isArray(previousRecords) ? previousRecords : [];
  const totalSessions = records.length;
  const presentCount = records.filter(
    (r) => r.status_id === 1 || r.status?.id === 1 || r.status?.name?.includes("حضور") || r.status?.name === "present"
  ).length;
  const excusedCount = records.filter(
    (r) => r.status_id === 3 || r.status?.id === 3 || r.status?.name?.includes("عذر") || r.status?.name === "excused"
  ).length;
  const absentCount = records.filter(
    (r) => r.status_id === 2 || r.status?.id === 2 || r.status?.name?.includes("غياب") || r.status?.name === "absent"
  ).length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setSelectedStudentDetails(null)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("studentDetails") || "تفاصيل الطالب"}
        className={cn(
          "fixed top-0 bottom-0 z-50 w-full sm:max-w-lg md:max-w-xl bg-background shadow-2xl flex flex-col overflow-hidden animate-in duration-300 transition-all",
          "rtl:right-0 rtl:left-auto rtl:border-s rtl:border-border rtl:slide-in-from-right",
          "ltr:left-0 ltr:right-auto ltr:border-e ltr:border-border ltr:slide-in-from-left"
        )}
      >
        {/* Sticky Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-primary/20 select-none">
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
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-all active:scale-95 shrink-0"
            aria-label={tCommon("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black rounded-t-xl transition-all border-b-2 -mb-[1px]",
                activeTab === "history"
                  ? "border-primary text-primary bg-background shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <History className="w-4 h-4" />
              <span>{t("historyTab") || "السجل السابق"}</span>
              {totalSessions > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-extrabold">
                  {totalSessions}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("current")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black rounded-t-xl transition-all border-b-2 -mb-[1px]",
                activeTab === "current"
                  ? "border-primary text-primary bg-background shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>{t("currentTab") || "الحلقة الحالية"}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === "history" ? (
            /* ═══════════ TAB 1: PREVIOUS ATTENDANCE HISTORY ═══════════ */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Header Description */}
              <div>
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {t("previousAttendance") || "سجل الحضور السابق"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("previousAttendanceDesc") || "سجلات الحضور والغياب والدرجات للحلقات السابقة"}
                </p>
              </div>

              {isHistoryLoading ? (
                /* Loading Skeletons */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 rounded-2xl" />
                    ))}
                  </div>
                  <Skeleton className="h-28 rounded-2xl" />
                  <Skeleton className="h-28 rounded-2xl" />
                  <Skeleton className="h-28 rounded-2xl" />
                </div>
              ) : isHistoryError ? (
                /* Error State */
                <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
                  <p className="text-xs font-bold text-destructive">
                    {t("errorDesc") || "تعذر تحميل سجل الحضور السابق"}
                  </p>
                  <button
                    onClick={() => refetchHistory()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold rounded-xl transition-all"
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
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Total Sessions */}
                    <div className="p-3 bg-card border border-border/70 rounded-2xl shadow-xs">
                      <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-primary" />
                        <span>{t("totalSessions") || "إجمالي الحلقات"}</span>
                      </div>
                      <div className="text-lg font-black text-foreground">
                        {totalSessions}
                      </div>
                    </div>

                    {/* Attendance Rate */}
                    <div className="p-3 bg-card border border-border/70 rounded-2xl shadow-xs">
                      <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 mb-1">
                        <Percent className="w-3 h-3 text-emerald-500" />
                        <span>{t("attendanceRate") || "نسبة الحضور"}</span>
                      </div>
                      <div className={cn(
                        "text-lg font-black",
                        attendanceRate >= 80 ? "text-emerald-600 dark:text-emerald-400" :
                        attendanceRate >= 50 ? "text-warning-600" : "text-destructive"
                      )}>
                        {attendanceRate}%
                      </div>
                    </div>

                    {/* Present Count */}
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl shadow-xs">
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t("presentCount") || "حضور"}</span>
                      </div>
                      <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                        {presentCount}
                      </div>
                    </div>

                    {/* Absent & Excused */}
                    <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-2xl shadow-xs">
                      <div className="text-[11px] font-bold text-destructive flex items-center gap-1 mb-1">
                        <XCircle className="w-3 h-3" />
                        <span>{t("absentCount") || "غياب / عذر"}</span>
                      </div>
                      <div className="text-lg font-black text-destructive">
                        {absentCount + excusedCount}
                      </div>
                    </div>
                  </div>

                  {/* Sessions Timeline Cards */}
                  <div className="space-y-3.5 pt-1">
                    {records.map((record, index) => {
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
                      const hasPointsVal = record.points !== null && record.points !== undefined && String(record.points) !== "0.00" && String(record.points) !== "0";

                      return (
                        <div
                          key={record.attendance_id || index}
                          className="bg-card border border-border/80 hover:border-primary/40 rounded-2xl p-4 transition-all shadow-xs hover:shadow-sm space-y-3"
                        >
                          {/* Card Top: Date & Badges */}
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-foreground">
                                  {formatDateTime(record.session?.scheduled_at)}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  {record.session?.id ? (
                                    t("sessionNo", { id: record.session.id }) || `حلقة #${record.session.id}`
                                  ) : (
                                    t("sessionDefault") || "جلسة"
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {/* Exam Badge */}
                              {isExam ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                  <Award className="w-3 h-3" />
                                  <span>{t("examSession") || "جلسة اختبار"}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-muted text-muted-foreground">
                                  <span>{t("regularSession") || "حلقة عادية"}</span>
                                </span>
                              )}

                              {/* Attendance Status Badge */}
                              {isPresent ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{record.status?.name || t("present") || "حضور"}</span>
                                </span>
                              ) : isExcused ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  <span>{record.status?.name || t("excused") || "بعذر"}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-destructive/10 text-destructive border border-destructive/20">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{record.status?.name || t("absent") || "غياب"}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Extra info row: Points, Degree, Recorder */}
                          {(hasPointsVal || record.degree || record.recorder) && (
                            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                              {hasPointsVal && (
                                <span className="px-2.5 py-1 rounded-lg font-black bg-primary/10 text-primary border border-primary/20">
                                  {t("pointsCount", { points: parseFloat(String(record.points)) }) || `${record.points} درجة`}
                                </span>
                              )}
                              {record.degree && (
                                <span className="px-2.5 py-1 rounded-lg font-bold bg-muted text-foreground border border-border">
                                  {typeof record.degree === "string" ? record.degree : record.degree?.name || ""}
                                </span>
                              )}
                              {record.recorder?.full_name && (
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1 ms-auto">
                                  <UserCheck className="w-3 h-3 text-muted-foreground" />
                                  <span>{t("recordedBy", { name: record.recorder.full_name })}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Teacher Note */}
                          {record.comment && (
                            <div className="bg-muted/40 p-2.5 rounded-xl border border-border/50 text-xs text-foreground/90 space-y-1">
                              <span className="font-bold text-muted-foreground text-[10px] block">
                                {t("notes") || "الملاحظات"}:
                              </span>
                              <p className="leading-relaxed">{record.comment}</p>
                            </div>
                          )}

                          {/* Secret Note */}
                          {record.secret_note && (
                            <div className="bg-primary/5 p-2.5 rounded-xl border border-primary/15 text-xs text-primary dark:text-primary-foreground space-y-1">
                              <span className="font-black text-[10px] flex items-center gap-1">
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
                </>
              )}
            </div>
          ) : (
            /* ═══════════ TAB 2: CURRENT SESSION DATA ═══════════ */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Description */}
              <div>
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {t("currentSessionInfo") || "بيانات الحلقة الحالية"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("currentSessionDesc") || "تفاصيل تسجيل الحضور والدرجات للجلسة المفتوحة حالياً"}
                </p>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">
                    {t("attendanceStatus")}
                  </div>
                  <div className="font-black text-sm">
                    {student.decision === "present" ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {t("present")}
                      </span>
                    ) : student.decision === "excused" ? (
                      <span className="text-amber-600 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        {t("excused")}
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        {t("absent")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-card p-4 rounded-2xl border border-border/70 shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">
                    {t("scoreLabel")}
                  </div>
                  <div className="font-black text-sm text-foreground">
                    {student.score ? `${student.score} / ${maxScore}` : "--"}
                  </div>
                </div>
              </div>

              {/* Session Activity */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
                  {t("sessionActivity")}
                </h4>
                <div className="space-y-3 bg-card border border-border/70 p-4 rounded-2xl shadow-xs">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">{t("entryTime")}</span>
                    <span className="font-bold text-foreground">
                      {student.loginTime ? (
                        <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-500/20 text-xs">
                          {student.loginTime}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">{t("noEntry")}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">{t("autoEvaluation")}</span>
                    <span className={cn("font-bold text-sm", getGradeLabel(student.score, maxScore).color)}>
                      {getGradeLabel(student.score, maxScore).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
                  {t("achievementNotes")}
                </h4>
                <div className="bg-muted/30 border border-border/70 p-4 rounded-2xl min-h-[90px] text-xs text-foreground/80 leading-relaxed font-medium">
                  {student.notes || t("noAdditionalNotes")}
                </div>
              </div>

              {/* Secret Notes */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>{t("secretNote")}</span>
                </h4>
                <div className="bg-primary/5 border border-primary/15 p-4 rounded-2xl min-h-[70px] text-xs text-foreground/80 leading-relaxed font-medium">
                  {student.secret_note || t("noSecretNote")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
