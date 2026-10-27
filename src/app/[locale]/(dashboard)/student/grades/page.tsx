"use client";

import { Trophy, Loader2, Sprout } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useQueries, useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { scoreToPercent } from "@/utils/format";
import { ScoreBanner } from "./_components/ScoreBanner";
import { ExamList } from "./_components/ExamList";

// ============================================================
// Student Grades & Evaluations Page
// ============================================================

export default function GradesPage() {
  const t = useTranslations();

  const { data, isLoading: isGradesLoading, isError, error } = useQuery({
    queryKey: ["student-exam-grades"],
    queryFn: () => studentService.getExamGrades(),
  });

  const examResults = data?.data?.exam_results || [];

  // /exam-grades returns the raw score (e.g. 6) without the exam's total marks, so pull
  // total_marks from each exam's result (same query key as the result page → shared cache)
  const examIds = [...new Set(examResults.map((r) => r.exam?.id).filter(Boolean))];
  const resultQueries = useQueries({
    queries: examIds.map((examId) => ({
      queryKey: ["student-exam-result", String(examId)],
      queryFn: () => studentService.getExamResult(String(examId)),
    })),
  });
  const isTotalsLoading = resultQueries.some((q) => q.isLoading);
  const totalMarksByExam: Record<string, string> = {};
  examIds.forEach((examId, i) => {
    const total = resultQueries[i]?.data?.data?.total_marks;
    if (total) totalMarksByExam[String(examId)] = total;
  });

  const isLoading = isGradesLoading || isTotalsLoading;

  if (isLoading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>

        {/* ScoreBanner Skeleton */}
        <div className="bg-card border border-border/50 rounded-3xl p-8 mb-12 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-grow space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="md:border-s border-border/50 md:ps-10 flex flex-col items-center shrink-0 space-y-3">
              <Skeleton className="h-16 w-24" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>
        </div>

        {/* ExamList Skeleton */}
        <div className="space-y-6 pb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-5">
                  <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
                <Skeleton className="w-24 h-10 rounded-full" />
              </div>
              <div className="bg-muted/30 rounded-2xl p-5 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const err = error as { response?: { data?: { message?: string } } };
    const apiErrorMsg = err.response?.data?.message || (error as Error)?.message;
    return (
      <div className="text-center py-12 text-destructive">
        {apiErrorMsg || t("common.errorOccurred")}
      </div>
    );
  }

  const percentages = examResults.map((r) =>
    scoreToPercent(r.score, totalMarksByExam[String(r.exam?.id)] ?? r.exam?.total_marks)
  );
  const averageScore = percentages.length
    ? Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length)
    : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
          <Trophy className="h-7 w-7 text-accent" />
          {t("student.gradesAndEvaluationsRecord")}
        </h3>
      </div>

      {examResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-border/80 rounded-3xl bg-muted/20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent/20 to-accent/5 text-accent border border-accent/15 flex items-center justify-center mb-5">
            <Sprout className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-extrabold text-foreground mb-2">{t("student.noExamsTakenYet")}</h4>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            {t("student.noExamsTakenYetDesc")}
          </p>
        </div>
      ) : (
        <div className="pb-16">
          <ScoreBanner averageScore={averageScore} />
          <ExamList examResults={examResults} totalMarksByExam={totalMarksByExam} />
        </div>
      )}
    </div>
  );
}
