"use client";

import { CheckCircle2, PartyPopper, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

interface AcademyDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle?: string;
}

export function AcademyDecisionModal({ isOpen, onClose, trackTitle }: AcademyDecisionModalProps) {
  const t = useTranslations();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 z-10">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />

        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          aria-label={t("common.close")}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-success-500/10 border-2 border-success-500/30 flex items-center justify-center animate-pulse">
            <PartyPopper className="w-10 h-10 text-success-500 animate-bounce" />
          </div>

          <div>
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">
              {t("student.academyDecisionTitle") || "قرار الأكاديمية"}
            </p>
            <h2 className="text-2xl font-bold text-foreground">
              {user?.full_name 
                ? t("student.academyDecisionWelcomeUser", { name: user.full_name })
                : (t("student.academyDecisionWelcome") || "أهلاً بكِ في أكاديمية ورتل!")}
            </h2>
          </div>

          {/* Student Verified Details Card */}
          {user && (
            <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 text-start space-y-3 relative overflow-hidden">
              {/* Subtle background glow to make it feel premium */}
              <div className="absolute -end-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -start-10 -bottom-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
              
              <p className="text-base font-extrabold text-muted-foreground border-b border-border/30 pb-2 flex items-center justify-between">
                <span>{t("student.registeredInfoTitle") || "بياناتكِ المعتمدة في النظام:"}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm relative z-10">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">{t("auth.fullName") || "الاسم كاملا"}</span>
                  <span className="font-extrabold text-foreground block truncate">{user.full_name}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">{t("common.phone") || "رقم الهاتف"}</span>
                  <span className="font-extrabold text-foreground block tracking-wide select-all dir-ltr text-start">{user.phone}</span>
                </div>
                
                {user.telegram_username && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-medium block">{t("auth.telegram") || "يوزر تيليجرام"}</span>
                    <span className="font-extrabold text-foreground block truncate select-all">
                      @{user.telegram_username.replace(/^@/, '')}
                    </span>
                  </div>
                )}
                
                {user.age && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-medium block">{t("auth.age") || "العمر"}</span>
                    <span className="font-extrabold text-foreground block">
                      {t("student.ageYears", { count: user.age }) || `${user.age} سنة`}
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">{t("student.enrollmentType") || "نوع الالتحاق"}</span>
                  <span className="font-extrabold text-foreground block truncate">
                    {(user as any)?.enrollment_type === "academy" || (user as any)?.enrollment_type === "الأكاديمية"
                      ? (t("student.academyPath") || "الأكاديمية")
                      : (user as any)?.enrollment_type === "institute" || (user as any)?.enrollment_type === "المعهد"
                      ? (t("student.institutePath") || "المعهد")
                      : (user as any)?.enrollment_type || (t("student.academyPath") || "الأكاديمية")}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">{t("common.status") || "الحالة"}</span>
                  <span className="font-extrabold text-success-600 block">
                    {(user as any)?.status_id === "2" || (user as any)?.status_id === 2
                      ? (t("student.statusActive") || "نشط / مقبول")
                      : (t("student.statusPending") || "معلق")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("student.academyDecisionNote") || "نرجو منك الالتزام بالمواعيد والمهام المطلوبة."}
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all hover:-translate-y-0.5 shadow-sm shadow-primary/20"
          >
            {t("student.iUnderstand")}
          </button>
        </div>
      </div>
    </div>
  );
}
