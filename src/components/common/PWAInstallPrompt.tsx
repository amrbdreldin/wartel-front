"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/** Chromium-only install prompt event (not in lib.dom yet) */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
}

const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const noopSubscribe = () => () => {};

/** Show the prompt unless the app is installed or it was dismissed in the last 12 hours */
function isInstallPromptEligible(): boolean {
  // Check if app is already running in standalone mode (installed)
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone
    || document.referrer.includes("android-app://");
  if (isStandalone) return false;

  // Check if dismissed recently (within 12 hours)
  const dismissedTime = localStorage.getItem("pwa_install_dismissed");
  if (dismissedTime && Date.now() - Number(dismissedTime) < TWELVE_HOURS) return false;

  // Show by default for any user who hasn't installed/refused recently
  return true;
}

export function PWAInstallPrompt() {
  const t = useTranslations("common.pwa");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isEligible = useSyncExternalStore(noopSubscribe, isInstallPromptEligible, () => false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isVisible = isEligible && !isDismissed;

  useEffect(() => {
    if (!isEligible) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar on mobile
      e.preventDefault();
      // Store the event to trigger it later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isEligible]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA Install Choice Outcome: ${outcome}`);
      if (outcome === "dismissed") {
        localStorage.setItem("pwa_install_dismissed", Date.now().toString());
      }
      setDeferredPrompt(null);
      setIsDismissed(true);
    } else {
      // Fallback instructions for browsers that don't support beforeinstallprompt (e.g., iOS Safari)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        toast.info(t("iosInstruction"));
      } else {
        toast.info(t("fallbackInstruction"));
      }
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Don't show it again for 12 hours
    localStorage.setItem("pwa_install_dismissed", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-44 md:bottom-24 start-6 end-6 md:start-auto md:end-6 md:max-w-sm z-50 p-4 bg-card border border-border/60 rounded-2xl shadow-2xl backdrop-blur-md bg-opacity-95 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
          <Download className="h-5 w-5 animate-pulse" />
        </div>
        <div className="text-start">
          <p className="font-bold text-sm text-foreground">{t("title")}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t("desc")}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button onClick={handleInstallClick} size="sm" className="rounded-xl font-bold bg-primary text-white hover:opacity-90 text-xs px-3 py-1.5 h-8">
          {t("install")}
        </Button>
        <button onClick={handleDismiss} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
