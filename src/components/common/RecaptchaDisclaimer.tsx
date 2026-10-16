"use client";

import { cn } from "@/lib/utils";
import { RECAPTCHA_SITE_KEY } from "@/utils/recaptcha";
import { useTranslations } from "next-intl";

// Required by Google whenever the reCAPTCHA badge is hidden (see globals.css).
// Renders nothing while reCAPTCHA is disabled.
export function RecaptchaDisclaimer({ className }: { className?: string }) {
  const t = useTranslations("auth");
  if (!RECAPTCHA_SITE_KEY) return null;

  return (
    <p className={cn("text-[10px] text-muted-foreground text-center leading-relaxed max-w-xs mx-auto", className)}>
      {t.rich("recaptchaDisclaimer", {
        privacyLink: (chunks) => <PolicyLink href="https://policies.google.com/privacy">{chunks}</PolicyLink>,
        termsLink: (chunks) => <PolicyLink href="https://policies.google.com/terms">{chunks}</PolicyLink>,
      })}
    </p>
  );
}

function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
      {children}
    </a>
  );
}
