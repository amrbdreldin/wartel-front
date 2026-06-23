"use client";

import { Trophy, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { ScoreBanner } from "./_components/ScoreBanner";
import { ExamList } from "./_components/ExamList";

// ============================================================
// Student Grades & Evaluations Page
// ============================================================

export default function GradesPage() {
  const t = useTranslations();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-exam-grades"],
    queryFn: () => studentService.getExamGrades(),
  });

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

  const gradesData = data?.data;
  const examResults = gradesData?.exam_results || [];
  const averageScore = gradesData?.average_score || 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
          <Trophy className="h-7 w-7 text-accent" />
          {t("student.gradesAndEvaluationsRecord")}
        </h3>
      </div>

      <div className="pb-16">
        <ScoreBanner averageScore={averageScore} />
        <ExamList examResults={examResults} />
      </div>
    </div>
  );
}
