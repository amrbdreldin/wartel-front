"use client";

import { UserCheck, Users, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BuddyInfoCardProps {
  buddy: any;
  tamamCard: any;
}

export function BuddyInfoCard({ buddy, tamamCard }: BuddyInfoCardProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  const presentStatus = tamamCard?.status?.presentStatus;
  const isPending = !presentStatus || presentStatus.toLowerCase() === "pending";

  // If a buddy is assigned, render the classic Buddy Info card
  if (buddy?.full_name) {
    return (
      <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
        />

        <div className="w-20 h-20 bg-success-500/10 text-success-600 rounded-full flex items-center justify-center text-4xl mb-4 relative z-10 shadow-sm border border-success-500/20">
          <UserCheck className="h-10 w-10" />
        </div>

        <h5 className="text-xl font-bold text-foreground mb-1 relative z-10">
          {t("student.rafeqaName")}: {buddy?.full_name}
        </h5>
        <p className="text-muted-foreground text-sm font-medium mb-6 relative z-10" dir="ltr">
          {buddy?.phone || "—"}
        </p>

        <div className="w-full border-t border-border/50 mb-6 relative z-10"></div>

        <div className="w-full flex justify-between items-center text-sm relative z-10">
          <span className="text-muted-foreground font-bold">{t("student.weekStatus")}</span>
          <span className={cn(
            "px-4 py-1.5 rounded-full font-bold capitalize",
            isPending
              ? "bg-warning-500/10 text-warning-600"
              : "bg-success-500/10 text-success-600"
          )}>
            {isPending ? (t("student.statusPending") || "معلق") : (t("student.statusCompleted") || "مكتمل")}
          </span>
        </div>
      </div>
    );
  }

  // If no buddy is assigned, render the guidance card
  return (
    <div className="bg-card rounded-3xl p-8 border border-dashed border-border/80 shadow-sm h-full flex flex-col justify-center items-center text-center relative overflow-hidden space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-muted/40 text-muted-foreground flex items-center justify-center">
        <Users className="h-8 w-8 text-muted-foreground/60" />
      </div>

      <div className="space-y-1">
        <h4 className="font-extrabold text-lg text-foreground">
          {t("student.noBuddyAssigned")}
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
          {t("student.myGroups.availableBuddiesDesc")}
        </p>
      </div>

      <Link
        href={`/${locale}/student/my-groups`}
        className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 inline-flex items-center gap-2 mt-2"
      >
        <UserCheck className="w-4 h-4" />
        <span>{t("student.myGroups.title")}</span>
      </Link>

      <div className="pt-2 text-center">
        <p className="text-[11px] text-muted-foreground font-semibold flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-warning-500 shrink-0" />
          <span>{t("student.lockActionWarning") || "يرجى تعيين رفيقة أولاً لتفعيل التمام."}</span>
        </p>
      </div>
    </div>
  );
}
