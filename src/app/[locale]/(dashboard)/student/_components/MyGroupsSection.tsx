"use client";

import { BookOpen, Calendar, Clock, GraduationCap, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { StudentDashboardGroup } from "@/types/student.types";
import { cn } from "@/lib/utils";

interface MyGroupsSectionProps {
  groups: StudentDashboardGroup[];
}

export function MyGroupsSection({ groups }: MyGroupsSectionProps) {
  const t = useTranslations();

  return (
    <section className="space-y-4 sm:space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
              {t("student.subscribedGroups")}
            </h2>
          </div>
        </div>

        {groups.length > 0 && (
          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-extrabold border border-primary/20 shrink-0">
            {groups.length}
          </span>
        )}
      </div>

      {/* Groups Grid or Empty State */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {groups.map((group) => {
            const isMandatory = group.is_mandatory !== false;

            return (
              <div
                key={group.id}
                className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden"
              >
                {/* Top Accent Bar */}
                <div
                  className={cn(
                    "absolute top-0 inset-x-0 h-[4px]",
                    isMandatory
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-primary"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"
                  )}
                />

                {/* Subtle Glow */}
                <div
                  className={cn(
                    "absolute -end-16 -top-16 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-colors duration-500",
                    isMandatory
                      ? "bg-amber-500/5 group-hover:bg-amber-500/10"
                      : "bg-emerald-500/5 group-hover:bg-emerald-500/10"
                  )}
                />

                {/* Top Row: Icon + Mandatory/Optional Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 text-primary flex items-center justify-center border border-primary/15 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border shrink-0",
                      isMandatory
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                    )}
                  >
                    {isMandatory ? (
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{isMandatory ? t("student.mandatory") : t("student.optional")}</span>
                  </span>
                </div>

                {/* Group Name */}
                <h3 className="text-base sm:text-lg font-extrabold text-foreground mb-3 leading-snug break-words">
                  {group.name}
                </h3>

                {/* Details Box */}
                <div className="bg-muted/40 border border-border/30 rounded-2xl p-3.5 sm:p-4 space-y-3 mt-auto">
                  {/* Teacher */}
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-background/80 border border-border/40 flex items-center justify-center shrink-0 text-primary">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-muted-foreground font-semibold me-1.5">
                        {t("student.teacher")}:
                      </span>
                      <span className="font-bold text-foreground break-words">
                        {group.teacher_name || t("student.noTeacherAssigned")}
                      </span>
                    </div>
                  </div>

                  {/* Schedule / Session Days */}
                  <div className="pt-2.5 border-t border-border/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{t("student.sessionDays")}</span>
                    </div>

                    {group.session_days && group.session_days.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {group.session_days.map((dayItem, idx) => (
                          <span
                            key={`${group.id}-day-${idx}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-background/90 border border-border/50 text-xs font-bold text-foreground shadow-2xs"
                          >
                            <span>{dayItem.day}</span>
                            {dayItem.time && (
                              <>
                                <span className="text-muted-foreground/50">•</span>
                                <span className="inline-flex items-center gap-1 text-primary font-extrabold" dir="ltr">
                                  <Clock className="w-3 h-3 shrink-0" />
                                  {dayItem.time}
                                </span>
                              </>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("student.noScheduleSet")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card/60 border border-dashed border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-muted-foreground">
            {t("student.noGroupsAssigned")}
          </p>
        </div>
      )}
    </section>
  );
}
