"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Star, Calendar, Sparkles} from "lucide-react";
import type { WerdMedia } from "@/types/student.types";

interface WerdHeroProps {
  werd: {
    title?: string;
    image?: string | null;
    track_name?: string;
    created_at?: string;
    media?: WerdMedia[];
  } | null;
  onImageClick?: (src: string, alt: string) => void;
}

export function WerdHero({ werd }: WerdHeroProps) {
  const t = useTranslations();

  if (!werd) return null;

  const title = werd.title || "";
  const image = werd.image || null;
  const trackName = werd.track_name || "";
  const createdAt = werd.created_at || "";
  const mediaLength = werd.media?.length || 0;

  return (
    <div className="relative bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-20 blur-sm scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-card/70 to-card" />
        </div>
      )}

      <div className="relative z-10 p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          <div className="flex-1 space-y-3 min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {trackName && (
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <Star className="w-3.5 h-3.5" />
                  {trackName}
                </span>
              )}

              {createdAt && (
                <span className="inline-flex items-center gap-1.5 bg-muted/60 text-muted-foreground border border-border/40 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {(() => {
                    try {
                      return new Date(createdAt).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    } catch {
                      return createdAt;
                    }
                  })()}
                </span>
              )}

              {mediaLength > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-success-500/10 text-success-600 dark:text-success-400 border border-success-200/40 dark:border-success-800/40 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {mediaLength} {t("student.werd.media")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
