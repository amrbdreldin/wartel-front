"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Award,
  Search,
  MessageSquare,
  Lock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useTeacherGroupStudents,
  useTeacherSessionAttendance,
} from "@/hooks/api/useTeacherQueries";
import { cn } from "@/lib/utils";
import type { SessionAttendanceRecord } from "@/types/teacher.types";

type AttendanceStatusKey = "present" | "absent" | "excused";

function getStatusKey(record: SessionAttendanceRecord): AttendanceStatusKey {
  if (
    record.status_id === 2 ||
    String(record.status_id) === "2" ||
    record.status?.name === "absent"
  ) {
    return "absent";
  }
  if (
    record.status_id === 3 ||
    String(record.status_id) === "3" ||
    record.status?.name === "excused"
  ) {
    return "excused";
  }
  return "present";
}

export default function PreviousSessionDetailsPage() {
  const t = useTranslations("teacherBoard");
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const groupId = params.groupId as string;
  const sessionId = params.sessionId as string;

  const [searchQuery, setSearchQuery] = useState("");

  const { data: groupData } = useTeacherGroupStudents(groupId);
  const {
    data: attendanceRecords,
    isLoading,
    error,
    refetch,
  } = useTeacherSessionAttendance(sessionId);

  const { presentRecords, absentRecords, excusedCount, sessionMeta } = useMemo(() => {
    const records = attendanceRecords || [];
    const present: SessionAttendanceRecord[] = [];
    const absent: SessionAttendanceRecord[] = [];
    let excused = 0;

    for (const rec of records) {
      const status = getStatusKey(rec);
      if (status === "present") {
        present.push(rec);
      } else {
        if (status === "excused") excused += 1;
        absent.push(rec);
      }
    }

    const firstSession = records[0]?.session;
    return {
      presentRecords: present,
      absentRecords: absent,
      excusedCount: excused,
      sessionMeta: firstSession || null,
    };
  }, [attendanceRecords]);

  const orderedRecords = useMemo(() => {
    const combined = [...presentRecords, ...absentRecords];
    if (!searchQuery.trim()) return combined;
    const q = searchQuery.trim().toLowerCase();
    return combined.filter((r) =>
      (r.student?.full_name || "").toLowerCase().includes(q)
    );
  }, [presentRecords, absentRecords, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        <div className="h-4 w-56 bg-muted rounded" />
        <div className="h-36 bg-muted border border-border rounded-3xl" />
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-8 w-52 bg-muted rounded-xl" />
          </div>
          <div className="divide-y divide-border/50">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="h-4 w-36 bg-muted rounded" />
                <div className="h-6 w-20 bg-muted rounded-lg" />
                <div className="h-6 w-16 bg-muted rounded-lg" />
                <div className="h-4 w-40 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-3xl shadow-xl max-w-xl mx-auto space-y-6 text-center mt-10">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground">{t("error")}</h2>
          <p className="text-sm text-muted-foreground">{t("errorDesc")}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("retry")}</span>
        </button>
      </div>
    );
  }

  const groupName = groupData?.group_name || t("groupNo", { id: groupId });
  const trackName = groupData?.track_name || "";
  const scheduledDate = sessionMeta?.scheduled_at
    ? new Date(sessionMeta.scheduled_at)
    : null;
  const formattedDate = scheduledDate
    ? scheduledDate.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";
  const formattedTime = scheduledDate
    ? scheduledDate.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const totalCount = (attendanceRecords || []).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href={`/${locale}/teacher`} className="font-bold hover:text-primary transition-colors">
          {t("dashboard")}
        </Link>
        <span className="opacity-40">/</span>
        <Link
          href={`/${locale}/teacher/groups/${groupId}?tab=previous-sessions`}
          className="font-bold hover:text-primary transition-colors"
        >
          {groupName}
        </Link>
        <span className="opacity-40">/</span>
        <span className="font-medium text-foreground">{t("previousSessionDetails")}</span>
      </nav>

      {/* Back button */}
      <div>
        <Link
          href={`/${locale}/teacher/groups/${groupId}?tab=previous-sessions`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-xl"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t("backToGroup")}
        </Link>
      </div>

      {/* ── SESSION HEADER CARD ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {trackName && (
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-xs font-bold text-emerald-100">
                  {trackName}
                </span>
              )}
              {sessionMeta?.is_exam === 1 && (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
                  <Award className="w-3.5 h-3.5" />
                  {t("examSession")}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{groupName}</h1>
            <div className="flex items-center gap-4 text-sm text-emerald-100/90 font-semibold flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-300" />
                {formattedDate}
              </span>
              {formattedTime && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-300" />
                  {formattedTime}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-center">
              <div className="text-xs text-emerald-100/80 font-bold mb-1">
                {t("totalStudents")}
              </div>
              <div className="text-2xl font-black">{totalCount}</div>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl px-4 py-3 text-center">
              <div className="text-xs text-emerald-100 font-bold mb-1">
                {t("presentCount")}
              </div>
              <div className="text-2xl font-black text-emerald-200">
                {presentRecords.length}
              </div>
            </div>
            <div className="bg-rose-500/20 border border-rose-400/30 rounded-2xl px-4 py-3 text-center">
              <div className="text-xs text-rose-100 font-bold mb-1">
                {t("absentCount")}
              </div>
              <div className="text-2xl font-black text-rose-200">
                {absentRecords.length - excusedCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ATTENDANCE ROSTER TABLE (MATCHING LIVE SESSION SCREEN) ────────── */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 px-5 sm:px-6 py-4 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground font-semibold flex-wrap">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              {t("totalStudentsCount", { count: totalCount })}
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {t("presentCount")}: {presentRecords.length}
            </span>
            <span>•</span>
            <span className="text-destructive font-extrabold">
              {t("absentCount")}: {absentRecords.length - excusedCount}
            </span>
            {excusedCount > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                  {t("excusedCount")}: {excusedCount}
                </span>
              </>
            )}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchStudent")}
              className="w-full ps-9 pe-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
            />
          </div>
        </div>

        {orderedRecords.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground font-semibold">
            {t("noAttendanceRecords")}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-extrabold border-b border-border/60">
                  <tr>
                    <th className="px-5 py-3.5 text-start">{t("studentName")}</th>
                    <th className="px-4 py-3.5 text-center">{t("finalDecision")}</th>
                    <th className="px-4 py-3.5 text-center">{t("scoreLabel")}</th>
                    <th className="px-4 py-3.5 text-start min-w-[200px]">{t("additionalNotes")}</th>
                    <th className="px-4 py-3.5 text-start min-w-[200px]">{t("privateNote")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {orderedRecords.map((record, idx) => {
                    const statusKey = getStatusKey(record);
                    const prevStatusKey =
                      idx > 0 ? getStatusKey(orderedRecords[idx - 1]) : null;
                    const isFirstAbsentOrExcused =
                      statusKey !== "present" &&
                      (idx === 0 || prevStatusKey === "present");
                    const isFirstPresent = idx === 0 && statusKey === "present";

                    const numericPoints = parseFloat(String(record.points ?? ""));
                    const hasScore = !isNaN(numericPoints) && numericPoints > 0;
                    const degreeName =
                      typeof record.degree === "string"
                        ? record.degree
                        : record.degree?.name;

                    return (
                      <React.Fragment key={record.attendance_id || `${record.student_id}-${idx}`}>
                        {isFirstPresent && (
                          <tr className="bg-emerald-500/5 border-b border-emerald-500/20">
                            <td colSpan={5} className="px-5 py-2.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
                              <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                {t("presentStudentsSection")} ({presentRecords.length})
                              </span>
                            </td>
                          </tr>
                        )}
                        {isFirstAbsentOrExcused && (
                          <tr className="bg-destructive/5 border-y border-destructive/20">
                            <td colSpan={5} className="px-5 py-2.5 text-xs font-black text-destructive">
                              <span className="inline-flex items-center gap-1.5">
                                <XCircle className="w-4 h-4" />
                                {t("absentStudentsSection")} ({absentRecords.length})
                              </span>
                            </td>
                          </tr>
                        )}
                        <tr
                          className={cn(
                            "transition-colors hover:bg-muted/30",
                            statusKey !== "present" && "bg-muted/10"
                          )}
                        >
                          {/* Student Name */}
                          <td className="px-5 py-3.5 align-middle">
                            <div className="font-bold text-sm text-foreground">
                              {record.student?.full_name || "-"}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5 text-center align-middle">
                            <div className="flex flex-col items-center gap-1">
                              {statusKey === "present" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{t("present")}</span>
                                </span>
                              )}
                              {statusKey === "absent" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-destructive text-white shadow-xs">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{t("absent")}</span>
                                </span>
                              )}
                              {statusKey === "excused" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-amber-500 text-white shadow-xs">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{t("excused")}</span>
                                </span>
                              )}
                              {record.joined_at_formatted && (
                                <span className="text-[11px] font-bold text-muted-foreground">
                                  {record.joined_at_formatted}
                                </span>
                              )}
                              {record.absence_reason && (
                                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg break-words max-w-[220px]">
                                  {record.absence_reason}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Score / Degree */}
                          <td className="px-4 py-3.5 text-center align-middle">
                            {statusKey === "present" && (hasScore || degreeName) ? (
                              <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                                {hasScore && (
                                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-black text-xs">
                                    <Award className="w-3.5 h-3.5" />
                                    {t("pointsCount", { points: numericPoints })}
                                  </span>
                                )}
                                {degreeName && (
                                  <span className="inline-flex items-center bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold text-xs">
                                    {degreeName}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">--</span>
                            )}
                          </td>

                          {/* Public Comment */}
                          <td className="px-4 py-3.5 align-middle text-sm text-foreground">
                            {record.comment ? (
                              <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                                {record.comment}
                              </p>
                            ) : (
                              <span className="text-xs text-muted-foreground/60 italic">
                                {t("noNotes")}
                              </span>
                            )}
                          </td>

                          {/* Secret Note */}
                          <td className="px-4 py-3.5 align-middle text-sm text-foreground">
                            {record.secret_note ? (
                              <div className="inline-flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-xl text-xs font-medium text-foreground">
                                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <span className="whitespace-pre-wrap">{record.secret_note}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground/60 italic">--</span>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-border/50">
              {orderedRecords.map((record, idx) => {
                const statusKey = getStatusKey(record);
                const numericPoints = parseFloat(String(record.points ?? ""));
                const hasScore = !isNaN(numericPoints) && numericPoints > 0;
                const degreeName =
                  typeof record.degree === "string"
                    ? record.degree
                    : record.degree?.name;

                return (
                  <div
                    key={record.attendance_id || `${record.student_id}-${idx}`}
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {record.student?.full_name || "-"}
                      </span>
                      {statusKey === "present" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t("present")}
                        </span>
                      )}
                      {statusKey === "absent" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-destructive text-white">
                          <XCircle className="w-3.5 h-3.5" />
                          {t("absent")}
                        </span>
                      )}
                      {statusKey === "excused" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500 text-white">
                          <Clock className="w-3.5 h-3.5" />
                          {t("excused")}
                        </span>
                      )}
                    </div>

                    {(record.joined_at_formatted || record.absence_reason) && (
                      <div className="flex flex-wrap items-center gap-2">
                        {record.joined_at_formatted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-muted/60 text-foreground px-2.5 py-1 rounded-lg border border-border/50">
                            <Clock className="w-3 h-3 text-primary" />
                            {record.joined_at_formatted}
                          </span>
                        )}
                        {record.absence_reason && (
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg break-words">
                            {record.absence_reason}
                          </span>
                        )}
                      </div>
                    )}

                    {statusKey === "present" && (hasScore || degreeName) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {hasScore && (
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-black text-xs">
                            <Award className="w-3.5 h-3.5" />
                            {t("pointsCount", { points: numericPoints })}
                          </span>
                        )}
                        {degreeName && (
                          <span className="inline-flex items-center bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold text-xs">
                            {degreeName}
                          </span>
                        )}
                      </div>
                    )}

                    {record.comment && (
                      <div className="bg-muted/40 rounded-xl p-3 text-xs space-y-1">
                        <div className="font-bold text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {t("additionalNotes")}
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">{record.comment}</p>
                      </div>
                    )}

                    {record.secret_note && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs space-y-1">
                        <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          {t("privateNote")}
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">{record.secret_note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
