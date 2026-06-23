"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Scroll,
  Award,
  Users,
  Sprout,
  Volume2,
  HeartHandshake,
  Gift,
  BookMarked
} from "lucide-react";

export function AchievementsSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const t = useTranslations("landing.achievements");

  const achievements = [
    {
      key: "cohorts",
      icon: GraduationCap,
      color: "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40",
    },
    {
      key: "tajweed",
      icon: BookOpen,
      color: "bg-teal-100/70 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/40",
    },
    {
      key: "norania",
      icon: Sparkles,
      color: "bg-amber-100/70 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40",
    },
    {
      key: "grammar",
      icon: BookMarked,
      color: "bg-blue-100/70 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40",
    },
    {
      key: "ijazatQuran",
      icon: Award,
      color: "bg-yellow-100/70 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 border-yellow-200/60 dark:border-yellow-800/40",
    },
    {
      key: "ijazatMutun",
      icon: Scroll,
      color: "bg-indigo-100/70 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40",
    },
    {
      key: "teachers",
      icon: Users,
      color: "bg-violet-100/70 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200/60 dark:border-violet-800/40",
    },
    {
      key: "tadabbur",
      icon: Sprout,
      color: "bg-rose-100/70 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40",
    },
    {
      key: "maqraah",
      icon: Volume2,
      color: "bg-cyan-100/70 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/40",
    },
    {
      key: "impact",
      icon: HeartHandshake,
      color: "bg-sky-100/70 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/40",
    },
  ];

  return (
    <section id="achievements" className="py-24 bg-background relative overflow-hidden">
      {/* Dynamic colorful blur blobs to enhance the glassmorphism layout */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Arabesque Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} 
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-primary dark:text-emerald-400 font-bold tracking-wider mb-4 text-sm uppercase inline-block bg-primary/10 dark:bg-emerald-950/40 px-4 py-1.5 rounded-full border border-primary/20 dark:border-emerald-800/30">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 font-heading leading-tight">
            {t("title")}
          </h2>
          <div className="w-28 h-1.5 gradient-primary mx-auto rounded-full mb-8" />
          <p className="text-slate-800 dark:text-slate-200 text-lg md:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
            {t("description")}
          </p>
        </div>

        {/* Glassmorphic Grid for Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.key}
                className="group backdrop-blur-md bg-white/45 dark:bg-slate-900/60 p-6 rounded-2xl border border-white/70 dark:border-slate-800/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-lg hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Gold/Teal Gradient Top Highlight Indicator */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                {/* Premium Glass Icon Container */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-300 mb-5 group-hover:scale-110 ${ach.color}`}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                
                {/* Title (High Contrast & Increased Font Size) */}
                <h3 className="text-lg md:text-xl font-extrabold text-slate-950 dark:text-white mb-3 font-heading group-hover:text-primary transition-colors duration-200">
                  {t(`${ach.key}Title`)}
                </h3>
                
                {/* Description (High Contrast & Increased Font Size) */}
                <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold leading-relaxed">
                  {t(`${ach.key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Featured Glassmorphic Banner Card (Completely Free) */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="relative group overflow-hidden rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl bg-gradient-to-br from-emerald-950/90 via-teal-900/90 to-emerald-950/95 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-emerald-900/40 border-2 border-secondary/50 shadow-2xl shadow-primary/20 text-center">
            
            {/* Background texture inside highlight banner */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} 
            />
            
            <div className="absolute top-0 right-0 w-82 h-82 bg-white/5 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-82 h-82 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
              {/* Glass Icon Wrapper with Golden Glow */}
              <div className="w-20 h-20 bg-white/10 text-secondary-light flex items-center justify-center rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] mb-6 group-hover:scale-115 transition-transform duration-300 group-hover:rotate-6">
                <Gift className="h-10 w-10 text-secondary" aria-hidden="true" />
              </div>
              
              {/* High Contrast Gold Title */}
              <h3 className="text-3xl md:text-5xl font-black mb-4 font-heading text-secondary drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                {t("freeTitle")}
              </h3>
              
              {/* High Contrast White Description with Increased Font Size */}
              <p className="text-white text-xl md:text-2xl font-extrabold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {t("freeDesc")}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
