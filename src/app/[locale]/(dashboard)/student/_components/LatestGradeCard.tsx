"use client";

import { Trophy, ArrowLeft, ArrowRight, Award, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LatestGradeCardProps {
  lastGrade: any;
  locale: string;
}

export function LatestGradeCard({ lastGrade, locale }: LatestGradeCardProps) {
  const t = useTranslations();

  // The score returned by the backend is already a percentage from 100%
  const percentage = lastGrade ? parseFloat(lastGrade.score) : 0;
  const isFailed = lastGrade ? percentage < 50 : false;

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col text-center h-full relative overflow-hidden">
      
      {/* Premium glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent/20 to-accent/5 text-accent border border-accent/15 flex items-center justify-center text-2xl mb-4 mx-auto group-hover:rotate-12 group-hover:scale-115 transition-all duration-500 shadow-[0_8px_20px_rgba(237,138,34,0.05)]">
        <Trophy className="h-6 w-6" />
      </div>

      {/* Titles */}
      <h3 className="font-extrabold text-lg text-foreground mb-1 tracking-tight">{t("student.latestGrade")}</h3>
      {lastGrade && (
        <p className="text-muted-foreground text-xs font-semibold mb-4 truncate px-2 bg-muted/40 py-1 rounded-lg self-center max-w-[90%] border border-border/20">
          {lastGrade?.exam?.title}
        </p>
      )}
      
      {/* Grade Gauge Body */}
      {lastGrade ? (
        <div className="flex flex-col items-center justify-center my-auto py-2">
          <div className={cn(
            "relative w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-sm transition-all duration-500 group-hover:scale-105",
            isFailed
              ? "border-destructive/20 bg-destructive/5 dark:bg-destructive/10"
              : "border-accent/20 bg-accent/5 dark:bg-accent/10"
          )}>
            {/* Elegant glowing background layer inside gauge */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-md opacity-20 mix-blend-screen pointer-events-none",
              isFailed ? "bg-destructive" : "bg-accent"
            )} />

            {/* Score */}
            <span className={cn(
              "text-4xl font-black font-sans tracking-tight relative z-10 leading-none",
              isFailed ? "text-destructive font-bold" : "text-accent"
            )}>
              {percentage.toFixed(0)}%
            </span>
          </div>

          {/* Pass/Fail Status Pill */}
          <div className="mt-4">
            {isFailed ? (
              <span className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 animate-pulse shadow-[0_2px_10px_rgba(239,68,68,0.05)]">
                <AlertCircle className="w-3.5 h-3.5" />
                {t("student.fail") || "راسب"}
              </span>
            ) : (
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 shadow-[0_2px_10px_rgba(16,185,129,0.05)]">
                <Award className="w-3.5 h-3.5" />
                {percentage >= 90 ? t("student.excellentHigh") : t("student.passed") || "ناجح"}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between my-3 min-h-[160px]">
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 flex-grow transition-all duration-300 hover:bg-muted/30">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-accent/20 to-accent/5 text-accent flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(237,138,34,0.05)] border border-accent/10 group-hover:scale-105 transition-transform duration-300">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-xs font-extrabold text-foreground leading-relaxed">
              {t("student.noGradesRecorded")}
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
              {t("student.noGradesRecordedDesc")}
            </p>
          </div>
        </div>
      )}

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
    </div>
  );
}
