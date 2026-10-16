"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, Bell, ExternalLink, ImageIcon, ZoomIn } from "lucide-react";
import { useGlobalNotifications, type GlobalNotification } from "@/hooks/api/useGlobalNotifications";
import { NotificationImageModal } from "@/components/common/NotificationImageModal";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================
// Full-page list of the notifications shown in the Topbar bell
// ============================================================
export function GlobalNotificationsPage() {
  const tNotif = useTranslations("notifications");
  const t = useTranslations();
  const { data, isLoading, isError, refetch } = useGlobalNotifications();
  const [previewNotification, setPreviewNotification] = useState<GlobalNotification | null>(null);

  const notifications = data?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 max-w-4xl mx-auto">
      <header className="pb-6 border-b border-border/50">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {tNotif("pageTitle")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-0.5 font-medium">
              {tNotif("pageSubtitle")}
            </p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-card rounded-3xl border border-border/50 p-10 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <p className="font-bold text-foreground">{t("common.errorOccurred")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {t("common.retry")}
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border/50 p-12 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Bell className="w-6 h-6 opacity-50" />
          </div>
          <p className="font-bold text-foreground">{tNotif("noGlobalNotifications")}</p>
          <p className="text-sm text-muted-foreground">{tNotif("noUrgentAlertsDesc")}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 md:p-5 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-primary/10 text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                {notif.message_body?.trim() ? (
                  <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed break-words whitespace-pre-line">
                    {notif.message_body}
                  </p>
                ) : notif.image_url ? (
                  <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    {tNotif("notificationImage")}
                  </p>
                ) : null}

                {notif.image_url && (
                  <button
                    type="button"
                    onClick={() => setPreviewNotification(notif)}
                    aria-label={tNotif("viewFullImage")}
                    className="relative group block w-full max-w-md overflow-hidden rounded-xl border border-border/70 bg-muted/30 cursor-pointer hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={notif.image_url}
                      alt={notif.message_body || tNotif("notificationImage")}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 start-2 text-xs font-bold text-white bg-black/50 rounded-full px-2.5 py-1 flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" />
                      {tNotif("clickToEnlarge")}
                    </span>
                  </button>
                )}

                {notif.url && (
                  <a
                    href={notif.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {tNotif("openAttachedLink")}
                  </a>
                )}

                <p className="text-xs text-muted-foreground font-sans">{notif.created_at}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {previewNotification && (
        <NotificationImageModal
          notification={previewNotification}
          open={!!previewNotification}
          onOpenChange={(open) => {
            if (!open) setPreviewNotification(null);
          }}
        />
      )}
    </div>
  );
}
