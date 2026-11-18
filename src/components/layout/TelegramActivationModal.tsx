"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { RefreshCw, BellRing } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TelegramBotActivationCard,
  TelegramIcon,
} from "@/components/common/TelegramBotActivationCard";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { UserRole } from "@/types/enums";

/**
 * Prominent dashboard popup for students who do not yet have a Telegram chat ID linked.
 * Appears on every dashboard page entry until the student activates the bot.
 */
export function TelegramActivationModal() {
  const tNotifications = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  const [open, setOpen] = useState(false);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const isStudent =
    isAuthenticated &&
    !!user &&
    (user.role === UserRole.STUDENT ||
      String(user.role_id) === "1" ||
      String(user.role_id) === "3");

  const checkTelegramStatus = useCallback(
    async (options?: { showFeedback?: boolean }) => {
      if (!isStudent) return;

      setIsChecking(true);
      try {
        const userData = await authService.getAuthUser();
        if (!userData) return;

        if (userData.has_telegram_chat_id === false) {
          setTrackingUrl(userData.telegram_tracking_url ?? null);
          setOpen(true);
          if (options?.showFeedback) {
            toast.info(tNotifications("telegramModalNotLinkedYet"));
          }
        } else if (userData.has_telegram_chat_id === true) {
          setOpen((wasOpen) => {
            if (wasOpen) {
              toast.success(tNotifications("telegramModalVerified"));
            }
            return false;
          });
        }
      } catch {
        // Non-blocking background check
      } finally {
        setIsChecking(false);
      }
    },
    [isStudent, tNotifications]
  );

  // Re-check whenever the student navigates to any dashboard page
  useEffect(() => {
    if (!isStudent) {
      setOpen(false);
      return;
    }
    checkTelegramStatus();
  }, [isStudent, pathname, checkTelegramStatus]);

  // Auto-verify when the student returns to the browser tab after tapping Start in Telegram
  useEffect(() => {
    if (!open || !isStudent) return;

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        checkTelegramStatus();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [open, isStudent, checkTelegramStatus]);

  if (!isStudent) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg rounded-2xl sm:rounded-3xl border border-sky-500/25 shadow-2xl p-5 sm:p-6">
        <DialogHeader className="text-center items-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0088cc]/15 text-[#0088cc] flex items-center justify-center ring-4 ring-[#0088cc]/10">
              <TelegramIcon className="w-8 h-8" />
            </div>
            <div className="absolute -top-1.5 -end-1.5 bg-warning-500 text-white rounded-full p-1.5 shadow-md">
              <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground text-center">
            {tNotifications("telegramModalTitle")}
          </DialogTitle>
        </DialogHeader>

        <TelegramBotActivationCard
          telegramTrackingUrl={trackingUrl}
          description={tNotifications("telegramModalDesc")}
          warning={tNotifications("telegramModalWarning")}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-1">
          <Button
            type="button"
            onClick={() => checkTelegramStatus({ showFeedback: true })}
            disabled={isChecking}
            className="flex-1 min-h-[44px] rounded-xl font-bold text-sm gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{tNotifications("telegramModalVerify")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="min-h-[44px] rounded-xl font-semibold text-sm"
          >
            {tCommon("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
