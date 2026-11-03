"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { AdMedia } from "./AdMedia";
import { AdActionLink } from "./AdActionLink";
import { dismissAd, hasAdMedia, useIsAdDismissed } from "./ad-utils";

interface AdHeaderProps {
  ad: Ad;
  className?: string;
  onDismiss?: (adId: number) => void;
}

export function AdHeader({ ad, className, onDismiss }: AdHeaderProps) {
  const t = useTranslations("ads");
  const isDismissed = useIsAdDismissed(ad.id);

  if (isDismissed) return null;

  const handleDismiss = () => {
    dismissAd(ad.id);
    onDismiss?.(ad.id);
  };

  return (
    <section
      aria-label={ad.title}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-5 md:p-6 shadow-sm transition-all duration-300",
        className
      )}
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-12 -end-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -start-12 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />

      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t("close")}
        className="absolute top-3 end-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-3 pe-8">
          <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">{ad.title}</h2>

          {ad.content && (
            <p className="text-sm md:text-base text-muted-foreground line-clamp-3 leading-relaxed">
              {ad.content}
            </p>
          )}

          {ad.action_url && (
            <div className="pt-2">
              <AdActionLink
                url={ad.action_url}
                label={ad.action_title || t("viewDetails")}
                className="px-5 py-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              />
            </div>
          )}
        </div>

        {hasAdMedia(ad) && (
          <div className="w-full shrink-0 lg:max-w-md">
            <AdMedia ad={ad} aspectRatio="video" className="max-h-60" />
          </div>
        )}
      </div>
    </section>
  );
}
