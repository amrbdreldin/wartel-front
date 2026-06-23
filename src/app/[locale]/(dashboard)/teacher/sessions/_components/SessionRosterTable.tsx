import React from "react";
import {
  AlertTriangle,
  Users,
  CheckCircle2,
  HelpCircle,
  XCircle,
  MessageSquare,
  Eye,
  Pencil,
  Loader2,
  Save,
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
  setLocked: (val: boolean) => void;
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
  getGradeLabel: (score: string, max: number) => { label: string; color: string };
  t: (key: string, values?: any) => string;
}

export function SessionRosterTable({
  filteredRoster,
  detectedCount,
  presentCount,
  locked,
  setLocked,
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
  getGradeLabel,
  t,
}: SessionRosterTableProps) {
  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      {/* Alert banner */}
      <div className="flex items-start gap-3 bg-warning-50 border-b border-warning-100 px-6 py-4">
        <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
        <p className="text-sm text-warning-800 font-medium">
          {t("smartAttendanceAlert")}
        </p>
      </div>

      {/* Table toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {t("totalStudentsCount", { count: filteredRoster.length })}
          </span>
          <span className="text-success-600 font-bold">
            {t("joinedLinkCount", { count: detectedCount })}
          </span>
        </div>

        <button
          onClick={markAllPresent}
          disabled={locked}
          className="flex items-center gap-2 px-4 py-2 bg-success-500 hover:bg-success-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          {t("markAllPresent")}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-4 py-4 text-start">{t("studentName")}</th>
              <th className="px-2 py-4 text-center">{t("group")}</th>
              <th className="px-2 py-4 text-center">{t("subjectExam")}</th>
              <th className="px-2 py-4 text-center">{t("loginTime")}</th>
              <th className="px-2 py-4 text-center min-w-[280px]">{t("finalDecision")}</th>
              <th className="px-2 py-4 text-center min-w-[100px]">{t("scoreMax", { max: maxScore })}</th>
              <th className="px-2 py-4 text-center">{t("autoGrade")}</th>
              <th className="px-4 py-4 text-start min-w-[150px]">{t("additionalNotes")}</th>
              <th className="px-4 py-4 text-center">{t("action")}</th>
              <th className="px-4 py-4 text-center min-w-[80px]">{t("details")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredRoster.map((student, idx) => {
              const isDetected = student.loginTime !== null;
              const { label, color } = getGradeLabel(student.score, maxScore);
              return (
                <tr
                  key={student.id}
                  className={cn(
                    "transition-colors hover:bg-muted/20 group",
                    !isDetected && "opacity-80"
                  )}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {/* Name */}
                  <td className="px-4 py-4 align-middle">
                    <div className={cn("font-bold text-foreground", !isDetected && "text-muted-foreground")}>
                      {student.name}
                    </div>
                    {!isDetected && (
                      <span className="text-xs text-muted-foreground block mt-1">{t("notDetected")}</span>
                    )}
                  </td>

                  {/* Group */}
                  <td className="px-2 py-4 text-center align-middle text-sm font-medium text-muted-foreground">
                    {student.group}
                  </td>

                  {/* Subject */}
                  <td className="px-2 py-4 text-center align-middle text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {student.subject}
                  </td>

                  {/* Login Time */}
                  <td className="px-2 py-4 text-center align-middle">
                    {student.loginTime ? (
                      <span className="text-success-600 font-bold text-sm bg-success-50 px-2.5 py-1 rounded-lg border border-success-500/20 whitespace-nowrap">
                        {student.loginTime}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">--</span>
                    )}
                  </td>

                  {/* Decision */}
                  <td className="px-2 py-4 align-middle">
                    <div className="flex bg-muted/50 rounded-xl p-1 w-max mx-auto border border-border/50 shadow-inner">
                      <button
                        onClick={() => setDecision(student.id, "present")}
                        disabled={locked}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-success-600",
                          student.decision === "present" &&
                            "bg-success-500 text-white shadow-md hover:bg-success-600 hover:text-white"
                        )}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t("present")}
                      </button>
                      <button
                        onClick={() => setDecision(student.id, "excused")}
                        disabled={locked}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-warning-600",
                          student.decision === "excused" &&
                            "bg-warning-400 text-warning-900 shadow-md hover:bg-warning-500 hover:text-warning-900"
                        )}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {t("excused")}
                      </button>
                      <button
                        onClick={() => setDecision(student.id, "absent")}
                        disabled={locked}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-muted-foreground hover:text-destructive",
                          student.decision === "absent" &&
                            "bg-destructive text-white shadow-md hover:bg-destructive/90 hover:text-white"
                        )}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {t("absent")}
                      </button>
                    </div>
                  </td>

                  {/* Score Input */}
                  <td className="px-2 py-4 text-center align-middle">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={student.score}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      placeholder="--"
                      disabled={locked}
                      className="w-16 md:w-20 text-center font-black text-base border-2 border-border/50 rounded-xl py-1 px-2 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-background mx-auto text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </td>

                  {/* Auto Grade */}
                  <td className="px-2 py-4 text-center align-middle">
                    <span className={`text-sm font-black whitespace-nowrap ${color}`}>{label}</span>
                  </td>

                  {/* Grade Notes */}
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="text"
                      value={student.notes}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                      placeholder={t("notesOptional")}
                      disabled={locked}
                      className="w-full border border-border/50 rounded-xl py-1.5 px-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-background text-muted-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </td>

                  {/* Secret Notes Action */}
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudentForNote(student);
                        setNoteContent(student.secret_note || "");
                        setShowNoteDialog(true);
                      }}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-primary/10 rounded-lg mx-auto block"
                      title={locked ? (t("secretNote") || "ملاحظة سرية") : t("addSecretNote")}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Details Action */}
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      onClick={() => setSelectedStudentDetails(student)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-primary/10 rounded-lg mx-auto block"
                      title={t("viewDetails") || "عرض التفاصيل"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border bg-muted/10">
        <div className="text-sm text-muted-foreground font-medium">
          {t("attendanceSummary", { present: presentCount, absent: filteredRoster.length - presentCount })}
        </div>

        {locked ? (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-6 py-3 rounded-2xl font-black text-sm shadow-sm transition-all animate-in fade-in duration-300">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t("attendanceLocked") || "تم الاعتماد - لا يمكن التعديل"}</span>
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("saving") || "جاري الحفظ..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {t("confirmAttendance") || "حفظ واعتماد السجل"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
