"use client";

import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types/contact.types";
import { formatThreadDate, getAttachmentUrl } from "@/utils/contactThread";
import { Check, CheckCheck, ExternalLink, Shield, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface ThreadMessageBubbleProps {
  message: ContactMessage;
  onOpenAttachment: (url: string) => void;
}

export function ThreadMessageBubble({ message, onOpenAttachment }: ThreadMessageBubbleProps) {
  const t = useTranslations("contactUs");
  const locale = useLocale();
  const isAdmin = message.is_from_admin;
  const attachmentUrl = getAttachmentUrl(message);

  return (
    <li
      className={cn(
        "flex items-start gap-3 max-w-[85%] sm:max-w-[75%]",
        isAdmin ? "me-auto" : "ms-auto flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-1",
          isAdmin
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground border border-border"
        )}
        aria-hidden="true"
      >
        {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "flex flex-col space-y-1.5 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm shadow-2xs border text-foreground min-w-0",
          isAdmin
            ? "bg-primary/5 border-primary/20 rounded-ss-xs"
            : "bg-card border-border rounded-se-xs"
        )}
      >
        <div className="flex items-center justify-between gap-2 text-[11px] pb-1 border-b border-border/40">
          <span className="font-bold text-foreground">
            {isAdmin ? message.sender_name || t("adminSupport") : t("you")}
          </span>
          {isAdmin && (
            <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-[10px]">
              {t("supportStaff")}
            </span>
          )}
        </div>

        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>

        {attachmentUrl && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenAttachment(attachmentUrl)}
              className="relative block w-48 h-32 rounded-xl overflow-hidden border border-border bg-background hover:opacity-90 transition-opacity group focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label={t("viewAttachment")}
            >
              <Image
                src={attachmentUrl}
                alt={t("attachmentAlt")}
                fill
                sizes="192px"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                {t("viewAttachment")}
              </span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-muted-foreground">
          <time dateTime={message.created_at}>{formatThreadDate(message.created_at, locale, true)}</time>
          {!isAdmin && (
            <span className="inline-flex items-center gap-1">
              {message.read_at ? (
                <CheckCheck className="w-3 h-3 text-primary" aria-hidden="true" />
              ) : (
                <Check className="w-3 h-3" aria-hidden="true" />
              )}
              {message.read_at ? t("read") : t("unread")}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
