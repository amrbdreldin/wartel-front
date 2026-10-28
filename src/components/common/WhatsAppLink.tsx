"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/utils/phone";

interface WhatsAppLinkProps {
  phone: string | undefined | null;
  /** Show the "WhatsApp" text next to the icon (icon-only otherwise) */
  showLabel?: boolean;
  className?: string;
  iconClassName?: string;
}

// Direct wa.me chat link for a phone number. Renders nothing when the number can't be converted.
export function WhatsAppLink({ phone, showLabel = true, className, iconClassName = "h-3.5 w-3.5" }: WhatsAppLinkProps) {
  const t = useTranslations("student");
  const href = getWhatsAppLink(phone);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={t("contactViaWhatsapp")}
      aria-label={t("contactViaWhatsapp")}
      className={cn("bg-success-500/10 text-success-600 hover:bg-success-500/20 transition-colors", className)}
    >
      <MessageCircle className={iconClassName} />
      {showLabel && t("whatsapp")}
    </a>
  );
}
