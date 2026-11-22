"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AdMedia } from "./AdMedia";
import { AdActionLink } from "./AdActionLink";
import { dismissAd, getSafeHref, hasAdMedia } from "./ad-utils";

interface AdPopupProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Popup announcement built on the shared Dialog primitive
 * (focus trap, ESC handling, scroll lock and focus restore come for free).
 */
export function AdPopup({ ad, isOpen, onClose }: AdPopupProps) {
  const t = useTranslations("ads");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!ad) return null;

  const mediaUrl = ad.media_type === "image" ? getSafeHref(ad.media_url) : null;
  const isImageAd = Boolean(mediaUrl);

  const handleClose = () => {
    setIsLightboxOpen(false);
    dismissAd(ad.id);
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && !isLightboxOpen) handleClose();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={cn(
            "flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card p-0 text-card-foreground shadow-2xl sm:rounded-3xl",
            isImageAd
              ? "w-fit min-w-[min(100%,20rem)] max-w-[calc(100vw-1.5rem)] sm:min-w-[24rem] sm:max-w-[min(92vw,56rem)]"
              : "sm:max-w-lg"
          )}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("close")}
            className="absolute top-3 end-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:top-4 sm:end-4"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          {hasAdMedia(ad) && (
            <div className={cn("shrink-0", isImageAd ? "bg-muted/20" : "bg-black")}>
              <AdMedia
                ad={ad}
                aspectRatio={isImageAd ? "auto" : "video"}
                imageFit={isImageAd ? "contain" : "cover"}
                imageClassName={
                  isImageAd
                    ? "mx-auto block max-h-[60dvh] w-auto max-w-full object-contain sm:max-h-[65dvh]"
                    : undefined
                }
                onImageClick={isImageAd ? () => setIsLightboxOpen(true) : undefined}
                className="rounded-none"
              />
            </div>
          )}

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:space-y-4 sm:p-6">
            <DialogTitle className="text-lg font-bold leading-snug text-foreground sm:text-xl">
              {ad.title}
            </DialogTitle>

            {ad.content && (
              <DialogDescription className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                {ad.content}
              </DialogDescription>
            )}
          </div>

          <div className="flex shrink-0 flex-col-reverse items-center justify-end gap-3 border-t border-border/50 bg-muted/20 p-4 sm:flex-row sm:p-6">
            <button
              type="button"
              onClick={handleClose}
              className="min-h-[44px] w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-auto"
            >
              {t("dismiss")}
            </button>

            {ad.action_url && (
              <AdActionLink
                url={ad.action_url}
                label={ad.action_title || t("viewDetails")}
                onClick={handleClose}
                className="min-h-[44px] w-full px-6 py-2.5 shadow-md sm:w-auto"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isImageAd && mediaUrl && (
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent
            showCloseButton={false}
            overlayClassName="bg-black/85 backdrop-blur-sm"
            className="flex h-[95dvh] w-[95vw] max-w-[95vw] flex-col items-center justify-center gap-0 border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[95vw]"
          >
            <DialogTitle className="sr-only">{ad.title}</DialogTitle>
            <DialogDescription className="sr-only">{t("viewFullImage")}</DialogDescription>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label={t("close")}
              className="absolute top-2 end-2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div
              className="flex h-full w-full items-center justify-center overflow-auto p-2 sm:p-6"
              onClick={() => setIsLightboxOpen(false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl}
                alt={ad.title}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
