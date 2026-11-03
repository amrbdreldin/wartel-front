"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { X, ExternalLink, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Ad } from "@/types/ad.types";
import { AdMedia } from "./AdMedia";

interface AdPopupProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdPopup({ ad, isOpen, onClose }: AdPopupProps) {
  const t = useTranslations("ads");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleClose = useCallback(() => {
    if (ad) {
      sessionStorage.setItem(`wartel_dismissed_ad_${ad.id}`, "1");
    }
    onClose();
  }, [ad, onClose]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !ad) return null;

  const hasMedia = ad.media_type && ad.media_type !== "none";
  const isExternalUrl = ad.action_url?.startsWith("http");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-popup-title"
      aria-describedby={ad.content ? "ad-popup-desc" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border/70 bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={t("close")}
          className="absolute top-4 end-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Media */}
        {hasMedia && (
          <div className="shrink-0 bg-black">
            <AdMedia ad={ad} aspectRatio="video" className="rounded-none" />
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{ad.placement_name || t("announcement")}</span>
          </div>

          <h3
            id="ad-popup-title"
            className="text-xl font-bold text-foreground leading-snug"
          >
            {ad.title}
          </h3>

          {ad.content && (
            <p
              id="ad-popup-desc"
              className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line"
            >
              {ad.content}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-border/50 p-4 sm:p-6 bg-muted/20">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {t("dismiss")}
          </button>

          {ad.action_url && (
            <div className="w-full sm:w-auto">
              {isExternalUrl ? (
                <a
                  href={ad.action_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <span>{ad.action_title || t("viewDetails")}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={ad.action_url}
                  onClick={handleClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <span>{ad.action_title || t("viewDetails")}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

