"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function ScoreBanner({ averageScore }: { averageScore: number }) {
  const t = useTranslations();

  return (
    <div className="relative bg-gradient-to-br from-teal-600 to-teal-900 rounded-3xl p-8 mb-12 text-white overflow-hidden shadow-xl">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute rtl:-right-20 rtl:-top-20 ltr:-left-20 ltr:-top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl blend-overlay pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-grow text-center rtl:md:text-right ltr:md:text-left">
          <h5 className="text-2xl font-bold mb-2">{t("student.generalLevelForAcademicYear")}</h5>
          <p className="text-primary-foreground/80 text-sm mb-6 max-w-lg">
            {t("student.scoreCalculationDesc")}
          </p>
          
          <div className="w-full bg-white/20 rounded-full h-3 mb-2 overflow-hidden flex" dir="ltr">
            <div className="bg-white h-full" style={{ width: `${averageScore > 100 ? 100 : averageScore}%` }}></div>
          </div>
          <div className="text-sm font-bold text-primary-foreground/90">
            {t("student.completedAchievement", { percentage: averageScore })}
          </div>
        </div>
        
        <div className="md:border-s border-white/20 md:ps-10 text-center flex flex-col items-center justify-center shrink-0">
          <div className="text-6xl md:text-7xl font-black mb-3 text-white drop-shadow-md">{averageScore}%</div>
          <span className={cn(
            "bg-white px-5 py-2 font-black rounded-full shadow-lg text-sm flex items-center gap-2",
            averageScore < 50 ? "text-destructive" : "text-success-600"
          )}>
            {t("student.overallRating")} {averageScore >= 90 ? t("student.excellentHigh") : averageScore >= 50 ? t("student.passed") : t("student.fail")} 
          </span>
        </div>
      </div>
    </div>
  );
}
