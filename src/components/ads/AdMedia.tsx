"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { getSafeHref, getYoutubeEmbedUrl } from "./ad-utils";

// Re-exported for backwards compatibility with existing imports
export { getYoutubeEmbedUrl } from "./ad-utils";

interface AdMediaProps {
  ad: Ad;
  className?: string;
  aspectRatio?: "video" | "square" | "auto" | "banner";
}

const ASPECT_CLASSES: Record<NonNullable<AdMediaProps["aspectRatio"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  banner: "aspect-[21/9]",
  auto: "aspect-auto",
};

export function AdMedia({ ad, className, aspectRatio = "video" }: AdMediaProps) {
  const t = useTranslations("ads");
  const [imageError, setImageError] = useState(false);

  const wrapperClass = (extra: string) =>
    cn("relative w-full overflow-hidden rounded-2xl", ASPECT_CLASSES[aspectRatio], extra, className);

  if (ad.media_type === "youtube") {
    const embedUrl = getYoutubeEmbedUrl(ad);
    if (!embedUrl) return null;

    return (
      <div className={wrapperClass("bg-black shadow-inner")}>
        <iframe
          src={embedUrl}
          title={ad.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  const mediaUrl = getSafeHref(ad.media_url);
  if (!mediaUrl) return null;

  if (ad.media_type === "video") {
    return (
      <div className={wrapperClass("bg-black shadow-inner")}>
        <video
          src={mediaUrl}
          controls
          playsInline
          preload="metadata"
          aria-label={ad.title}
          className="h-full w-full bg-black object-contain"
        >
          {t("videoNotSupported")}
        </video>
      </div>
    );
  }

  if (ad.media_type === "image" && !imageError) {
    return (
      <div className={wrapperClass("bg-muted/40")}>
        {/* Remote, admin-provided URLs of unknown host – next/image would need every host whitelisted */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt={ad.title}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 motion-safe:hover:scale-105"
        />
      </div>
    );
  }

  return null;
}
