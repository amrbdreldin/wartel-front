"use client";

import { useState } from "react";
import { Users, CheckCircle2, UserCheck, Calendar, Clock, User, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { StudentDashboardGroup, DashboardTamamCard } from "@/types/student.types";

interface TamamStatsCardProps {
  groups?: StudentDashboardGroup[];
  tamamCard?: DashboardTamamCard | null;
  onShowTamamModal: (group?: StudentDashboardGroup) => void;
  onShowAssignModal: (group?: StudentDashboardGroup) => void;
  isStudentChild?: boolean;
}

export function TamamStatsCard({
  groups,
  tamamCard,
  onShowTamamModal,
  onShowAssignModal,
  isStudentChild,
}: TamamStatsCardProps) {
  const t = useTranslations();
  // First group open by default
  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(0);

  const getInitials = (name?: string) => {
    if (!name) return "—";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[parts.length - 1][0]}`;
    }
    return name[0] || "—";
  };

  const checkIsCompleted = (tamamCard: any) => {
    if (!tamamCard) return false;
    const status = tamamCard.status;
    if (!status) return false;
    if (typeof status === "string") {
      const s = status.trim().toLowerCase();
      return s === "completed" || s === "مكتمل" || s === "done";
    }
    const presentStatus = status.presentStatus || status.present_status;
    const pastStatus = status.pastStatus || status.past_status;
    const p1 = String(presentStatus || "").trim().toLowerCase();
    const p2 = String(pastStatus || "").trim().toLowerCase();
    return p1 === "completed" || p1 === "مكتمل" || p1 === "done" || p2 === "completed" || p2 === "مكتمل" || p2 === "done";
  };

  const hasGroups = Array.isArray(groups) && groups.length > 0;

  const toggleGroup = (index: number) => {
    setOpenGroupIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
      {/* Premium glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-info-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-info-500/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Header Container */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-info-500/20 to-info-500/5 text-info-600 flex items-center justify-center text-xl shrink-0 border border-info-500/15 shadow-[0_8px_20px_rgba(59,130,246,0.05)] group-hover:rotate-6 transition-transform">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-base text-foreground tracking-tight">
            {t("student.myGroups")}
          </h3>
          <p className="text-xs text-muted-foreground font-semibold">
            {t("student.weeklyTamam")}
          </p>
        </div>
      </div>

      {/* Content Area */}
      {hasGroups ? (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-0.5">
          {groups.map((group, idx) => {
            const isOpen = openGroupIndex === idx;
            const groupTamamCard = group.tamam_card;
            const buddy = groupTamamCard?.buddy;
            const isCompleted = checkIsCompleted(groupTamamCard);
            const hasBuddyFeature = group.has_buddy;
            const hasAssignedBuddy = !!buddy?.full_name;

            return (
              <div
                key={group.id || idx}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "bg-card border-primary/30 shadow-sm"
                    : "bg-muted/20 border-border/40 hover:bg-muted/40"
                )}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(idx)}
                  className="w-full p-3.5 flex items-center justify-between text-start gap-3 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-foreground leading-snug break-words">
                      {group.name}
                    </h4>
                    {group.teacher_name && (
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1 truncate">
                        <User className="w-3 h-3 text-primary/70 shrink-0" />
                        <span>{t("student.teacher")}: {group.teacher_name}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Compact Status Indicator when collapsed — shown if group.has_tamam is true */}
                    {!isOpen && group.has_tamam && (
                      <span
                        className={cn(
                          "w-2.5 h-2.5 rounded-full shrink-0",
                          isCompleted ? "bg-emerald-500" : "bg-warning-500"
                        )}
                        title={isCompleted ? t("student.statusCompleted") : t("student.statusPending")}
                      />
                    )}

                    <div
                      className={cn(
                        "w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-primary bg-primary/10"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Accordion Body (Open Content) */}
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 space-y-3 border-t border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* Session Days */}
                    {group.session_days && group.session_days.length > 0 && (
                      <div className="bg-muted/30 border border-border/30 rounded-xl p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{t("student.sessionDays")}:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                          {group.session_days.map((sDay, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border border-primary/20"
                            >
                              <span>{sDay.day}</span>
                              {sDay.time && (
                                <span className="opacity-80 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5 inline" />
                                  {sDay.time}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tamam Logic inside accordion */}
                    {group.has_tamam ? (
                      <div className="space-y-2">
                        {/* Rafiqa / Companion Section */}
                        {isStudentChild ? (
                          <div className="flex items-center gap-3 bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-[#005C5C] text-white flex items-center justify-center text-xs font-bold shadow-sm select-none shrink-0">
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
                          hasAssignedBuddy ? (
                            /* Group has_buddy: true AND student has a buddy assigned */
                            <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/30">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-info-500 to-info-400 text-white border-2 border-card flex items-center justify-center text-xs font-bold shadow-sm select-none shrink-0">
                                {getInitials(buddy?.full_name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">
                                  {t("student.rafeqaName")}
                                </p>
                                <p className="text-xs font-extrabold text-foreground truncate mt-0.5">
                                  {buddy?.full_name}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Group has_buddy: true BUT student does not have a buddy assigned yet -> Show Search Rafiqa */
                            <div className="p-3.5 border border-dashed border-border/80 rounded-xl bg-muted/20 text-center flex flex-col items-center justify-center space-y-2">
                              <p className="text-xs font-extrabold text-foreground leading-relaxed">
                                {t("student.noBuddyAssigned")}
                              </p>
                              <button
                                type="button"
                                onClick={() => onShowAssignModal(group)}
                                className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>{t("student.searchBuddy") || "البحث عن رفيقة"}</span>
                              </button>
                            </div>
                          )
                        ) : null}

                        {/* Tamam Status Badge: Shown when group has_tamam is true (and either no buddy feature or child or assigned buddy) */}
                        {(isStudentChild || !hasBuddyFeature || hasAssignedBuddy) && (
                          <div
                            className={cn(
                              "w-full py-2 text-center rounded-xl font-extrabold text-xs border flex items-center justify-center gap-2 shadow-sm transition-all duration-300",
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-warning-500/10 text-warning-600 border-warning-500/20"
                            )}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
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
                        )}

                        {/* Record Tamam Action Button: Shown when has_tamam is true (and either no buddy feature or child or assigned buddy) AND !isCompleted */}
                        {(isStudentChild || !hasBuddyFeature || hasAssignedBuddy) && !isCompleted && (
                          <button
                            type="button"
                            onClick={() => onShowTamamModal(group)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-[#005C5C] text-white text-center font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:from-[#005C5C] hover:to-primary hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>{t("student.recordTamam")}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 bg-muted/20 border border-border/30 rounded-xl text-center">
                        <p className="text-xs font-bold text-muted-foreground">
                          {t("student.tamamNotActive")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback for single tamamCard or no groups */
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {isStudentChild || tamamCard?.buddy?.full_name ? (
            <div className="space-y-3">
              {isStudentChild ? (
                <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-[#005C5C] text-white flex items-center justify-center text-xs font-bold shadow-sm select-none shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
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
              ) : (
                <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-2xl border border-border/30">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-info-500 to-info-400 text-white border-2 border-card flex items-center justify-center text-xs font-bold shadow-sm select-none shrink-0">
                    {getInitials(tamamCard?.buddy?.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">
                      {t("student.rafeqaName")}
                    </p>
                    <p className="text-xs font-extrabold text-foreground truncate mt-0.5">
                      {tamamCard?.buddy?.full_name}
                    </p>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "w-full py-2.5 text-center rounded-2xl font-extrabold text-xs border flex items-center justify-center gap-2 shadow-sm transition-all duration-300",
                  checkIsCompleted(tamamCard)
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-warning-500/10 text-warning-600 border-warning-500/20"
                )}
              >
                {checkIsCompleted(tamamCard) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                    <span>{t("student.tamamStatus")}: {t("student.statusCompleted") || "مكتمل"}</span>
                  </>
                ) : (
                  <>
                    <span>{t("student.tamamStatus")}: {t("student.statusPending") || "معلق"}</span>
                  </>
                )}
              </div>

              {!checkIsCompleted(tamamCard) && (
                <button
                  type="button"
                  onClick={() => onShowTamamModal()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-[#005C5C] text-white text-center font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:from-[#005C5C] hover:to-primary hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t("student.recordTamam")}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-border/80 rounded-2xl bg-muted/20 text-center flex flex-col items-center justify-center space-y-3 my-auto">
              <p className="text-xs font-extrabold text-foreground leading-relaxed">
                {t("student.noBuddyAssigned")}
              </p>
              <button
                type="button"
                onClick={() => onShowAssignModal()}
                className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t("student.searchBuddy") || "البحث عن رفيقة"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
