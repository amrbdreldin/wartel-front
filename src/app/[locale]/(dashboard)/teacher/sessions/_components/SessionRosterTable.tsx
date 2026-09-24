"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Users,
  CheckCircle2,
  HelpCircle,
  XCircle,
  MessageSquare,
  History,
  Loader2,
  Save,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SessionRosterTableProps {
  filteredRoster: StudentRecord[];
  detectedCount: number;
  presentCount: number;
  locked: boolean;
  markAllPresent: () => void;
  setDecision: (id: string, decision: "present" | "excused" | "absent") => void;
  handleScoreChange: (id: string, value: string) => void;
  handleNotesChange: (id: string, value: string) => void;
  setSelectedStudentForNote: (student: StudentRecord) => void;
  setNoteContent: (content: string) => void;
  setShowNoteDialog: (show: boolean) => void;
  setSelectedStudentDetails: (student: StudentRecord) => void;
  handleConfirm: () => void;
  isPending: boolean;
  maxScore: number;
  t: (key: string, values?: Record<string, string | number>) => string;
  hasPoints: boolean;
  isExam: boolean;
  onIsExamChange: (val: boolean) => void;
}

export function SessionRosterTable({
  filteredRoster,
  detectedCount,
  presentCount,
  locked,
  markAllPresent,
  setDecision,
  handleScoreChange,
  handleNotesChange,
  setSelectedStudentForNote,
  setNoteContent,
  setShowNoteDialog,
  setSelectedStudentDetails,
  handleConfirm,
  isPending,
  maxScore,
  t,
  hasPoints,
  isExam,
  onIsExamChange,
}: SessionRosterTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const displayedStudents = searchQuery.trim()
    ? filteredRoster.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : filteredRoster;

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      {/* Alert banner */}
      <div className="flex items-start gap-3 bg-warning-500/10 border-b border-warning-500/20 px-5 sm:px-6 py-3.5">
        <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-warning-800 dark:text-warning-300 font-bold leading-relaxed">
          {t("smartAttendanceAlert")}
        </p>
      </div>

      {/* Table toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 px-5 sm:px-6 py-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground font-semibold flex-wrap">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            {t("totalStudentsCount", { count: filteredRoster.length })}
          </span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
            {t("joinedLinkCount", { count: detectedCount })}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search box for roster */}
          {filteredRoster.length > 5 && (
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchStudent") || "بحث عن طالب..."}
                className="w-full ps-8 pe-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
            </div>
          )}

          {/* Exam Attendance Checkbox */}
          <label
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-background border border-border text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer select-none group/exam",
              locked && "opacity-40 cursor-not-allowed",
              isExam && "bg-primary/10 border-primary text-primary"
            )}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={isExam}
                onChange={(e) => onIsExamChange(e.target.checked)}
                disabled={locked}
                className="peer sr-only"
                id="is-exam-checkbox"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded-md border-2 border-border transition-all flex items-center justify-center",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30",
                  "group-hover/exam:border-primary/60",
                  isExam ? "bg-primary border-primary" : "bg-background"
                )}
              >
                {isExam && (
                  <svg className="w-2.5 h-2.5 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span>{t("isExamAttendance")}</span>
          </label>

          {/* Mark All Present */}
          <button
            onClick={markAllPresent}
            disabled={locked}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("markAllPresent")}</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          DESKTOP & TABLET VIEW: Wide Responsive Table (hidden on mobile)
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-extrabold border-b border-border/60">
            <tr>
              <th className="px-4 py-3.5 text-start">{t("studentName")}</th>
              <th className="px-2 py-3.5 text-center">{t("group")}</th>
              <th className="px-2 py-3.5 text-center">{t("subjectExam")}</th>
              <th className="px-2 py-3.5 text-center">{t("loginTime")}</th>
              <th className="px-2 py-3.5 text-center min-w-[270px]">{t("finalDecision")}</th>
              {hasPoints && <th className="px-2 py-3.5 text-center min-w-[90px]">{t("scoreMax", { max: maxScore })}</th>}
              <th className="px-3 py-3.5 text-start min-w-[140px]">{t("additionalNotes")}</th>
              <th className="px-2 py-3.5 text-center">{t("action")}</th>
              <th className="px-3 py-3.5 text-center min-w-[110px]">
                <span className="flex items-center justify-center gap-1">
                  <History className="w-3.5 h-3.5 text-primary" />
                  <span>{t("details") || "التفاصيل"}</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {displayedStudents.map((student, idx) => {
              const isDetected = student.loginTime !== null;
              return (
                <tr
                  key={student.id}
                  className={cn(
                    "transition-colors hover:bg-muted/30 group",
                    !isDetected && "opacity-80"
                  )}
                  style={{ animationDelay: `${idx * 25}ms` }}
                >
                  {/* Name */}
                  <td className="px-4 py-3.5 align-middle">
                    <div className={cn("font-bold text-sm text-foreground", !isDetected && "text-muted-foreground")}>
                      {student.name}
                    </div>
                    {!isDetected && (
                      <span className="text-[11px] text-muted-foreground block mt-0.5">{t("notDetected")}</span>
                    )}
                  </td>

                  {/* Group */}
                  <td className="px-2 py-3.5 text-center align-middle text-xs font-semibold text-muted-foreground">
                    {student.group}
                  </td>

                  {/* Subject */}
                  <td className="px-2 py-3.5 text-center align-middle text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {student.subject}
                  </td>

                  {/* Login Time */}
                  <td className="px-2 py-3.5 text-center align-middle">
                    {student.loginTime ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                        {student.loginTime}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">--</span>
                    )}
                  </td>

                  {/* Decision */}
                  <td className="px-2 py-3.5 align-middle">
                    <div className="flex bg-muted/60 rounded-xl p-1 w-max mx-auto border border-border/50 shadow-inner gap-1">
                      <button
                        onClick={() => setDecision(student.id, "present")}
                        disabled={locked}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-emerald-600",
                          student.decision === "present" &&
                            "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 hover:text-white"
                        )}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t("present")}</span>
                      </button>
                      <button
                        onClick={() => setDecision(student.id, "excused")}
                        disabled={locked}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-amber-600",
                          student.decision === "excused" &&
                            "bg-amber-500 text-white shadow-xs hover:bg-amber-600 hover:text-white"
                        )}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{t("excused")}</span>
                      </button>
                      <button
                        onClick={() => setDecision(student.id, "absent")}
                        disabled={locked}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-destructive",
                          student.decision === "absent" &&
                            "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:text-white"
                        )}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t("absent")}</span>
                      </button>
                    </div>
                  </td>

                  {/* Score Input */}
                  {hasPoints && (
                    <td className="px-2 py-3.5 text-center align-middle">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={student.score}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        placeholder="--"
                        disabled={locked}
                        className="w-16 text-center font-black text-sm border border-border/60 rounded-xl py-1 px-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-background mx-auto text-foreground disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
                      />
                    </td>
                  )}

                  {/* Grade Notes */}
                  <td className="px-3 py-3.5 align-middle">
                    <input
                      type="text"
                      value={student.notes}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                      placeholder={t("notesOptional")}
                      disabled={locked}
                      className="w-full border border-border/60 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-background text-foreground disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
                    />
                  </td>

                  {/* Secret Notes Action */}
                  <td className="px-2 py-3.5 text-center align-middle">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudentForNote(student);
                        setNoteContent(student.secret_note || "");
                        setShowNoteDialog(true);
                      }}
                      className={cn(
                        "p-2 rounded-xl transition-all mx-auto block active:scale-95",
                        student.secret_note
                          ? "bg-primary/15 text-primary hover:bg-primary/25"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10 bg-muted/40"
                      )}
                      title={locked ? (t("secretNote") || "ملاحظة سرية") : t("addSecretNote")}
                      aria-label={t("addSecretNote")}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Previous Attendance & Details Column */}
                  <td className="px-3 py-3.5 text-center align-middle">
                    <button
                      onClick={() => setSelectedStudentDetails(student)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl transition-all duration-200 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/20 border border-primary/20 hover:border-primary active:scale-95 cursor-pointer"
                      title={t("viewPreviousAttendance") || "عرض سجل الحضور والتفاصيل"}
                      aria-label={`${t("viewPreviousAttendance")} - ${student.name}`}
                    >
                      <History className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{t("attendanceHistory") || "السجل السابق"}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MOBILE VIEW: Touch-Friendly Responsive Student Cards (shown on mobile)
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden p-3.5 sm:p-4 space-y-3.5">
        {displayedStudents.map((student) => {
          const isDetected = student.loginTime !== null;
          return (
            <div
              key={student.id}
              className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs space-y-3.5 hover:border-primary/40 transition-all"
            >
              {/* Card Top: Avatar, Name, Group & Subject */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-white flex items-center justify-center font-black text-sm shrink-0 select-none shadow-xs">
                    {student.name.trim().charAt(0) || "ط"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-foreground truncate">
                      {student.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                      <span className="font-bold text-primary truncate max-w-[120px]">{student.group}</span>
                      <span>•</span>
                      <span className="truncate">{student.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Login Status Badge */}
                <div className="shrink-0">
                  {isDetected ? (
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                      {student.loginTime}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-lg">
                      {t("notDetected")}
                    </span>
                  )}
                </div>
              </div>

              {/* Attendance Decision Buttons: Touch-Optimized Segment */}
              <div className="grid grid-cols-3 gap-1.5 bg-muted/50 p-1 rounded-xl border border-border/50">
                <button
                  type="button"
                  onClick={() => setDecision(student.id, "present")}
                  disabled={locked}
                  className={cn(
                    "flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-extrabold transition-all text-muted-foreground hover:text-emerald-600 active:scale-95",
                    student.decision === "present" &&
                      "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 hover:text-white"
                  )}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("present")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision(student.id, "excused")}
                  disabled={locked}
                  className={cn(
                    "flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-extrabold transition-all text-muted-foreground hover:text-amber-600 active:scale-95",
                    student.decision === "excused" &&
                      "bg-amber-500 text-white shadow-xs hover:bg-amber-600 hover:text-white"
                  )}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t("excused")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision(student.id, "absent")}
                  disabled={locked}
                  className={cn(
                    "flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-extrabold transition-all text-muted-foreground hover:text-destructive active:scale-95",
                    student.decision === "absent" &&
                      "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:text-white"
                  )}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{t("absent")}</span>
                </button>
              </div>

              {/* Score & Notes Inputs */}
              <div className="flex items-center gap-2 pt-0.5">
                {hasPoints && (
                  <div className="w-20 shrink-0">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={student.score}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      placeholder={t("scoreLabel") || "الدرجة"}
                      disabled={locked}
                      className="w-full text-center font-black text-xs border border-border/70 rounded-xl py-2 px-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-background text-foreground disabled:opacity-60 shadow-xs"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={student.notes}
                    onChange={(e) => handleNotesChange(student.id, e.target.value)}
                    placeholder={t("notesOptional")}
                    disabled={locked}
                    className="w-full border border-border/70 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-background text-foreground disabled:opacity-60 shadow-xs"
                  />
                </div>
              </div>

              {/* Card Footer: Secret Note & Details Button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentForNote(student);
                    setNoteContent(student.secret_note || "");
                    setShowNoteDialog(true);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all",
                    student.secret_note
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted bg-muted/40"
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{student.secret_note ? (t("secretNote") || "ملاحظة مسجلة") : (t("addSecretNote") || "ملاحظة سرية")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStudentDetails(student)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all shadow-xs active:scale-95 ms-auto"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{t("attendanceHistory") || "السجل السابق والتفاصيل"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Toolbar: Summary & Save */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 border-t border-border bg-muted/10">
        <div className="text-xs sm:text-sm text-muted-foreground font-semibold">
          {t("attendanceSummary", { present: presentCount, absent: filteredRoster.length - presentCount })}
        </div>

        {locked ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-5 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition-all animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t("attendanceLocked") || "تم الاعتماد - لا يمكن التعديل"}</span>
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-black px-8 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>{t("saving") || "جاري الحفظ..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                <span>{t("confirmAttendance") || "حفظ واعتماد السجل"}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
