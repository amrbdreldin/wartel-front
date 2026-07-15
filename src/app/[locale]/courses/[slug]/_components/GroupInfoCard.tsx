"use client";

import { useTranslations } from "next-intl";
import { BookOpen, MapPin, GraduationCap, Calendar, Clock } from "lucide-react";
import type { DirectJoinGroup } from "@/services/group.service";

// ============================================================
// GroupInfoCard – Displays group details (name, track, teacher, schedule)
// ============================================================

interface GroupInfoCardProps {
  group: DirectJoinGroup;
}

export function GroupInfoCard({ group }: GroupInfoCardProps) {
  const t = useTranslations("directJoin");

  return (
    <div className="space-y-6">
      {/* Group Name Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white mb-2 mx-auto shadow-lg shadow-primary/25">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {group.group_name}
        </h1>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Track */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {t("trackName")}
            </p>
            <p className="text-sm font-semibold text-foreground truncate" title={group.track_name}>
              {group.track_name}
            </p>
          </div>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-accent/5 border border-accent/10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent shrink-0">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {t("teacherName")}
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              {group.teacher_name}
            </p>
          </div>
        </div>
      </div>

      {/* Session Days */}
      {group.group_session_days && group.group_session_days.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t("sessionDays")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {group.group_session_days.map((session, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/60 border border-border/60 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-semibold text-foreground">
                  {session.day}
                </span>
                <div className="w-px h-4 bg-border" />
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {session.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
