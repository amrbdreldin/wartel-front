"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, ArrowLeft, ArrowRight, Award, Check, CheckCircle2, 
  ChevronLeft, ClipboardCheck, CornerDownLeft, HelpCircle, 
  Info, MessageSquareQuote, RotateCcw, Trophy, Volume2, X, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums";

// Helper to resolve media URLs
const resolveMediaUrl = (url: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `https://wartel.amrbdr.com/storage/${url}`;
};

export default function ExamResultPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const locale = params.locale as string;
  const examId = params.examId as string;

  let dashboardHref = `/${locale}/student`;
  if (user) {
    if (user.role === UserRole.PARENT) {
      dashboardHref = `/${locale}/parent`;
    } else if (user.role === UserRole.TEACHER) {
      dashboardHref = `/${locale}/teacher`;
    }
  }

  const { data: resultResponse, isLoading, isError, error } = useQuery({
    queryKey: ["student-exam-result", examId],
    queryFn: () => studentService.getExamResult(examId),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto p-4">
        {/* Header Skeleton */}
        <div className="pb-6 border-b border-border/50">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
        
        {/* Banner Skeleton */}
        <Skeleton className="h-40 w-full rounded-3xl" />
        
        {/* Questions Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !resultResponse?.success || !resultResponse.data) {
    const err = error as { response?: { data?: { message?: string } } };
    const apiErrorMsg = err.response?.data?.message || (error as Error)?.message;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-md mx-auto">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground mb-6">
          {resultResponse?.message || apiErrorMsg || t("student.examNotFound") || "لم يتم العثور على النتيجة أو لم تقم بأداء هذا الاختبار."}
        </p>
        <button 
          onClick={() => router.push(`/${locale}/student`)}
          className="px-6 py-3 rounded-xl bg-primary text-white font-bold transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
        >
          {t("student.backToDashboard") || "العودة للوحة التحكم"}
        </button>
      </div>
    );
  }

  const result = resultResponse.data;
  const questions = result.questions || [];
  const scorePercent = parseFloat(result.total_score) || 0;
  const isFailed = scorePercent < 50;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 pb-20">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent animate-bounce" />
            {t("student.examResult") || "نتيجة الاختبار"}
          </h2>
          <p className="text-sm text-muted-foreground font-semibold">
            {t("student.examResultTitle", { title: result.exam_title }) || `تفاصيل نتيجة اختبار: ${result.exam_title}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/student/grades`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 hover:bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
          >
            {locale === "ar" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t("student.backToGrades") || "سجل الدرجات"}</span>
          </Link>
          <Link
            href={dashboardHref}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/95 hover:shadow-md text-sm font-bold transition-all"
          >
            <span>{t("student.backToDashboard") || "الرئيسية"}</span>
          </Link>
        </div>
      </div>

      {/* Score Circular Gauge Banner */}
      <div className={cn(
        "rounded-3xl p-6 md:p-8 border flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-sm",
        isFailed
          ? "bg-destructive/5 border-destructive/20 text-destructive-foreground"
          : "bg-emerald-500/5 border-emerald-500/20 text-foreground"
      )}>
        {/* Glow Accent */}
        <div className={cn(
          "absolute inset-0 blur-2xl opacity-20 pointer-events-none",
          isFailed ? "bg-destructive" : "bg-emerald-500"
        )} />

        <div className="space-y-3 text-center md:text-start relative z-10">
          <h3 className={cn(
            "text-xl md:text-2xl font-black",
            isFailed ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
          )}>
            {isFailed 
              ? (locale === "ar" ? "تحتاجين للمذاكرة والمحاولة مرة أخرى" : "Need to study and try again")
              : (locale === "ar" ? "مبارك اجتيازك الاختبار بنجاح!" : "Congratulations on passing the exam!")
            }
          </h3>
          <p className="text-sm text-muted-foreground font-semibold max-w-md leading-relaxed">
            {isFailed
              ? (locale === "ar" ? "درجتكِ أقل من نسبة النجاح المطلوبة (50%). يرجى مراجعة الملاحظات وتسميع الآيات بشكل صحيح." : "Your score is below the passing requirement (50%). Please review feedback and record the recitation accurately.")
              : (locale === "ar" ? "لقد أظهرتِ مستوى متميزاً في الحفظ والتجويد. استمري على هذا الأداء الرائع." : "You have demonstrated excellent stability in recitation and Tajweed rules. Keep up this great work.")
            }
          </p>
          <div className="pt-2">
            <span className={cn(
              "px-4 py-1.5 rounded-full text-xs font-black border inline-flex items-center gap-1.5 shadow-sm",
              isFailed
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            )}>
              {isFailed ? <XCircle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
              {scorePercent >= 90 ? t("student.excellentHigh") : scorePercent >= 50 ? t("student.passed") : t("student.fail")}
            </span>
          </div>
        </div>

        {/* Big Circular Score */}
        <div className="relative shrink-0 z-10 select-none">
          <div className={cn(
            "w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center bg-card shadow-md transition-transform hover:scale-105 duration-500",
            isFailed ? "border-destructive/20" : "border-emerald-500/20"
          )}>
            <span className={cn(
              "text-4xl font-black font-sans leading-none",
              isFailed ? "text-destructive" : "text-emerald-500"
            )}>
              {scorePercent.toFixed(0)}%
            </span>
            <span className="text-[10px] text-muted-foreground font-extrabold uppercase mt-1">
              {result.total_score} {t("student.outOf") || "من"} {parseFloat(result.total_marks).toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Questions & Options Review */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-foreground flex items-center gap-2 px-1">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          {locale === "ar" ? "مراجعة إجابات الأسئلة" : "Review Questions & Answers"}
        </h3>

        {questions.map((question: any, index: number) => {
          const isCorrect = question.is_correct;
          const markEarned = parseFloat(question.earned_mark) || 0;
          const markTotal = parseFloat(question.total_mark) || 0;
          
          return (
            <div 
              key={question.id} 
              className={cn(
                "bg-card rounded-3xl p-6 border shadow-[0_4px_20px_rgb(0,0,0,0.01)] relative overflow-hidden transition-all duration-300",
                isCorrect 
                  ? "border-emerald-500/20 hover:border-emerald-500/40" 
                  : "border-destructive/15 hover:border-destructive/30"
              )}
            >
              
              {/* Question Number & Mark Badge */}
              <div className="flex justify-between items-center gap-4 mb-4">
                <span className="text-xs font-black text-muted-foreground uppercase">
                  {locale === "ar" ? `سؤال ${index + 1}` : `Question ${index + 1}`}
                </span>
                
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-extrabold border",
                  isCorrect
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                )}>
                  {markEarned.toFixed(0)} / {markTotal.toFixed(0)} {locale === "ar" ? "درجة" : "mark"}
                </span>
              </div>

              {/* Question Text */}
              <h4 className="text-base font-extrabold text-foreground leading-relaxed mb-4">
                {question.question_text}
              </h4>

              {/* Question Image/Audio (if any) */}
              {question.media_url && (
                <div className="rounded-xl overflow-hidden border border-border/30 bg-muted/10 p-3 max-w-sm mb-4">
                  {question.media_url.endsWith(".mp3") || question.media_url.endsWith(".wav") ? (
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-extrabold uppercase flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-primary" />
                        {t("student.listeningPrompt") || "المقطع الصوتي:"}
                      </p>
                      <audio controls src={resolveMediaUrl(question.media_url) || ""} className="w-full h-8" />
                    </div>
                  ) : (
                    <div className="relative w-full h-40">
                      <Image 
                        fill
                        sizes="(max-width: 480px) 100vw, 384px"
                        src={resolveMediaUrl(question.media_url) || ""} 
                        alt="Question attachment" 
                        className="rounded-lg mx-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Answers Grid depending on question type */}
              <div className="space-y-3">
                
                {/* 1. TRUE & FALSE QUESTION REVIEW */}
                {question.options.length > 0 && question.correct_option_id !== null && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {question.options.map((option: any) => {
                      const isSelected = String(option.id) === String(question.student_selected_option_id);
                      const isCorrectAnswer = option.id === question.correct_option_id;

                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all",
                            isCorrectAnswer
                              ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                              : isSelected
                                ? "border-destructive/40 bg-destructive/5 text-destructive"
                                : "border-border/60 bg-muted/10 text-muted-foreground"
                          )}
                        >
                          <span className="font-extrabold">{option.option_text}</span>
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                                {t("student.yourAnswer") || "إجابتك"}
                              </span>
                            )}
                            {isCorrectAnswer ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-destructive shrink-0" />
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. TEXT QUESTION REVIEW */}
                {question.options.length === 0 && question.correct_option_id === null && !question.student_selected_option_id?.startsWith("http") && (
                  <div className="space-y-3 pt-2">
                    <div className="bg-muted/40 p-4 rounded-2xl border border-border/20">
                      <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase mb-1">
                        {t("student.yourAnswer") || "إجابتك التحريرية:"}
                      </p>
                      <p className="text-sm font-bold text-foreground leading-relaxed whitespace-pre-wrap">
                        {question.student_selected_option_id || (
                          <span className="text-muted-foreground italic font-medium">
                            ({t("student.notAnswered") || "لم تتم الإجابة"})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. SOUND RECORDING QUESTION REVIEW */}
                {question.options.length === 0 && question.correct_option_id === null && question.student_selected_option_id?.startsWith("http") && (
                  <div className="space-y-3 pt-2">
                    <div className="bg-muted/40 p-4 rounded-2xl border border-border/20 space-y-2">
                      <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">
                        {t("student.yourAnswer") || "تسميعك الصوتي المسجل:"}
                      </p>
                      <audio controls src={resolveMediaUrl(question.student_selected_option_id)} className="w-full" style={{ height: "36px" }} />
                    </div>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
