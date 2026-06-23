import React from "react";
import { Users, X, Lock } from "lucide-react";

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
  setSelectedStudentDetails: (student: StudentRecord | null) => void;
  maxScore: number;
  getGradeLabel: (score: string, max: number) => { label: string; color: string };
  t: (key: string, values?: any) => string;
}

export function StudentDetailsSidebar({
  student,
  setSelectedStudentDetails,
  maxScore,
  getGradeLabel,
  t,
}: StudentDetailsSidebarProps) {
  if (!student) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setSelectedStudentDetails(null)}
      />
      {/* Sidebar */}
      <div className="fixed top-0 bottom-0 left-0 w-full max-w-sm bg-background border-r border-border z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
        <div className="sticky top-0 bg-background/80 backdrop-blur-md p-6 border-b border-border flex items-center justify-between z-10">
          <h2 className="text-xl font-black flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-primary" />
            {t("studentDetails")}
          </h2>
          <button
            onClick={() => setSelectedStudentDetails(null)}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.group} | {student.subject}</p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
              <div className="text-xs font-bold text-muted-foreground mb-1">{t("attendanceStatus")}</div>
              <div className="font-black text-sm">
                {student.decision === 'present' ? <span className="text-success-600">{t("present")}</span> :
                 student.decision === 'excused' ? <span className="text-warning-600">{t("excused")}</span> :
                 <span className="text-destructive">{t("absent")}</span>}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
              <div className="text-xs font-bold text-muted-foreground mb-1">{t("scoreLabel")}</div>
              <div className="font-black text-sm text-foreground">
                {student.score ? `${student.score} / ${maxScore}` : "--"}
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground">{t("sessionActivity")}</h4>
            <div className="space-y-3 bg-card border border-border p-4 rounded-2xl">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t("entryTime")}</span>
                <span className="font-medium text-foreground">{student.loginTime || t("noEntry")}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t("autoEvaluation")}</span>
                <span className="font-medium">
                  {getGradeLabel(student.score, maxScore).label}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground">{t("achievementNotes")}</h4>
            <div className="bg-muted/50 border border-border p-4 rounded-2xl min-h-[100px] text-sm text-muted-foreground leading-relaxed">
              {student.notes || t("noAdditionalNotes")}
            </div>
          </div>

          {/* Secret Notes */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              {t("secretNote")}
            </h4>
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl min-h-[80px] text-sm text-muted-foreground leading-relaxed">
              {student.secret_note || t("noSecretNote")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
