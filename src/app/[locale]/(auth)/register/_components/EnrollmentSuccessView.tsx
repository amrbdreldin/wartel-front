"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EnrollmentSuccessViewProps {
  telegramTrackingUrl?: string | null;
  locale: string;
}

const DEFAULT_TELEGRAM_BOT_URL = "https://t.me/wartelacademy_bot";

/**
 * Validates and sanitizes a Telegram URL to prevent malicious link injection.
 */
function sanitizeTelegramUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== "string") return DEFAULT_TELEGRAM_BOT_URL;

  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "https:" &&
      (parsed.hostname === "t.me" ||
        parsed.hostname === "telegram.me" ||
        parsed.hostname.endsWith(".t.me"))
    ) {
      return trimmed;
    }
  } catch {
    return DEFAULT_TELEGRAM_BOT_URL;
  }

  return DEFAULT_TELEGRAM_BOT_URL;
}

/**
 * Official Telegram Airplane Icon (SVG)
 */
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-5 h-5 fill-current", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

const STEPS = [
  { num: 1, titleKey: "auth.telegramStep1Title", descKey: "auth.telegramStep1Desc", emphasized: false },
  { num: 2, titleKey: "auth.telegramStep2Title", descKey: "auth.telegramStep2Desc", emphasized: true },
  { num: 3, titleKey: "auth.telegramStep3Title", descKey: "auth.telegramStep3Desc", emphasized: false },
] as const;

export function EnrollmentSuccessView({
  telegramTrackingUrl,
  locale,
}: EnrollmentSuccessViewProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRTL = locale === "ar";
  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  const targetUrl = sanitizeTelegramUrl(telegramTrackingUrl);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      toast.success(t("auth.telegramCopied"));
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(t("common.errorOccurred"));
    }
  };

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-border/40 text-center animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      {/* ── Top Success Status ── */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-success-500/10 text-success-600 dark:text-success-400 rounded-full flex items-center justify-center ring-8 ring-success-500/5">
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" aria-hidden="true" />
        </div>
        <div className="absolute -top-1 -end-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight">
        {t("auth.applicationSuccessTitle")}
      </h2>

      <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
        {t("auth.applicationSuccessDesc")}
      </p>

      {/* ── Telegram Callout Card (Highlight & Required) ── */}
      <div className="bg-gradient-to-b from-info-500/10 via-info-500/5 to-transparent dark:from-info-500/20 dark:via-info-500/10 rounded-3xl p-5 sm:p-7 md:p-9 border-2 border-info-500/30 shadow-xl shadow-info-500/5 text-start relative overflow-hidden mb-8">
        {/* Subtle decorative background circle */}
        <div
          className="absolute -top-16 -end-16 w-44 h-44 bg-info-500/10 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Priority Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-info-500/15 text-info-600 dark:text-info-400 font-black text-xs md:text-sm border border-info-500/30 shadow-sm">
            <TelegramIcon className="w-4 h-4" />
            <span>{t("auth.telegramStepBadge")}</span>
          </div>

          <span className="text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-md bg-warning-500/10 text-warning-600 dark:text-warning-400 border border-warning-500/20">
            {t("auth.telegramMandatoryBadge")}
          </span>
        </div>

        {/* Header */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-2 leading-snug">
          {t("auth.telegramRequiredTitle")}
        </h3>

        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
          {t("auth.telegramRequiredDesc")}
        </p>

        {/* ── 3 Visual Steps ── */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 list-none">
          {STEPS.map(({ num, titleKey, descKey, emphasized }) => (
            <li
              key={num}
              className={cn(
                "rounded-2xl p-4 flex flex-col justify-between",
                emphasized
                  ? "bg-card/95 border-2 border-info-500 dark:border-info-500/80 shadow-md shadow-info-500/10 relative ring-2 ring-info-500/20"
                  : "bg-card/90 border border-border/60 shadow-sm"
              )}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shrink-0",
                    emphasized ? "bg-info-500 text-white" : "bg-muted text-foreground"
                  )}
                >
                  {num}
                </span>
                <h4
                  className={cn(
                    "text-sm",
                    emphasized ? "font-black text-info-600 dark:text-info-400" : "font-bold text-foreground"
                  )}
                >
                  {t(titleKey)}
                </h4>
              </div>
              <p
                className={cn(
                  "text-xs leading-relaxed",
                  emphasized ? "text-foreground/90 font-medium" : "text-muted-foreground"
                )}
              >
                {t(descKey)}
              </p>
            </li>
          ))}
        </ol>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* Main CTA: Open Telegram */}
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-info-500 hover:bg-info-600 active:scale-[0.99] text-white font-black text-base md:text-lg shadow-lg shadow-info-500/25 hover:shadow-info-500/40 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info-500 focus-visible:ring-offset-2"
            aria-label={t("auth.telegramOpenButton")}
          >
            <TelegramIcon className="w-5 h-5 shrink-0" />
            <span>{t("auth.telegramOpenButton")}</span>
            <ExternalLink className="w-4 h-4 opacity-80 shrink-0" aria-hidden="true" />
          </a>

          {/* Secondary: Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-card hover:bg-muted text-foreground font-bold text-sm border border-border/80 shadow-sm hover:border-info-500/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
            aria-label={t("auth.telegramCopyLink")}
          >
            {copied ? (
              <Check className="w-4 h-4 text-success-600 dark:text-success-400" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span>{copied ? t("auth.telegramCopied") : t("auth.telegramCopyLink")}</span>
          </button>
        </div>

        {/* ── Important Note / Warning ── */}
        <div
          role="note"
          className="mt-6 flex items-start gap-3 p-3.5 md:p-4 rounded-2xl bg-warning-500/10 border border-warning-500/25 text-warning-600 dark:text-warning-400 text-xs md:text-sm leading-relaxed"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{t("auth.telegramWarning")}</span>
        </div>
      </div>

      {/* ── Back to Home Link ── */}
      <div className="flex justify-center pt-2">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold text-sm md:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BackArrow className="w-4 h-4" aria-hidden="true" />
          <span>{t("common.backToHome")}</span>
        </Link>
      </div>
    </div>
  );
}
