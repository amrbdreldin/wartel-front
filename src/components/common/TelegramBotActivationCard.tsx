"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const DEFAULT_TELEGRAM_BOT_URL = "https://t.me/wartelacademy_bot";

/**
 * Validates and sanitizes a Telegram URL to prevent malicious link injection.
 */
export function sanitizeTelegramUrl(rawUrl?: string | null): string {
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
export function TelegramIcon({ className }: { className?: string }) {
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

interface TelegramBotActivationCardProps {
  telegramTrackingUrl?: string | null;
  description?: string;
  warning?: string;
  className?: string;
}

/**
 * Reusable callout card prompting the user to open the Telegram bot and tap Start.
 */
export function TelegramBotActivationCard({
  telegramTrackingUrl,
  description,
  warning,
  className,
}: TelegramBotActivationCardProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetUrl = sanitizeTelegramUrl(telegramTrackingUrl);
  const resolvedDescription = description || t("auth.telegramRequiredDesc");
  const resolvedWarning = warning || t("auth.telegramWarning");

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
    <section
      aria-labelledby="telegram-callout-text"
      className={cn(
        "rounded-2xl p-4 sm:p-5 border border-sky-500/20 dark:border-sky-500/30 bg-gradient-to-b from-sky-500/[0.08] via-sky-500/[0.02] to-card dark:from-sky-500/15 dark:via-background dark:to-card text-center",
        className
      )}
    >
      <p
        id="telegram-callout-text"
        className="text-sm sm:text-base font-bold text-foreground mb-4 leading-relaxed"
      >
        {resolvedDescription}
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#0088cc]/25 hover:shadow-[#0088cc]/35 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0088cc] focus-visible:ring-offset-2"
          aria-label={t("auth.telegramOpenButton")}
        >
          <TelegramIcon className="w-5 h-5 shrink-0" />
          <span>{t("auth.telegramOpenButton")}</span>
          <ExternalLink className="w-4 h-4 opacity-80 shrink-0" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-card hover:bg-muted text-foreground font-semibold text-sm border border-border shadow-sm hover:border-[#0088cc]/40 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
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

      <div
        role="note"
        className="mt-3 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-warning-500/10 border border-warning-500/20 text-warning-800 dark:text-warning-300 text-xs leading-relaxed"
      >
        <AlertTriangle className="w-4 h-4 shrink-0 text-warning-600 dark:text-warning-400" aria-hidden="true" />
        <span>{resolvedWarning}</span>
      </div>
    </section>
  );
}
