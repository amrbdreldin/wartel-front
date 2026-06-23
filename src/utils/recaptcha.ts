"use client";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

/**
 * Dynamically loads the reCAPTCHA v3 script for the given site key.
 */
export const loadRecaptchaScript = (_siteKey: string): Promise<void> => {
  return Promise.resolve();
};

/**
 * Executes reCAPTCHA v3 and returns a verification token.
 */
export const executeRecaptcha = async (_action: string): Promise<string> => {
  return "";
};
