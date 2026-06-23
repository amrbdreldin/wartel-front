"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Calendar, MessageSquareQuote, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ExamResult } from "@/types/student.types";

export function ExamList({ examResults }: { examResults: ExamResult[] }) {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="mt-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
        {examResults.length > 0 ? (
          examResults.map((result) => {
            // The score returned by the backend is already a percentage from 100%
            const percentage = parseFloat(result.score as any) || 0;
            const isFailed = percentage < 50;
            const examId = result.exam?.id;

            return (
              <div key={result.exam_result_id} className="bg-card rounded-3xl p-6 md:p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-6 group relative overflow-hidden">
                
                {/* Overlay link to result page */}
                {examId && (
                  <Link 
                    href={`/${locale}/student/exams/${examId}/result`} 
                    className="absolute inset-0 z-10" 
                    aria-label={t("student.viewDetails") || "View Details"} 
                  />
                )}

                <div className="flex flex-wrap justify-between items-center gap-4 mb-6 relative z-0">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full border-4 flex items-center justify-center text-xl md:text-2xl font-black transition-colors",
                      isFailed
                        ? "border-destructive/20 bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white"
                        : "border-primary/20 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    )}>
                      {percentage.toFixed(0)}%
                    </div>
                    <div>
                      <h6 className="font-bold text-lg text-foreground mb-1">{result.exam?.title}</h6>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-4 flex-wrap">
                        {result.exam?.course?.name && (
                          <span className="flex items-center gap-1.5" title={t("student.subjectName")}>
                            <BookOpen className="w-4 h-4" /> {result.exam.course.name}
                          </span>
                        )}
                        {result.session?.group?.name && (
                          <span className="flex items-center gap-1.5" title={t("student.group")}>
                            <User className="w-4 h-4" /> {result.session.group.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5" title={t("common.date")}>
                          <Calendar className="w-4 h-4" /> {result.created_at ? new Date(result.created_at).toLocaleDateString() : "-"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-4 py-2 font-bold rounded-full text-sm border relative z-20",
                    isFailed
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}>
                     {percentage >= 90 ? t("student.excellentHigh") : percentage >= 50 ? t("student.passed") : t("student.fail")}
                  </span>
                </div>
                
                {result.comment && (
                  <div className="bg-muted/50 rounded-2xl p-5 border-s-4 border-primary rtl:border-s-4 rtl:border-r-0 ltr:border-l-4 ltr:border-r-0 relative z-20">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquareQuote className="w-4 h-4 text-primary shrink-0" />
                      <strong className="text-sm text-primary">{t("student.teacherComment")}</strong>
                    </div>
                    <p className="text-sm text-foreground/80 font-medium leading-relaxed mb-0">
                      {result.comment}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-3xl">
            {t("common.noData")}
          </div>
        )}
      </div>
    </div>
  );
}

