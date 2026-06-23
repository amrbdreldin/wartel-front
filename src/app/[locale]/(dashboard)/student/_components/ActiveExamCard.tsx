"use client";

import { ClipboardCheck, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActiveExamCardProps {
  nextExam: any;
  locale: string;
}

export function ActiveExamCard({ nextExam, locale }: ActiveExamCardProps) {
  const t = useTranslations();

  const exams = Array.isArray(nextExam) ? nextExam : nextExam ? [nextExam] : [];

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">

      {/* Premium glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/10 transition-colors duration-500" />

      {/* Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 text-primary border border-primary/15 flex items-center justify-center text-2xl mb-4 group-hover:rotate-12 group-hover:scale-115 transition-all duration-500 shadow-[0_8px_20px_rgba(0,143,143,0.05)]">
        <ClipboardCheck className="h-6 w-6" />
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-lg text-foreground mb-1 tracking-tight">{t("student.activeExam")}</h3>

      {/* Exam Details Layout or Empty State */}
      {exams.length > 0 ? (
        <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-3 max-h-[220px] custom-scrollbar">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              href={`/${locale}/student/exams/${exam.id}`}
              className="bg-muted/40 border border-border/20 rounded-2xl p-4 space-y-3 block hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group/item"
            >
              <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2 group-hover/item:text-primary transition-colors duration-200">
                {exam.title}
              </h4>
              
              {/* Date From & Date To */}
              <div className="space-y-2 pt-2 border-t border-border/10">
                {(exam.date_from || exam.from_date_time) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-bold text-[10px] text-muted-foreground whitespace-nowrap">{t("student.fromDate")}:</span>
                    <span className="truncate text-foreground/80 font-sans" title={exam.date_from || exam.from_date_time}>
                      {new Date(exam.date_from || exam.from_date_time).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
                        dateStyle: "short",
                        timeStyle: "short"
                      })}
                    </span>
                  </div>
                )}
                {(exam.date_to || exam.to_date_time) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-bold text-[10px] text-muted-foreground whitespace-nowrap">{t("student.toDate")}:</span>
                    <span className="truncate text-foreground/80 font-sans" title={exam.date_to || exam.to_date_time}>
                      {new Date(exam.date_to || exam.to_date_time).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
                        dateStyle: "short",
                        timeStyle: "short"
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <div className="flex-grow flex flex-col justify-between my-3 min-h-[160px]">
            <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 flex-grow transition-all duration-300 hover:bg-muted/30">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(0,143,143,0.05)] border border-primary/10 group-hover:scale-105 transition-transform duration-300">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-extrabold text-foreground leading-relaxed">
                {t("student.noExamsYet")}
              </p>
              <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
                {t("student.noExamsYetDesc")}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border/30">
            <Link
              href={`/${locale}/student/grades`}
              className="text-xs font-extrabold text-[#007070] dark:text-[#00b3b3] hover:text-primary-dark inline-flex items-center justify-center gap-2 group/link border border-primary/20 hover:border-primary/40 px-4 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 w-full transition-all duration-300 shadow-sm"
            >
              <span>{t("student.fullRecord")}</span>
              {locale === "ar" ? (
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-x-1" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
              )}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
