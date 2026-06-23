import React from "react";
import { BookOpen, Calendar, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { TeacherDashboardGroup } from "@/types/teacher.types";

interface MyGroupsProps {
  groups: TeacherDashboardGroup[];
  locale: string;
  t: (key: string, values?: any) => string;
}

const formatSessionDays = (days: Array<{ day: string; time: string }>, locale: string, t: (key: string) => string) => {
  if (!days || days.length === 0) {
    return t("noScheduledDays");
  }

  const dayMapAr: Record<string, string> = {
    Sat: "السبت",
    Sun: "الأحد",
    Mon: "الاثنين",
    Tue: "الثلاثاء",
    Wen: "الأربعاء",
    Thu: "الخميس",
    Fri: "الجمعة",
  };

  const dayMapEn: Record<string, string> = {
    Sat: "Saturday",
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wen: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
  };

  return days
    .map((d) => {
      const dayName = locale === "ar" ? dayMapAr[d.day] || d.day : dayMapEn[d.day] || d.day;
      if (!d.time) return dayName;
      const parts = d.time.split(":");
      const hours = parseInt(parts[0], 10);
      const minutes = parts[1] || "00";
      const ampm = hours >= 12 ? (locale === "ar" ? "م" : "PM") : (locale === "ar" ? "ص" : "AM");
      const formattedHours = hours % 12 || 12;
      return `${dayName} (${formattedHours}:${minutes} ${ampm})`;
    })
    .join(" - ");
};

export function MyGroups({ groups, locale, t }: MyGroupsProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-black text-foreground">{t("myGroups")}</h2>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map((group: TeacherDashboardGroup) => (
            <div
              key={group.id}
              className="group bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-foreground mb-3">{group.name}</h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{t("studentCountLabel", { count: group.student_count })}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">
                      {formatSessionDays(group.session_days, locale, t)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex flex-col gap-2">
                <Link
                  href={`/${locale}/teacher/groups/${group.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-all border border-border"
                >
                  {t("groupDetails")} <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground shadow-sm">
          {t("noGroupsAssigned")}
        </div>
      )}
    </section>
  );
}
