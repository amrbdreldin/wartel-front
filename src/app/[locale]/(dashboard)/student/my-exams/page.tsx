"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ClipboardList,
  PlusCircle,
  Play,
  Eye,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { studentService } from "@/services/student.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";

export default function PersonalExamsPage() {
  const t = useTranslations("personalExams");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [courseId, setCourseId] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [customTitle, setCustomTitle] = useState<string>("");

  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ["personal-exam-courses"],
    queryFn: () => studentService.getPersonalExamCourses(),
  });

  const { data: exams = [], isLoading: loadingExams } = useQuery({
    queryKey: ["personal-exams"],
    queryFn: () => studentService.getPersonalExams(),
  });

  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.id) === courseId) || null,
    [courses, courseId]
  );

  const maxAllowed = selectedCourse ? Math.min(20, selectedCourse.questions_count) : 20;

  const createMutation = useMutation({
    mutationFn: () =>
      studentService.createPersonalExam({
        course_id: Number(courseId),
        question_count: Math.min(20, Math.max(1, questionCount)),
        title: customTitle.trim() || undefined,
      }),
    onSuccess: (created) => {
      router.push(`/${locale}/student/exams/${created.exam_id}`);
    },
    onError: (err: unknown) => {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || tCommon("errorOccurred"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    if (questionCount > 20) {
      toast.error(t("maxQuestionsError"));
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t("title")}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">{t("title")}</h1>
        <p className="text-sm md:text-base text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Create Personal Exam Card */}
      <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{t("createCardTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("createCardDesc")}</p>
          </div>
        </div>

        {loadingCourses ? (
          <div className="h-32 rounded-xl bg-muted/50 animate-pulse" />
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            {t("noCoursesAvailable")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Course select */}
            <div className="md:col-span-5 space-y-2">
              <Label htmlFor="course_id">{t("courseLabel")}</Label>
              <select
                id="course_id"
                required
                value={courseId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setCourseId(nextId);
                  const nextCourse = courses.find((c) => String(c.id) === nextId);
                  if (nextCourse) {
                    const nextMax = Math.min(20, nextCourse.questions_count);
                    if (questionCount > nextMax) setQuestionCount(nextMax);
                  }
                }}
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">{t("coursePlaceholder")}</option>
                {courses.map((course) => (
                  <option key={course.id} value={String(course.id)}>
                    {course.name} {course.track_name ? `(${course.track_name})` : ""} — {course.questions_count}
                  </option>
                ))}
              </select>
              {selectedCourse && (
                <p className="text-xs text-muted-foreground">
                  {t("availableQuestionsHint", { count: selectedCourse.questions_count })}
                </p>
              )}
            </div>

            {/* Question count (max 20) */}
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="question_count">{t("questionsCountLabel")}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="question_count"
                  type="number"
                  min={1}
                  max={maxAllowed}
                  required
                  value={questionCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (Number.isNaN(val)) {
                      setQuestionCount(1);
                    } else {
                      setQuestionCount(Math.min(maxAllowed, Math.max(1, val)));
                    }
                  }}
                  className="h-11 rounded-xl"
                />
                <div className="flex gap-1">
                  {[5, 10, 20].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={preset > maxAllowed}
                      onClick={() => setQuestionCount(preset)}
                      className={cn(
                        "px-2.5 h-11 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                        questionCount === preset
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-input hover:bg-muted"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional title */}
            <div className="md:col-span-4 space-y-2">
              <Label htmlFor="custom_title">{t("customTitleLabel")}</Label>
              <Input
                id="custom_title"
                type="text"
                maxLength={150}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={t("customTitlePlaceholder")}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="md:col-span-12 flex justify-end pt-2">
              <LoadingButton
                type="submit"
                isLoading={createMutation.isPending}
                disabled={!courseId}
                className="h-11 px-6 rounded-xl font-bold gap-2"
              >
                <Play className="h-4 w-4" />
                {t("startExamBtn")}
              </LoadingButton>
            </div>
          </form>
        )}
      </div>

      {/* Personal Exams History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <span>{t("historyTitle")}</span>
        </h2>

        {loadingExams ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl border border-border/50 bg-card animate-pulse" />
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-10 text-center space-y-2">
            <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <h3 className="font-bold text-foreground">{t("historyEmptyTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("historyEmptyDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exams.map((exam) => {
              const isCompleted = exam.status === "completed";
              return (
                <div
                  key={exam.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={isCompleted ? "default" : "secondary"}
                        className={cn(
                          "gap-1 font-bold",
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        {isCompleted ? t("statusCompleted") : t("statusPending")}
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {t("questionsCountBadge", { count: exam.questions_count })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground line-clamp-2">{exam.title}</h3>

                    {exam.course && (
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 text-primary/70" />
                        <span>{exam.course.name}</span>
                      </p>
                    )}

                    {isCompleted && exam.score !== null && (
                      <div className="rounded-xl bg-muted/50 px-3 py-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">{t("scoreLabel")}</span>
                        <span className="font-black text-primary">
                          {exam.score} / {exam.total_marks}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/40">
                    {isCompleted ? (
                      <Link
                        href={`/${locale}/student/exams/${exam.id}/result`}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{t("reviewResultBtn")}</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/${locale}/student/exams/${exam.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
                      >
                        <Play className="h-4 w-4" />
                        <span>{t("continueExamBtn")}</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
