"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Megaphone } from "lucide-react";
import { useAdsQuery, getAdsByPlacement } from "@/hooks/api/useAdsQueries";
import { AdHeader } from "@/components/ads/AdHeader";
import { AdCard } from "@/components/ads/AdCard";
import { AdPopup } from "@/components/ads/AdPopup";
import { useVisibleAds } from "@/components/ads/ad-utils";

export function PublicAdsSection() {
  const t = useTranslations("landing.ads");
  const { data: ads } = useAdsQuery(null);

  const byPlacement = useMemo(
    () => ({
      header: getAdsByPlacement(ads, "header"),
      card: getAdsByPlacement(ads, "card"),
      popup: getAdsByPlacement(ads, "popup"),
    }),
    [ads]
  );

  const visibleHeaderAds = useVisibleAds(byPlacement.header);
  const [activePopup = null] = useVisibleAds(byPlacement.popup);

  const hasHeader = visibleHeaderAds.length > 0;
  const hasCards = byPlacement.card.length > 0;
  const hasPopup = activePopup !== null;

  if (!hasHeader && !hasCards && !hasPopup) {
    return null;
  }

  return (
    <section
      id="announcements"
      className="relative py-12 md:py-16 bg-gradient-to-b from-primary/[0.04] via-background to-background border-y border-primary/10"
    >
      <div className="container mx-auto px-4 md:px-8 space-y-8">
        {(hasHeader || hasCards) && (
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
              <Megaphone className="h-4 w-4" />
              <span>{t("badge")}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-foreground">
              {t("title")}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("subtitle")}
            </p>
          </div>
        )}

        {hasHeader && (
          <div className="space-y-4">
            {visibleHeaderAds.map((ad) => (
              <AdHeader key={ad.id} ad={ad} />
            ))}
          </div>
        )}

        {hasCards && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {byPlacement.card.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}

        <AdPopup ad={activePopup} isOpen={hasPopup} onClose={() => {}} />
      </div>
    </section>
  );
}
