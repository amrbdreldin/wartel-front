"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { Ad } from "@/types/ad.types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AdMedia } from "./AdMedia";
import { AdActionLink } from "./AdActionLink";
import { dismissAd, hasAdMedia } from "./ad-utils";

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

  if (!ad) return null;

  const handleClose = () => {
    dismissAd(ad.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-3xl border border-border/70 bg-card p-0 text-card-foreground shadow-2xl sm:max-w-lg"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label={t("close")}
          className="absolute top-4 end-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {hasAdMedia(ad) && (
          <div className="shrink-0 bg-black">
            <AdMedia ad={ad} aspectRatio="video" className="rounded-none" />
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <DialogTitle className="text-xl font-bold leading-snug text-foreground">{ad.title}</DialogTitle>

          {ad.content && (
            <DialogDescription className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
              {ad.content}
            </DialogDescription>
          )}
        </div>

        <div className="flex flex-col-reverse items-center justify-end gap-3 border-t border-border/50 bg-muted/20 p-4 sm:flex-row sm:p-6">
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-auto"
          >
            {t("dismiss")}
          </button>

          {ad.action_url && (
            <AdActionLink
              url={ad.action_url}
              label={ad.action_title || t("viewDetails")}
              onClick={handleClose}
              className="w-full px-6 py-2.5 shadow-md sm:w-auto"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
