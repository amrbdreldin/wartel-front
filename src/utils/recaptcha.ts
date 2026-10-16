"use client";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// reCAPTCHA v3 is OFF unless NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" (same flag on the
// server in api/proxy), and it also needs NEXT_PUBLIC_RECAPTCHA_SITE_KEY + RECAPTCHA_SECRET_KEY.
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "" : "";

const SCRIPT_ID = "recaptcha-v3-script";
let scriptPromise: Promise<void> | null = null;

/**
 * Dynamically loads the reCAPTCHA v3 script for the given site key (once).
 */
export const loadRecaptchaScript = (siteKey: string): Promise<void> => {
  if (typeof window === "undefined" || !siteKey || !RECAPTCHA_SITE_KEY) return Promise.resolve();
  if (window.grecaptcha?.execute) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => (window.grecaptcha ? window.grecaptcha.ready(() => resolve()) : resolve());
    script.onerror = () => {
      console.error("Failed to load reCAPTCHA v3 script");
      scriptPromise = null; // allow a retry on the next attempt
      resolve();
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Executes reCAPTCHA v3 and returns a verification token ("" when disabled or unavailable).
 */
export const executeRecaptcha = async (action: string): Promise<string> => {
  const siteKey = RECAPTCHA_SITE_KEY;
  if (!siteKey) return "";

  await loadRecaptchaScript(siteKey);
  if (!window.grecaptcha?.execute) return "";

  try {
    return await window.grecaptcha.execute(siteKey, { action });
  } catch (error) {
    console.error("Error executing reCAPTCHA v3:", error);
    return "";
  }
};
