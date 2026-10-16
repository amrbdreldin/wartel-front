"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

const noopSubscribe = () => () => {};

export function CookieConsentBanner() {
  const t = useTranslations("common");
  // Show the banner until the user has made a selection (read from the cookie on the client only)
  const hasConsentChoice = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(Cookies.get("user_cookie_consent")),
    () => true
  );
  const [isClosed, setIsClosed] = useState(false);
  const showBanner = !hasConsentChoice && !isClosed;

  useEffect(() => {
    // Previously granted: re-apply the consent update for Google Tag Manager / GA
    const consent = Cookies.get("user_cookie_consent");
    if (consent === "granted") {
      // Programmatically trigger Google Tag Manager / Google Analytics v2 Consent Update on mount
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          ad_storage: "granted",
          analytics_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
      }
    }
  }, []);

  const handleDecline = () => {
    // Save rejection state for 1 year
    Cookies.set("user_cookie_consent", "denied", { expires: 365, path: "/" });
    setIsClosed(true);

    // Keep GA/GTM blocked
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  };

  const handleAccept = () => {
    // Save consent for 1 year
    Cookies.set("user_cookie_consent", "granted", { expires: 365, path: "/" });
    setIsClosed(true);

    // Programmatically trigger Google Tag Manager / Google Analytics v2 Consent Update
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-28 sm:bottom-6 start-6 end-6 sm:end-auto sm:max-w-sm z-50 p-6 bg-card border border-border/50 rounded-3xl shadow-xl backdrop-blur-md bg-opacity-95 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h3 className="font-semibold text-lg text-start mb-2 text-foreground">
        {t("cookieConsent.title")}
      </h3>
      <p className="text-sm text-muted-foreground text-start mb-4 leading-relaxed">
        {t("cookieConsent.desc")}
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleDecline}
          className="h-9 px-4 rounded-xl text-sm font-medium hover:bg-muted text-muted-foreground transition-all"
        >
          {t("cookieConsent.decline")}
        </button>
        <button
          onClick={handleAccept}
          className="h-9 px-5 bg-primary text-white text-sm font-medium rounded-xl hover:opacity-90 shadow-sm transition-all"
        >
          {t("cookieConsent.accept")}
        </button>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
