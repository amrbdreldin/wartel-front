"use client";

import { GraduationCap, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GradeEntryForm } from "./_components/GradeEntryForm";
import { useTeacherGroups, useTeacherGroupStudents } from "@/hooks/api/useTeacherQueries";
import { teacherService } from "@/services/teacher.service";
import type { SubmitGradesPayload } from "@/types/teacher.types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface GradeRecord {
  id: string;
  name: string;
  score: string;
  notes: string;
}

const MAX_SCORE = 100;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGradeLabel(
  score: string,
  max: number,
  t: (key: string) => string
): { label: string; color: string } {
  if (!score || score.trim() === "") return { label: t("gradeAbsent") || "غائب 🔴", color: "text-destructive" };
  const pct = (parseFloat(score) / max) * 100;
  if (pct >= 90) return { label: t("gradeExcellent") || "ممتاز 🟢", color: "text-success-600" };
  if (pct >= 75) return { label: t("gradeVeryGood") || "جيد جداً 🟡", color: "text-warning-600" };
  if (pct >= 65) return { label: t("gradeGood") || "جيد 🟠", color: "text-amber-600" };
  if (pct >= 50) return { label: t("gradePass") || "مقبول 🔵", color: "text-info-600" };
  return { label: t("gradeFail") || "ضعيف 🔴", color: "text-destructive" };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TeacherGradesPage() {
  const t = useTranslations("teacherBoard");
  const queryClient = useQueryClient();

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [examName, setExamName] = useState<string>("");
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [saved, setSaved] = useState(false);

  // 1. Fetch Teacher's Assigned Groups
  const { data: groups, isLoading: isLoadingGroups, error: errorGroups } = useTeacherGroups();

  // 2. Fetch Students for the selected Group
  const { data: groupDetail, isLoading: isLoadingStudents, error: errorStudents } =
    useTeacherGroupStudents(selectedGroupId);

  const students = groupDetail?.students || [];

  // Synchronize dynamic student list with local grades input state
  useEffect(() => {
    if (students && students.length > 0) {
      setGrades(
        students.map((student) => ({
          id: student.id.toString(),
          name: student.name,
          score: "",
          notes: "",
        }))
      );
    } else {
      setGrades([]);
    }
    setSaved(false);
  }, [students]);

  const handleScoreChange = (id: string, value: string) => {
    if (value !== "" && (!/^\d*\.?\d*$/.test(value) || parseFloat(value) > MAX_SCORE)) return;
    setGrades((prev) => prev.map((s) => (s.id === id ? { ...s, score: value } : s)));
    setSaved(false);
  };

  const handleNotesChange = (id: string, value: string) => {
    setGrades((prev) => prev.map((s) => (s.id === id ? { ...s, notes: value } : s)));
    setSaved(false);
  };

  // 3. Submit Grades Mutation
  const submitGradesMutation = useMutation({
    mutationFn: (payload: SubmitGradesPayload) =>
      teacherService.submitGrades(payload).then((r) => r.data),
    onSuccess: () => {
      setSaved(true);
      toast.success(t("gradesSaved") || "تم حفظ الدرجات بنجاح ✓");
      queryClient.invalidateQueries({ queryKey: ["teacher", "groupStudents", selectedGroupId] });
    },
    onError: (err: any) => {
      toast.error(err?.message || t("gradesSavedError") || "حدث خطأ أثناء حفظ الدرجات");
    },
  });

  const handleSave = () => {
    if (!selectedGroupId) {
      toast.error(t("selectGroupError") || "يرجى اختيار مجموعة أولاً");
      return;
    }
    if (!examName.trim()) {
      toast.error(t("selectExamError") || "يرجى إدخال اسم الاختبار");
      return;
    }

    // Map entries to SubmitGradesPayload format
    const entries = grades
      .filter((s) => s.score !== undefined && s.score !== null && s.score.trim() !== "")
      .map((s) => ({
        student_id: s.id,
        score: parseFloat(s.score),
      }));

    if (entries.length === 0) {
      toast.error(t("minOneGradeError") || "يرجى رصد درجة واحدة على الأقل لطالب/ــة واحد/ة قبل الحفظ");
      return;
    }

    submitGradesMutation.mutate({
      group_id: selectedGroupId,
      exam_name: examName.trim(),
      entries,
    });
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8 max-w-5xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">{t("gradeEntry")}</h1>
          <p className="text-sm text-muted-foreground">{t("gradeEntryDesc")}</p>
        </div>
      </div>

      {/* ── Selection Panel ──────────────────────────────────────────────── */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>{t("gradingOptions") || "خيارات رصد الدرجات"}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Group Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground/80">
              {t("selectGroup")} <span className="text-destructive">*</span>
            </label>
            {isLoadingGroups ? (
              <div className="h-[46px] w-full bg-muted animate-pulse rounded-xl border border-border/50" />
            ) : errorGroups ? (
              <div className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>{t("loadGroupsError") || "فشل تحميل المجموعات"}</span>
              </div>
            ) : (
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  setSaved(false);
                }}
                className="w-full bg-muted/50 border border-border/50 text-foreground text-sm rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-3 transition-colors cursor-pointer"
              >
                <option value="">{t("selectGroup")}...</option>
                {groups?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({t("students_count", { count: group.student_count })})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Exam Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground/80">
              {t("selectExam")} <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => {
                setExamName(e.target.value);
                setSaved(false);
              }}
              placeholder={t("selectExam") + "..."}
              disabled={!selectedGroupId}
              className="w-full bg-muted/50 border border-border/50 text-foreground text-sm rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* ── Grades Entry Form Section ────────────────────────────────────── */}
      {!selectedGroupId ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-3xl text-center bg-card/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-base">{t("selectGroupFirst") || "الرجاء تحديد حلقة أولاً"}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("selectGroupFirstDesc") || "اختر إحدى المجموعات المسندة إليك من القائمة أعلاه لبدء رصد درجات الطلاب المسجلين فيها."}
            </p>
          </div>
        </div>
      ) : isLoadingStudents ? (
        <div className="bg-card border border-border rounded-3xl p-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>{t("loadingStudents") || "جاري تحميل قائمة الطلاب..."}</span>
          </div>
          <div className="space-y-2 animate-pulse">
            <div className="h-10 bg-muted rounded-xl w-full" />
            <div className="h-12 bg-muted rounded-xl w-full" />
            <div className="h-12 bg-muted rounded-xl w-full" />
          </div>
        </div>
      ) : errorStudents ? (
        <div className="flex flex-col items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-3xl text-center space-y-2 max-w-xl mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive animate-bounce" />
          <h4 className="font-bold text-foreground">{t("loadStudentsError") || "فشل تحميل الطلاب"}</h4>
          <p className="text-sm text-muted-foreground">
            {t("loadStudentsErrorDesc") || "حدث خطأ أثناء محاولة جلب طلاب الحلقة. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة."}
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-3xl text-center bg-card space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border">
            <GraduationCap className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-base">{t("noStudents") || "لا يوجد طلاب"}</h3>
            <p className="text-sm text-muted-foreground">
              {t("noStudentsDesc") || "هذه الحلقة لا تحتوي على أي طلاب مسجلين في الوقت الحالي."}
            </p>
          </div>
        </div>
      ) : (
        <GradeEntryForm
          maxScore={MAX_SCORE}
          grades={grades}
          handleScoreChange={handleScoreChange}
          handleNotesChange={handleNotesChange}
          handleSave={handleSave}
          saved={saved}
          saving={submitGradesMutation.isPending}
          getGradeLabel={getGradeLabel}
          t={t}
        />
      )}
    </div>
  );
}
