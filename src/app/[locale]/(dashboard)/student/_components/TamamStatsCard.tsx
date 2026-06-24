"use client";

import { Users, CheckCircle2, UserCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import Link from "next/link";

interface TamamStatsCardProps {
  tamamCard: any;
  onShowTamamModal: () => void;
  onShowAssignModal: () => void;
  isStudentChild?: boolean;
}

export function TamamStatsCard({ tamamCard, onShowTamamModal, onShowAssignModal, isStudentChild }: TamamStatsCardProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  const presentStatus = tamamCard?.status?.presentStatus;
  const isPending = !presentStatus || 
    presentStatus.toLowerCase() === "pending" || 
    presentStatus === "معلق";
  const isCompleted = !isPending;
  const isDisabled = isCompleted;

  // Helper to extract initials for the avatar
  const getInitials = (name?: string) => {
    if (!name) return "—";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]} ${parts[parts.length - 1][0]}`;
    }
    return name[0] || "—";
  };

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">

      {/* Premium glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-info-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-info-500/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-info-500/20 to-info-500/5 text-info-600 flex items-center justify-center text-2xl mb-4 group-hover:rotate-12 group-hover:scale-115 transition-all duration-500 border border-info-500/15 shadow-[0_8px_20px_rgba(59,130,246,0.05)]">
        <Users className="h-6 w-6" />
      </div>

      {/* Titles */}
      <h3 className="font-extrabold text-lg text-foreground mb-1 tracking-tight">{t("student.weeklyTamam")}</h3>

      {isStudentChild || tamamCard?.buddy?.full_name ? (
        <>
          {/* Collaboration Avatar Block */}
          {isStudentChild ? (
            <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/10 my-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-[#005C5C] text-white flex items-center justify-center text-xs font-bold shadow-sm select-none">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">{t("student.weeklyTamam") || "التمام الأسبوعي"}</p>
                <p className="text-xs font-extrabold text-foreground truncate mt-0.5">{t("student.tamamHeaderChild") || "تأكيد تسميع الورد"}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-2xl border border-border/30 my-3">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {/* Partner initials avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-info-500 to-info-400 text-white border-2 border-card flex items-center justify-center text-xs font-bold shadow-sm select-none">
                  {getInitials(tamamCard?.buddy?.full_name)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">{t("student.rafeqaName")}</p>
                <p className="text-xs font-extrabold text-foreground truncate mt-0.5">{tamamCard?.buddy?.full_name}</p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className={cn(
            "w-full py-2.5 mb-4 text-center rounded-2xl font-extrabold text-xs border flex items-center justify-center gap-2 shadow-sm transition-all duration-300",
            isCompleted
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-warning-500/10 text-warning-600 border-warning-500/20"
          )}>
            {isCompleted ? (
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

          {/* Action Button */}
          <div className="mt-auto">
            <button
              onClick={onShowTamamModal}
              disabled={isDisabled}
              className={cn(
                "block w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-[#005C5C] text-white text-center font-extrabold transition-all duration-300 flex items-center justify-center gap-2 shadow-md",
                isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-[#005C5C] hover:to-primary hover:shadow-[0_8px_20px_rgba(0,143,143,0.25)] hover:-translate-y-0.5 active:translate-y-0 group/btn cursor-pointer"
              )}
            >
              <UserCheck className={cn("w-4 h-4 transition-transform", !isDisabled && "group-hover/btn:scale-115")} />
              <span>{t("student.recordTamam")}</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-grow flex flex-col justify-between my-3 min-h-[160px]">
            <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 flex-grow transition-all duration-300 hover:bg-muted/30">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-info-500/20 to-info-500/5 text-info-600 flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(59,130,246,0.05)] border border-info-500/10 group-hover:scale-105 transition-transform duration-300">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs font-extrabold text-foreground leading-relaxed">
                {t("student.noBuddyAssigned")}
              </p>
              <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
                {t("student.noBuddyAssignedDesc")}
              </p>
              <button
                onClick={onShowAssignModal}
                className="mt-4 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t("student.searchBuddy") || "البحث عن رفيقة"}</span>
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border/30">
            <Link
              href={`/${locale}/student/tamam`}
              className="text-xs font-extrabold text-[#007070] dark:text-[#00b3b3] hover:text-primary-dark inline-flex items-center justify-center gap-2 group/link border border-primary/20 hover:border-primary/40 px-4 py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 w-full transition-all duration-300 shadow-sm"
            >
              <span>{t("student.fullRecord")}</span>
              {locale === "ar" ? (
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-x-1" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
              )}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
