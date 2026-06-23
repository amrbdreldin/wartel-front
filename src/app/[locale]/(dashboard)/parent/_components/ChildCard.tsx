"use client";

import { useTranslations } from "next-intl";
import { Activity, GraduationCap, BookMarked, Circle, ExternalLink, KeyRound, Loader2 } from "lucide-react";

interface ChildInfo {
  id: number;
  name: string;
  enrollment_type: string;
}

interface ChildCardProps {
  child: ChildInfo;
  onViewProfile: (id: number) => void;
  onLoginAsChild: (child: ChildInfo) => void;
  isLoggingIn: boolean;
  isAnyLoggingIn: boolean;
  getEnrollmentTypeLabel: (type: string) => string;
}

export function ChildCard({
  child,
  onViewProfile,
  onLoginAsChild,
  isLoggingIn,
  isAnyLoggingIn,
  getEnrollmentTypeLabel,
}: ChildCardProps) {
  const t = useTranslations("parent");
  const initial = child.name?.trim().charAt(0) || "ط";
  const enrollmentLabel = getEnrollmentTypeLabel(child.enrollment_type);

  return (
    <div className="group relative bg-card rounded-3xl border border-border/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-500">
      {/* Subtle glow behind card */}
      <div className="absolute -top-16 -end-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
      <div className="absolute -bottom-12 -start-12 w-36 h-36 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top accent stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-[#005C5C]" />

      <div className="p-5 relative z-10">
        {/* Avatar + Name block */}
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar ring */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-black text-primary shadow-md shadow-primary/10 group-hover:scale-105 group-hover:border-primary/40 transition-all duration-500">
              {initial}
            </div>
            {/* Active indicator */}
            <span className="absolute -bottom-1 -end-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center shadow">
              <Activity className="w-2.5 h-2.5 text-white" />
            </span>
          </div>

          {/* Name + badge */}
          <div className="overflow-hidden flex-1">
            <h6 className="font-extrabold text-foreground text-base leading-tight truncate mb-1.5 group-hover:text-primary transition-colors duration-300">
              {child.name}
            </h6>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-primary/8 border border-primary/15 text-xs font-bold text-primary/80 truncate max-w-full">
              <GraduationCap className="w-3 h-3 shrink-0" />
              {enrollmentLabel}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 relative z-10">
          {/* View Profile */}
          <button
            onClick={() => onViewProfile(child.id)}
            disabled={isAnyLoggingIn}
            title={t("viewChildProfile")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted hover:border-primary/30 hover:text-primary text-muted-foreground font-bold text-[11px] sm:text-xs transition-all duration-200 group/btn cursor-pointer focus:outline-none truncate ${isLoggingIn ? "opacity-50" : ""}`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/btn:scale-110" />
            <span className="truncate">{t("viewChildProfile")}</span>
          </button>

          {/* Login as Student */}
          <button
            onClick={() => onLoginAsChild(child)}
            disabled={isAnyLoggingIn}
            title={t("loginAsChild")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-primary to-[#005C5C] text-white font-bold text-[11px] sm:text-xs transition-all duration-200 hover:shadow-md hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 group/btn cursor-pointer focus:outline-none ${isLoggingIn ? "opacity-70" : ""}`}
          >
            {isLoggingIn ? (
              <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
            ) : (
              <KeyRound className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/btn:rotate-12" />
            )}
            <span className="truncate">{t("loginAsChild")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
