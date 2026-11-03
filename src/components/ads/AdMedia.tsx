"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { useTranslations } from "next-intl";

interface AdMediaProps {
  ad: Ad;
  className?: string;
  aspectRatio?: "video" | "square" | "auto" | "banner";
}

/**
 * Extracts a safe YouTube embed URL from an ad object.
 */
export function getYoutubeEmbedUrl(ad: Ad): string | null {
  if (ad.youtube_embed_url) {
    try {
      const parsed = new URL(ad.youtube_embed_url);
      if (
        parsed.hostname.includes("youtube.com") ||
        parsed.hostname.includes("youtube-nocookie.com")
      ) {
        return parsed.toString();
      }
    } catch {
      // Fallback to regex parser below
    }
  }

  const rawUrl = ad.youtube_url || ad.media_url || "";
  if (!rawUrl) return null;

  const match = rawUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0`;
  }

  return null;
}

export function AdMedia({ ad, className, aspectRatio = "video" }: AdMediaProps) {
  const t = useTranslations("ads");
  const [imageError, setImageError] = useState(false);

  if (ad.media_type === "none" || !ad.media_type) {
    return null;
  }

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "banner"
      ? "aspect-[21/9]"
      : "aspect-auto";

  // 1. YouTube Player
  if (ad.media_type === "youtube") {
    const embedUrl = getYoutubeEmbedUrl(ad);
    if (!embedUrl) return null;

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-black shadow-inner",
          aspectClass,
          className
        )}
      >
        <iframe
          src={embedUrl}
          title={ad.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  // 2. HTML5 Video
  if (ad.media_type === "video") {
    if (!ad.media_url) return null;

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-black shadow-inner",
          aspectClass,
          className
        )}
      >
        <video
          src={ad.media_url}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain bg-black"
        >
          {t("videoNotSupported")}
        </video>
      </div>
    );
  }

  // 3. Image
  if (ad.media_type === "image") {
    if (!ad.media_url || imageError) return null;

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-muted/40",
          aspectClass,
          className
        )}
      >
        <img
          src={ad.media_url}
          alt={ad.title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  return null;
}

