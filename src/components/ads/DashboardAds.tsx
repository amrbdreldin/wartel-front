"use client";

import { useState, useEffect } from "react";
import { useAdsQuery, getAdsByPlacement } from "@/hooks/api/useAdsQueries";
import type { Ad, AdPlacement } from "@/types/ad.types";
import { AdHeader } from "./AdHeader";
import { AdCard } from "./AdCard";
import { AdPopup } from "./AdPopup";
import { cn } from "@/lib/utils";

interface DashboardAdsProps {
  /**
   * Specific placement to render. If omitted, renders all active placements.
   */
  placement?: AdPlacement;
  /**
   * Explicit role ID override. If omitted, automatically determined from user or route.
   */
  roleId?: number | string | null;
  /**
   * Container className.
   */
  className?: string;
  /**
   * Grid layout className when rendering multiple cards (default: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6").
   */
  cardGridClassName?: string;
}

export function DashboardAds({
  placement,
  roleId,
  className,
  cardGridClassName,
}: DashboardAdsProps) {
  const { data: ads = [], isLoading } = useAdsQuery(roleId);

  // Filter ads by placement
  const headerAds = getAdsByPlacement(ads, "header");
  const cardAds = getAdsByPlacement(ads, "card");
  const popupAds = getAdsByPlacement(ads, "popup");

  // Popup state management
  const [activePopupAd, setActivePopupAd] = useState<Ad | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (popupAds.length > 0) {
      // Find the highest priority popup ad that has not been dismissed yet
      const unDismissed = popupAds.find(
        (ad) => !sessionStorage.getItem(`wartel_dismissed_ad_${ad.id}`)
      );
      if (unDismissed) {
        setActivePopupAd(unDismissed);
        setIsPopupOpen(true);
      }
    }
  }, [popupAds]);

  if (isLoading || ads.length === 0) {
    return null;
  }

  // 1. Render specific placement if requested
  if (placement === "header") {
    if (headerAds.length === 0) return null;
    return (
      <div className={cn("space-y-4", className)}>
        {headerAds.map((ad) => (
          <AdHeader key={ad.id} ad={ad} />
        ))}
      </div>
    );
  }

  if (placement === "card") {
    if (cardAds.length === 0) return null;
    return (
      <div
        className={cn(
          cardGridClassName || "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
          className
        )}
      >
        {cardAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    );
  }

  if (placement === "popup") {
    return (
      <AdPopup
        ad={activePopupAd}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    );
  }

  // 2. Default: render all placements
  return (
    <div className={cn("space-y-8", className)}>
      {/* Header Ads */}
      {headerAds.length > 0 && (
        <div className="space-y-4">
          {headerAds.map((ad) => (
            <AdHeader key={ad.id} ad={ad} />
          ))}
        </div>
      )}

      {/* Card Ads */}
      {cardAds.length > 0 && (
        <div
          className={
            cardGridClassName || "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          }
        >
          {cardAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}

      {/* Popup Ad Modal */}
      <AdPopup
        ad={activePopupAd}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}

