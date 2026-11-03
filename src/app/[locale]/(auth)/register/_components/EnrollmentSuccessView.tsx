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
  Play,
  Bell,
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
  {
    num: 1,
    icon: ExternalLink,
    titleKey: "auth.telegramStep1Title",
    descKey: "auth.telegramStep1Desc",
    emphasized: false,
  },
  {
    num: 2,
    icon: Play,
    titleKey: "auth.telegramStep2Title",
    descKey: "auth.telegramStep2Desc",
    emphasized: true,
  },
  {
    num: 3,
    icon: Bell,
    titleKey: "auth.telegramStep3Title",
    descKey: "auth.telegramStep3Desc",
    emphasized: false,
  },
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
    <div className="bg-card/95 backdrop-blur-md rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10 border border-border/40 text-center animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      {/* ── Top Success Status ── */}
      <div className="relative inline-flex items-center justify-center mb-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-success-500/10 text-success-600 dark:text-success-400 rounded-full flex items-center justify-center ring-8 ring-success-500/5">
          <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10" aria-hidden="true" />
        </div>
        <div className="absolute -top-1 -end-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2.5 tracking-tight">
        {t("auth.applicationSuccessTitle")}
      </h2>

      <p className="text-sm sm:text-base text-muted-foreground mb-7 max-w-xl mx-auto leading-relaxed">
        {t("auth.applicationSuccessDesc")}
      </p>

      {/* ── Telegram Callout Card (Highlight & Required) ── */}
      <section
        aria-labelledby="telegram-callout-heading"
        className="rounded-3xl p-5 sm:p-7 md:p-8 border border-sky-500/20 dark:border-sky-500/30 bg-gradient-to-b from-sky-500/[0.08] via-sky-500/[0.02] to-card dark:from-sky-500/15 dark:via-background dark:to-card shadow-xl shadow-sky-500/5 text-start relative overflow-hidden mb-7"
      >
        {/* Subtle decorative background glow */}
        <div
          className="absolute -top-16 -end-16 w-48 h-48 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Priority & Status Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 dark:bg-sky-500/20 text-[#0088cc] dark:text-[#38bdf8] font-bold text-xs md:text-sm border border-sky-500/30">
            <TelegramIcon className="w-4 h-4 shrink-0" />
            <span>{t("auth.telegramStepBadge")}</span>
          </div>

          <span className="text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full bg-warning-500/10 text-warning-700 dark:text-warning-400 border border-warning-500/25">
            {t("auth.telegramMandatoryBadge")}
          </span>
        </div>

        {/* Header */}
        <h3
          id="telegram-callout-heading"
          className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-2 tracking-tight"
        >
          {t("auth.telegramRequiredTitle")}
        </h3>

        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          {t("auth.telegramRequiredDesc")}
        </p>

        {/* ── 3 Visual Steps ── */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3.5 mb-6 list-none p-0">
          {STEPS.map(({ num, icon: StepIcon, titleKey, descKey, emphasized }) => (
            <li
              key={num}
              className={cn(
                "relative rounded-2xl p-4 flex flex-col justify-between transition-all duration-200",
                emphasized
                  ? "bg-card border-2 border-[#0088cc] dark:border-[#38bdf8] shadow-md shadow-[#0088cc]/10 ring-2 ring-[#0088cc]/20"
                  : "bg-card/70 dark:bg-card/40 border border-border/70 hover:border-border"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-sm",
                      emphasized
                        ? "bg-[#0088cc] text-white"
                        : "bg-muted text-muted-foreground font-bold"
                    )}
                  >
                    {num}
                  </span>
                  <StepIcon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      emphasized
                        ? "text-[#0088cc] dark:text-[#38bdf8]"
                        : "text-muted-foreground/60"
                    )}
                    aria-hidden="true"
                  />
                </div>
                <h4
                  className={cn(
                    "text-sm mb-1",
                    emphasized ? "font-black text-foreground" : "font-bold text-foreground/90"
                  )}
                >
                  {t(titleKey)}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(descKey)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Main CTA: Open Telegram */}
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#0088cc]/20 hover:shadow-[#0088cc]/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0088cc] focus-visible:ring-offset-2"
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
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-card hover:bg-muted text-foreground font-semibold text-sm border border-border shadow-sm hover:border-[#0088cc]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
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
          className="mt-4 flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl bg-warning-500/10 border border-warning-500/20 text-warning-800 dark:text-warning-300 text-xs sm:text-sm leading-relaxed"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-warning-600 dark:text-warning-400" aria-hidden="true" />
          <span>{t("auth.telegramWarning")}</span>
        </div>
      </section>

      {/* ── Back to Home Link ── */}
      <div className="flex justify-center pt-1">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-bold text-sm md:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BackArrow className="w-4 h-4" aria-hidden="true" />
          <span>{t("common.backToHome")}</span>
        </Link>
      </div>
    </div>
  );
}
