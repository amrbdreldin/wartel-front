"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { AdMedia } from "./AdMedia";
import { AdActionLink } from "./AdActionLink";
import { hasAdMedia } from "./ad-utils";

interface AdCardProps {
  ad: Ad;
  className?: string;
}

export function AdCard({ ad, className }: AdCardProps) {
  const t = useTranslations("ads");

  return (
    <article
      aria-label={ad.title}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card p-5 md:p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <div className="space-y-4">
        {hasAdMedia(ad) && <AdMedia ad={ad} aspectRatio="video" />}

        <h3 className="text-base md:text-lg font-bold text-foreground leading-snug transition-colors group-hover:text-primary">
          {ad.title}
        </h3>

        {ad.content && (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4">
            {ad.content}
          </p>
        )}
      </div>

      {ad.action_url && (
        <div className="mt-5 border-t border-border/50 pt-4">
          <AdActionLink
            url={ad.action_url}
            label={ad.action_title || t("viewDetails")}
            className="w-full px-4 py-2.5 shadow-sm hover:shadow"
          />
        </div>
      )}
    </article>
  );
}
