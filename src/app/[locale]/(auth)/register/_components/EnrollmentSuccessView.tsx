"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { TelegramBotActivationCard } from "@/components/common/TelegramBotActivationCard";

interface EnrollmentSuccessViewProps {
  telegramTrackingUrl?: string | null;
  locale: string;
  redirectPath?: string | null;
  title?: string;
}

export function EnrollmentSuccessView({
  telegramTrackingUrl,
  locale,
  redirectPath,
  title,
}: EnrollmentSuccessViewProps) {
  const t = useTranslations();
  const isRTL = locale === "ar";
  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-3xl shadow-2xl p-5 sm:p-6 border border-border/40 text-center animate-in fade-in zoom-in-95 duration-500 max-w-lg mx-auto">
      {/* ── Top Success Status ── */}
      <div className="relative inline-flex items-center justify-center mb-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-success-500/10 text-success-600 dark:text-success-400 rounded-full flex items-center justify-center ring-4 ring-success-500/5">
          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
        </div>
        <div className="absolute -top-1 -end-1 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-foreground mb-4 tracking-tight">
        {title || t("auth.applicationSuccessTitle")}
      </h2>

      {/* ── Telegram Callout Card (Highlight & Required) ── */}
      <TelegramBotActivationCard
        telegramTrackingUrl={telegramTrackingUrl}
        className="mb-4"
      />

      {/* ── Navigation Links ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {redirectPath && (
          <Link
            href={redirectPath}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 gradient-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-90 transition-all"
          >
            <span>{t("directJoin.goToDashboard")}</span>
            <BackArrow className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
        <Link
          href={`/${locale}`}
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BackArrow className="w-4 h-4" aria-hidden="true" />
          <span>{t("common.backToHome")}</span>
        </Link>
      </div>
    </div>
  );
}
