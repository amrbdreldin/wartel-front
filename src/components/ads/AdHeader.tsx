"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { X, ExternalLink, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { AdMedia } from "./AdMedia";

interface AdHeaderProps {
  ad: Ad;
  className?: string;
  onDismiss?: (adId: number) => void;
}

export function AdHeader({ ad, className, onDismiss }: AdHeaderProps) {
  const t = useTranslations("ads");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [isDismissed, setIsDismissed] = useState(true);

  // Check sessionStorage on mount to see if previously dismissed in this session
  useEffect(() => {
    const storageKey = `wartel_dismissed_ad_${ad.id}`;
    const dismissed = sessionStorage.getItem(storageKey);
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, [ad.id]);

  const handleDismiss = () => {
    const storageKey = `wartel_dismissed_ad_${ad.id}`;
    sessionStorage.setItem(storageKey, "1");
    setIsDismissed(true);
    onDismiss?.(ad.id);
  };

  if (isDismissed) return null;

  const hasMedia = ad.media_type && ad.media_type !== "none";
  const isExternalUrl = ad.action_url?.startsWith("http");

  return (
    <div
      role="region"
      aria-label={ad.title}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-5 md:p-6 shadow-sm transition-all duration-300",
        className
      )}
    >
      {/* Background Decorative Element */}
      <div className="pointer-events-none absolute -top-12 -end-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -start-12 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t("close")}
        className="absolute top-3 end-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left / Info Section */}
        <div className="flex-1 space-y-3 pe-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{ad.placement_name || t("announcement")}</span>
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">
            {ad.title}
          </h2>

          {/* Content */}
          {ad.content && (
            <p className="text-sm md:text-base text-muted-foreground line-clamp-3 leading-relaxed">
              {ad.content}
            </p>
          )}

          {/* Action Button */}
          {ad.action_url && (
            <div className="pt-2">
              {isExternalUrl ? (
                <a
                  href={ad.action_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <span>{ad.action_title || t("viewDetails")}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={ad.action_url}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <span>{ad.action_title || t("viewDetails")}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right / Media Preview */}
        {hasMedia && (
          <div className="w-full lg:max-w-md shrink-0">
            <AdMedia ad={ad} aspectRatio="video" className="max-h-60" />
          </div>
        )}
      </div>
    </div>
  );
}

