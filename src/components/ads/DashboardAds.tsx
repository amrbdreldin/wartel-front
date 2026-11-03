"use client";

import { useMemo } from "react";
import { useAdsQuery, getAdsByPlacement } from "@/hooks/api/useAdsQueries";
import type { Ad, AdPlacement } from "@/types/ad.types";
import { cn } from "@/lib/utils";
import { AdHeader } from "./AdHeader";
import { AdCard } from "./AdCard";
import { AdPopup } from "./AdPopup";
import { useVisibleAds } from "./ad-utils";

const DEFAULT_CARD_GRID = "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3";

interface DashboardAdsProps {
  /** Specific placement to render. If omitted, renders all active placements. */
  placement?: AdPlacement;
  /** Explicit role ID override. If omitted, automatically determined from user or route. */
  roleId?: number | string | null;
  /** Container className (only applied when there is something to render). */
  className?: string;
  /** Grid layout className when rendering cards. */
  cardGridClassName?: string;
}

function HeaderAds({ ads, className }: { ads: Ad[]; className?: string }) {
  const visibleAds = useVisibleAds(ads);
  if (visibleAds.length === 0) return null;
  return (
    <div className={cn("space-y-4", className)}>
      {visibleAds.map((ad) => (
        <AdHeader key={ad.id} ad={ad} />
      ))}
    </div>
  );
}

function CardAds({ ads, className }: { ads: Ad[]; className?: string }) {
  if (ads.length === 0) return null;
  return (
    <div className={className}>
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}

/** Shows the highest-priority popup not yet dismissed this session; the next one follows on close. */
function PopupAds({ ads }: { ads: Ad[] }) {
  const [activeAd = null] = useVisibleAds(ads);
  // AdPopup persists the dismissal → the store update selects the next ad automatically
  return <AdPopup ad={activeAd} isOpen={activeAd !== null} onClose={() => {}} />;
}

export function DashboardAds({ placement, roleId, className, cardGridClassName }: DashboardAdsProps) {
  const { data: ads } = useAdsQuery(roleId);

  const byPlacement = useMemo(
    () => ({
      header: getAdsByPlacement(ads, "header"),
      card: getAdsByPlacement(ads, "card"),
      popup: getAdsByPlacement(ads, "popup"),
    }),
    [ads]
  );

  const cardGrid = cardGridClassName || DEFAULT_CARD_GRID;

  switch (placement) {
    case "header":
      return <HeaderAds ads={byPlacement.header} className={className} />;
    case "card":
      return <CardAds ads={byPlacement.card} className={cn(cardGrid, className)} />;
    case "popup":
      return <PopupAds ads={byPlacement.popup} />;
    default:
      if (!ads?.length) return null;
      return (
        <div className={cn("space-y-8", className)}>
          <HeaderAds ads={byPlacement.header} />
          <CardAds ads={byPlacement.card} className={cardGrid} />
          <PopupAds ads={byPlacement.popup} />
        </div>
      );
  }
}
