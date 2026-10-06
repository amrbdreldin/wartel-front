"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Bell,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export interface NotificationModalData {
  id?: number | string;
  message_body?: string;
  image_url?: string | null;
  created_at?: string;
  url?: string | null;
}

interface NotificationImageModalProps {
  notification: NotificationModalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationImageModal({
  notification,
  open,
  onOpenChange,
}: NotificationImageModalProps) {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");

  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [prevKey, setPrevKey] = useState<string | null>(null);

  // Reset state during render whenever modal opens with a new notification
  const currentKey = open ? `${notification?.id}_${notification?.image_url}` : null;
  if (open && currentKey !== prevKey) {
    setPrevKey(currentKey);
    setZoom(1);
    setIsLoading(true);
    setHasError(false);
  }

  if (!notification || !notification.image_url) {
    return null;
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoom(1);

  const titleText = notification.message_body?.trim()
    ? notification.message_body
    : t("notificationImage");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-black/85 backdrop-blur-md"
        className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card text-card-foreground shadow-2xl"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border/60 bg-muted/30 gap-3 m-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-sm sm:text-base font-bold text-foreground truncate">
                {titleText}
              </DialogTitle>
              {notification.created_at && (
                <DialogDescription className="text-[11px] font-sans text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                  <span>{notification.created_at}</span>
                </DialogDescription>
              )}
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1 shrink-0 me-7 sm:me-8">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleZoomOut}
              disabled={zoom <= 1 || isLoading || hasError}
              aria-label={t("zoomOut")}
              title={t("zoomOut")}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <span className="text-[11px] font-mono font-bold text-muted-foreground px-1 select-none hidden sm:inline-block">
              {Math.round(zoom * 100)}%
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3 || isLoading || hasError}
              aria-label={t("zoomIn")}
              title={t("zoomIn")}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            {zoom > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleResetZoom}
                aria-label={t("resetZoom")}
                title={t("resetZoom")}
                className="h-8 w-8 rounded-lg cursor-pointer text-primary"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}

            <a
              href={notification.image_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("openImageInNewTab")}
              title={t("openImageInNewTab")}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "h-8 w-8 rounded-lg cursor-pointer"
              )}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </DialogHeader>

        {/* Image Preview Canvas */}
        <div className="relative flex-1 min-h-[260px] max-h-[58vh] sm:max-h-[64vh] flex items-center justify-center p-3 sm:p-6 bg-muted/20 dark:bg-black/40 overflow-auto select-none">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/50 backdrop-blur-xs z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground font-medium">
                {t("loadingAlerts")}
              </span>
            </div>
          )}

          {hasError ? (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm gap-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-1">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-foreground">
                {t("imageLoadError")}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                className="mt-2 text-xs"
              >
                {tCommon("retry") || "إعادة المحاولة"}
              </Button>
            </div>
          ) : (
            <div
              className={`transition-transform duration-200 ease-out flex items-center justify-center ${
                zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={notification.image_url}
                alt={notification.message_body || t("notificationImage")}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className="max-h-[54vh] sm:max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                loading="eager"
              />
            </div>
          )}
        </div>

        {/* Footer with Details & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-border/60 bg-card">
          <div className="flex-1 min-w-0">
            {notification.message_body?.trim() ? (
              <p className="text-xs sm:text-sm font-semibold text-foreground/90 leading-relaxed break-words">
                {notification.message_body}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2 shrink-0">
            {notification.url && (
              <a
                href={notification.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "gap-1.5 text-xs font-bold rounded-xl cursor-pointer"
                )}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t("openAttachedLink")}</span>
              </a>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold rounded-xl cursor-pointer"
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
