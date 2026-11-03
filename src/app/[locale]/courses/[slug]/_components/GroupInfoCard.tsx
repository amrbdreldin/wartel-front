"use client";

import { useTranslations } from "next-intl";
import { BookOpen, GraduationCap, Calendar, Clock, Check, Users, Layers, CheckCircle2 } from "lucide-react";
import type { DirectJoinGroup } from "@/services/group.service";
import { cn } from "@/lib/utils";

// ============================================================
// GroupInfoCard – Displays group/track details and group selection
// ============================================================

interface GroupInfoCardProps {
  groups: DirectJoinGroup[];
  selectedGroupId: number;
  onSelectGroup: (groupId: number) => void;
}

export function GroupInfoCard({
  groups,
  selectedGroupId,
  onSelectGroup,
}: GroupInfoCardProps) {
  const t = useTranslations("directJoin");

  const selectedGroup =
    groups.find((g) => g.group_id === selectedGroupId) || groups[0];

  const trackName =
    selectedGroup?.track_name || groups[0]?.track_name || t("joinCourse");

  const isMultiGroup = groups.length > 1;

  return (
    <div className="space-y-6">
      {/* Track / Course Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary text-white mb-2 mx-auto shadow-lg shadow-primary/25">
          <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight px-2">
          {trackName}
        </h1>
        {isMultiGroup && (
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {t("selectGroupDescription")}
          </p>
        )}
      </div>

      {/* Multiple Groups Selection List */}
      {isMultiGroup ? (
        <div className="space-y-3">
          {/* Section title & count */}
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              {t("availableGroups")}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-[11px]">
              {groups.length} {t("groupsAvailable")}
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label={t("availableGroups")}
            className="space-y-3"
          >
            {groups.map((group) => {
              const isSelected = group.group_id === selectedGroupId;

              return (
                <div
                  key={group.group_id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => onSelectGroup(group.group_id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectGroup(group.group_id);
                    }
                  }}
                  className={cn(
                    "relative flex flex-col p-4 rounded-xl border transition-all duration-200 cursor-pointer text-start select-none outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary/[0.04] dark:bg-primary/[0.08] shadow-sm ring-1 ring-primary/30"
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/40 bg-card"
                  )}
                >
                  {/* Top Row: Radio circle, Group Name, Teacher, Selected badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Radio Circle */}
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-muted-foreground/40 bg-background"
                        )}
                        aria-hidden="true"
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>

                      {/* Group Name & Teacher */}
                      <div className="min-w-0">
                        <span className="font-bold text-sm sm:text-base text-foreground block">
                          {group.group_name}
                        </span>
                        {group.teacher_name && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <GraduationCap className="w-3.5 h-3.5 shrink-0 text-accent" />
                            <span className="truncate">{group.teacher_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {t("selected")}
                      </span>
                    )}
                  </div>

                  {/* Session Days & Times */}
                  {group.group_session_days && group.group_session_days.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-border/40">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0 font-medium">
                        <Calendar className="w-3 h-3" />
                        {t("schedule")}:
                      </span>
                      {group.group_session_days.map((session, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/80 text-[11px] font-medium text-foreground border border-border/50"
                        >
                          <span>{session.day}</span>
                          <span className="text-muted-foreground">·</span>
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{session.time}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Allowed Roles */}
                  {group.allowed_roles && group.allowed_roles.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                        <Users className="w-3 h-3" />
                        {t("targetAudience")}:
                      </span>
                      {group.allowed_roles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-semibold"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Group Confirmation Banner */}
          {selectedGroup && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-start">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground truncate">
                  {t("selectedGroup")}:{" "}
                  <strong className="text-foreground">{selectedGroup.group_name}</strong>
                </span>
              </div>
              {selectedGroup.teacher_name && (
                <span className="text-primary font-medium text-[11px] shrink-0 ms-2">
                  {selectedGroup.teacher_name}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Single Group Details View */
        selectedGroup && (
          <div className="space-y-4">
            {/* Group Name Display */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("groupName")}
                </span>
                <span className="font-bold text-base text-foreground">
                  {selectedGroup.group_name}
                </span>
              </div>

              {/* Teacher */}
              {selectedGroup.teacher_name && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-accent" />
                    {t("teacherName")}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {selectedGroup.teacher_name}
                  </span>
                </div>
              )}
            </div>

            {/* Session Days */}
            {selectedGroup.group_session_days && selectedGroup.group_session_days.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {t("sessionDays")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedGroup.group_session_days.map((session, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted/60 border border-border/60 transition-colors hover:bg-muted"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {session.day}
                      </span>
                      <div className="w-px h-3.5 bg-border" />
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {session.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Allowed Roles */}
            {selectedGroup.allowed_roles && selectedGroup.allowed_roles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  {t("targetAudience")}:
                </span>
                {selectedGroup.allowed_roles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
