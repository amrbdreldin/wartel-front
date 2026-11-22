"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { getSafeHref, getYoutubeEmbedUrl } from "./ad-utils";

// Re-exported for backwards compatibility with existing imports
export { getYoutubeEmbedUrl } from "./ad-utils";

interface AdMediaProps {
  ad: Ad;
  className?: string;
  aspectRatio?: "video" | "square" | "auto" | "banner";
  imageFit?: "cover" | "contain";
  imageClassName?: string;
  onImageClick?: () => void;
}

const ASPECT_CLASSES: Record<NonNullable<AdMediaProps["aspectRatio"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  banner: "aspect-[21/9]",
  auto: "aspect-auto",
};

export function AdMedia({
  ad,
  className,
  aspectRatio = "video",
  imageFit = "cover",
  imageClassName,
  onImageClick,
}: AdMediaProps) {
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
    const imgElement = (
      <>
        {/* Remote, admin-provided URLs of unknown host – next/image would need every host whitelisted */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt={ad.title}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className={cn(
            imageFit === "contain"
              ? "block max-w-full object-contain"
              : "h-full w-full object-cover transition-transform duration-300 motion-safe:hover:scale-105",
            imageClassName
          )}
        />
      </>
    );

    return (
      <div className={wrapperClass("bg-muted/40")}>
        {onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={t("viewFullImage")}
            className="group/media relative block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {imgElement}
            <span className="pointer-events-none absolute bottom-2.5 end-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-sm backdrop-blur-sm transition-transform duration-200 group-hover/media:scale-110">
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        ) : (
          imgElement
        )}
      </div>
    );
  }

  return null;
}
