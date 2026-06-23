import React from "react";
import { Check, Save, ChevronDown } from "lucide-react";

interface GradeRecord {
  id: string;
  name: string;
  score: string;
  notes: string;
}

interface GradeEntryFormProps {
  maxScore: number;
  grades: GradeRecord[];
  handleScoreChange: (id: string, value: string) => void;
  handleNotesChange: (id: string, value: string) => void;
  handleSave: () => void;
  saved: boolean;
  saving: boolean;
  getGradeLabel: (score: string, max: number, t: (key: string) => string) => { label: string; color: string };
  t: (key: string) => string;
}

export function GradeEntryForm({
  maxScore,
  grades,
  handleScoreChange,
  handleNotesChange,
  handleSave,
  saved,
  saving,
  getGradeLabel,
  t,
}: GradeEntryFormProps) {
  return (
    <>

      {/* ── Grade Table ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 text-start">{t("studentName")}</th>
                <th className="px-6 py-4 text-center w-40">الدرجة / {maxScore}</th>
                <th className="px-6 py-4 text-center w-40">{t("autoGrade")}</th>
                <th className="px-6 py-4 text-start">{t("notesOptional")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {grades.map((student, idx) => {
                const { label, color } = getGradeLabel(student.score, maxScore, t);
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/20 transition-colors group"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* Name */}
                    <td className="px-6 py-3">
                      <div className="font-bold text-foreground">{student.name}</div>
                    </td>

                    {/* Score Input */}
                    <td className="px-6 py-3 text-center">
                      <input
                        id={`grade-input-${student.id}`}
                        type="text"
                        inputMode="decimal"
                        value={student.score}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        placeholder="--"
                        className="w-24 text-center font-black text-lg border-2 border-border/50 rounded-xl py-1.5 px-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-background mx-auto text-foreground"
                      />
                    </td>

                    {/* Auto Grade */}
                    <td className="px-6 py-3 text-center">
                      <span className={`text-sm font-black ${color}`}>{label}</span>
                    </td>

                    {/* Notes */}
                    <td className="px-6 py-3">
                      <input
                        id={`grade-notes-${student.id}`}
                        type="text"
                        value={student.notes}
                        onChange={(e) => handleNotesChange(student.id, e.target.value)}
                        placeholder={t("notesOptional")}
                        className="w-full border border-border/50 rounded-xl py-1.5 px-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all bg-background text-muted-foreground"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Save */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-border bg-muted/10">
          <p className="text-sm text-muted-foreground">
            يمكنكِ الحفظ المؤقت والعودة لإكمال الرصد لاحقاً
          </p>
          {saved ? (
            <div className="flex items-center gap-2 bg-success-50 text-success-700 px-6 py-3 rounded-2xl border border-success-500/20 font-bold">
              <Check className="w-5 h-5" />
              {t("gradesSaved")}
            </div>
          ) : (
            <button
              id="save-grades-btn"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? "جاري الحفظ..." : t("saveGrades")}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
