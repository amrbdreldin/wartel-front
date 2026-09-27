"use client";

import { useState } from "react";
import { Users, CheckCircle2, UserCheck, Calendar, Clock, User, ChevronDown, Phone, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudentDashboardGroup, DashboardTamamCard } from "@/types/student.types";

interface TamamStatsCardProps {
  group?: StudentDashboardGroup | null;
  groups?: StudentDashboardGroup[];
  tamamCard?: DashboardTamamCard | null;
  onShowTamamModal: (group?: StudentDashboardGroup) => void;
  onShowAssignModal?: (group?: StudentDashboardGroup) => void;
  isStudentChild?: boolean;
  selectedGroupId?: number | null;
  onSelectGroup?: (groupId: number) => void;
}

export function TamamStatsCard({
  group,
  groups,
  tamamCard,
  onShowTamamModal,
  onShowAssignModal,
  isStudentChild,
  selectedGroupId,
  onSelectGroup,
}: TamamStatsCardProps) {
  const t = useTranslations();

  // For accordion fallback if groups is passed without a specific group
  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(0);

  const getInitials = (name?: string) => {
    if (!name) return "—";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[parts.length - 1][0]}`;
    }
    return name[0] || "—";
  };

  const checkIsCompleted = (tamam?: DashboardTamamCard | null) => {
    if (!tamam || !tamam.status) return false;
    const statusObj: any = tamam.status;
    if (typeof statusObj === "string") {
      const s = statusObj.trim().toLowerCase();
      return s === "completed" || s === "مكتمل" || s === "done";
    }
    const presentStatus = statusObj.presentStatus || statusObj.present_status;
    const pastStatus = statusObj.pastStatus || statusObj.past_status;
    const p1 = String(presentStatus || "").trim().toLowerCase();
    const p2 = String(pastStatus || "").trim().toLowerCase();
    return (
      p1 === "completed" ||
      p1 === "مكتمل" ||
      p1 === "done" ||
      p2 === "completed" ||
      p2 === "مكتمل" ||
      p2 === "done"
    );
  };

  // If a single group is provided (Tab mode), render the focused group card
  const activeTargetGroup = group || (selectedGroupId && groups ? groups.find((g) => g.id === selectedGroupId) : null);

  if (activeTargetGroup) {
    const groupTamam = activeTargetGroup.tamam_card || tamamCard;
    const buddy = groupTamam?.buddy;
    const isCompleted = checkIsCompleted(groupTamam);
    const hasAssignedBuddy = !!buddy?.full_name;
    const isBuddyGroup = Boolean(
      activeTargetGroup.has_buddy &&
      (activeTargetGroup.has_buddy as any) !== "false" &&
      (activeTargetGroup.has_buddy as any) !== "0"
    );
    const hasBuddyFeature = isBuddyGroup || hasAssignedBuddy;

    return (
      <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] transition-all duration-500 group flex flex-col h-fit relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -right-20 -top-20 w-44 h-44 bg-info-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-info-500/10 transition-colors duration-500" />
        <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 text-primary flex items-center justify-center text-xl shrink-0 border border-primary/15 shadow-[0_8px_20px_rgba(0,143,143,0.05)] group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground tracking-tight">
                {activeTargetGroup.name}
              </h3>
              {activeTargetGroup.teacher_name && (
                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                  <User className="w-3 h-3 text-primary/70 shrink-0" />
                  <span>{t("student.teacher")}: {activeTargetGroup.teacher_name}</span>
                </p>
              )}
            </div>
          </div>

          {activeTargetGroup.has_tamam && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border shrink-0",
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-warning-500/10 text-warning-600 border-warning-500/20"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isCompleted ? "bg-emerald-500" : "bg-warning-500"
                )}
              />
              {isCompleted ? t("student.statusCompleted") : t("student.statusPending")}
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="space-y-4">
          {/* Session Days & Times */}
          {activeTargetGroup.session_days && activeTargetGroup.session_days.length > 0 && (
            <div className="bg-muted/25 border border-border/40 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{t("student.sessionDays")}:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTargetGroup.session_days.map((sDay, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border border-primary/20"
                  >
                    <span>{sDay.day}</span>
                    {sDay.time && (
                      <span className="opacity-80 flex items-center gap-1 font-semibold text-[11px]">
                        <Clock className="w-3 h-3 inline" />
                        <span dir="ltr">{sDay.time}</span>
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rafiqa / Companion Section */}
          <div className="space-y-2">
            {hasAssignedBuddy ? (
              /* Assigned Rafiqa */
              <div className="bg-muted/25 p-3.5 rounded-2xl border border-border/40 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-primary/80 text-white border-2 border-card flex items-center justify-center text-xs font-bold shadow-sm select-none shrink-0">
                    {getInitials(buddy?.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">
                      {t("student.rafeqaName")}
                    </p>
                    <p className="text-sm font-extrabold text-foreground truncate mt-0.5">
                      {buddy?.full_name}
                    </p>
                  </div>
                </div>

                {buddy?.phone && (
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
                    <div className="flex items-center gap-1.5 text-xs font-semibold min-w-0">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <a
                        href={`tel:${buddy.phone}`}
                        dir="ltr"
                        className="text-foreground hover:text-primary font-bold transition-colors truncate"
                      >
                        {buddy.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`tel:${buddy.phone}`}
                        className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                        title={t("student.call") || "اتصال"}
                        aria-label={t("student.call") || "اتصال"}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(buddy.phone);
                          toast.success(t("student.phoneCopied") || "تم نسخ رقم الهاتف");
                        }}
                        className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title={t("student.copyPhone") || "نسخ الرقم"}
                        aria-label={t("student.copyPhone") || "نسخ الرقم"}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : isStudentChild ? (
              <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-primary/80 text-white flex items-center justify-center text-xs font-bold shadow-sm select-none shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">
                    {t("student.weeklyTamam")}
                  </p>
                  <p className="text-xs font-extrabold text-foreground truncate mt-0.5">
                    {t("student.tamamHeaderChild")}
                  </p>
                </div>
              </div>
            ) : hasBuddyFeature ? (
              /* No Rafiqa Assigned Yet */
              <div className="p-4 border border-dashed border-border/80 rounded-2xl bg-muted/20 text-center flex flex-col items-center justify-center space-y-1.5">
                <p className="text-xs font-bold text-foreground leading-relaxed">
                  {t("student.noBuddyAssigned")}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {t("student.myGroups.availableBuddiesDesc")}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-muted/20 border border-border/30 rounded-2xl text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("student.myGroups.companionFeatureDisabled")}
                </p>
              </div>
            )}
          </div>

          {/* Tamam Status & Action */}
          {activeTargetGroup.has_tamam ? (
            <div className="space-y-2 pt-1">
              <div
                className={cn(
                  "w-full py-2.5 text-center rounded-2xl font-extrabold text-xs border flex items-center justify-center gap-2 shadow-xs transition-all duration-300",
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-warning-500/10 text-warning-600 border-warning-500/20"
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                    <span>
                      {t("student.tamamStatus")}: {t("student.statusCompleted") || "مكتمل"}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {t("student.tamamStatus")}: {t("student.statusPending") || "معلق"}
                    </span>
                  </>
                )}
              </div>

              {(isStudentChild || !hasBuddyFeature || hasAssignedBuddy) && !isCompleted && (
                <button
                  type="button"
                  onClick={() => onShowTamamModal(activeTargetGroup)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-center font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:from-primary/80 hover:to-primary hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t("student.recordTamam")}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 bg-muted/20 border border-border/30 rounded-2xl text-center">
              <p className="text-xs font-bold text-muted-foreground">
                {t("student.tamamNotActive")}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback if groups array is provided without a selected group
  const hasGroups = Array.isArray(groups) && groups.length > 0;

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-fit relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-info-500/20 to-info-500/5 text-info-600 flex items-center justify-center text-xl shrink-0 border border-info-500/15">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-base text-foreground tracking-tight">
            {t("student.myGroups.title")}
          </h3>
          <p className="text-xs text-muted-foreground font-semibold">
            {t("student.weeklyTamam")}
          </p>
        </div>
      </div>

      {hasGroups ? (
        <div className="flex flex-col gap-3">
          {groups.map((grp, idx) => {
            const isOpen = openGroupIndex === idx;
            const isCompleted = checkIsCompleted(grp.tamam_card);
            return (
              <div
                key={grp.id || idx}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen ? "bg-card border-primary/30 shadow-sm" : "bg-muted/20 border-border/40 hover:bg-muted/40"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenGroupIndex(openGroupIndex === idx ? null : idx);
                    onSelectGroup?.(grp.id);
                  }}
                  className="w-full p-3.5 flex items-center justify-between text-start gap-3 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-foreground leading-snug">{grp.name}</h4>
                    {grp.teacher_name && (
                      <p className="text-xs text-muted-foreground mt-0.5">{grp.teacher_name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {grp.has_tamam && (
                      <span
                        className={cn(
                          "w-2.5 h-2.5 rounded-full shrink-0",
                          isCompleted ? "bg-emerald-500" : "bg-warning-500"
                        )}
                      />
                    )}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground text-sm">
          {t("student.noGroupsAssigned")}
        </div>
      )}
    </div>
  );
}
