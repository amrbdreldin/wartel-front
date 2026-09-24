"use client";

import { Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import type { AvailableBuddyTime } from "@/types/student.types";

// ============================================================
// My Saved Times List – Displays the student's registered times
// ============================================================

interface MySavedTimesListProps {
  times: AvailableBuddyTime[];
  isLoading?: boolean;
}

export function MySavedTimesList({ times, isLoading }: MySavedTimesListProps) {
  const t = useTranslations();

  const formatTime = (time: string) => {
    if (!time) return "";
    const parts = time.split(":");
    if (parts.length < 2) return time;
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (isNaN(hours)) return time;
    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(h12)}:${minutes} ${ampm}`;
  };

  const getDayName = (timeItem: AvailableBuddyTime) => {
    if (timeItem.day_name) return timeItem.day_name;
    try {
      return t(`student.myGroups.${timeItem.day}` as Parameters<typeof t>[0]) || timeItem.day;
    } catch {
      return timeItem.day;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                {t("student.myGroups.mySavedTimes")}
                {times.length > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                    {t("student.myGroups.savedTimesCount", { count: times.length })}
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {t("student.myGroups.mySavedTimesDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {times.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50 text-muted-foreground">
            <AlertCircle className="h-5 w-5 text-muted-foreground/70 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-foreground">{t("student.myGroups.noSavedTimes")}</p>
              <p className="text-muted-foreground mt-0.5">{t("student.myGroups.noSavedTimesDesc")}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {times.map((item, index) => (
              <div
                key={item.id || index}
                className="group relative bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 hover:border-primary/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-bold text-sm text-foreground">
                      {getDayName(item)}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="h-3 w-3" />
                    {t("student.myGroups.activeStatus")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-background/60 rounded-xl px-3 py-2 border border-border/40">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span dir="ltr" className="font-semibold text-foreground">
                    {formatTime(item.start_time)} – {formatTime(item.end_time)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
