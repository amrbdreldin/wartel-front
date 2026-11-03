"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ExternalLink, ArrowLeft, ArrowRight, PlayCircle, BookOpen } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { AdMedia } from "./AdMedia";

interface AdCardProps {
  ad: Ad;
  className?: string;
}

export function AdCard({ ad, className }: AdCardProps) {
  const t = useTranslations("ads");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const hasMedia = ad.media_type && ad.media_type !== "none";
  const isExternalUrl = ad.action_url?.startsWith("http");

  return (
    <article
      aria-label={ad.title}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card p-5 md:p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <div className="space-y-4">
        {/* Media Container (if available) */}
        {hasMedia && (
          <div className="overflow-hidden rounded-2xl">
            <AdMedia ad={ad} aspectRatio="video" />
          </div>
        )}

        {/* Header / Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
            {ad.media_type === "youtube" || ad.media_type === "video" ? (
              <PlayCircle className="h-3 w-3" />
            ) : (
              <BookOpen className="h-3 w-3" />
            )}
            {ad.placement_name || t("guide")}
          </span>

          {ad.role_name && (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {ad.role_name}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
          {ad.title}
        </h3>

        {/* Content */}
        {ad.content && (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4">
            {ad.content}
          </p>
        )}
      </div>

      {/* Action / CTA Button */}
      {ad.action_url && (
        <div className="mt-5 pt-4 border-t border-border/50">
          {isExternalUrl ? (
            <a
              href={ad.action_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <span>{ad.action_title || t("viewDetails")}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <Link
              href={ad.action_url}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <span>{ad.action_title || t("viewDetails")}</span>
              <ArrowIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

