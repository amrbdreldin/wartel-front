import React from "react";
import { BookOpen, Users, Video, Clock } from "lucide-react";

interface TeacherHeroProps {
  todaySessionsCount: number;
  welcomeTitle: string;
  welcomeSubtitle: string;
  locale: string;
  totalGroups: number;
  totalStudents: number;
  t: (key: string, values?: any) => string;
}

export function TeacherHero({
  todaySessionsCount,
  welcomeTitle,
  welcomeSubtitle,
  locale,
  totalGroups,
  totalStudents,
  t,
}: TeacherHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      {/* Background */}
      <div className="absolute inset-0 bg-[#064e3b]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[150%] bg-primary/25 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-5%] w-[40%] h-[120%] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-8">
          {/* Left: Welcome */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-start gap-2 sm:gap-4 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest">
                {t("todayHalaqas")}: {todaySessionsCount}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              {welcomeTitle}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm md:text-base font-medium">{welcomeSubtitle}</p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-1">
              <span className="bg-white/10 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>

          {/* Right: Quick Stats */}
          <div className="grid grid-cols-3 lg:flex gap-2 sm:gap-4 w-full lg:w-auto justify-center">
            {[
              {
                label: t("totalGroups"),
                value: totalGroups,
                unit: t("groups"),
                icon: BookOpen,
                color: "from-emerald-500/30 to-emerald-400/10",
              },
              {
                label: t("totalStudents"),
                value: totalStudents,
                unit: t("students"),
                icon: Users,
                color: "from-teal-500/30 to-teal-400/10",
              },
              {
                label: t("todaySessions"),
                value: todaySessionsCount,
                unit: t("sessions"),
                icon: Video,
                color: "from-amber-500/30 to-amber-400/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`relative bg-gradient-to-br ${stat.color} backdrop-blur-md border border-white/15 rounded-2xl md:rounded-3xl p-3 sm:p-5 md:p-6 w-full lg:min-w-[120px] text-center flex flex-col items-center gap-1 sm:gap-2 hover:-translate-y-1 transition-transform duration-300`}
              >
                <stat.icon className="w-4 h-4 sm:w-5 h-5 md:w-6 h-6 text-white/90" />
                <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-white/90 uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
