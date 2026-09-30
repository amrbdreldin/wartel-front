"use client";

import { HelpCircle, MessageSquare, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export function FaqSupportCards() {
  const t = useTranslations("student.faq");
  const locale = useLocale();

  return (
    <div className="space-y-6">
      {/* Need More Help Card */}
      <div className="relative overflow-hidden bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
          <HelpCircle className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-foreground text-base">
            {t("needMoreHelp")}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("needMoreHelpDesc")}
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {/* Telegram Support Button */}
          <a
            href="https://t.me/+_mhvkTv6CH44MWFk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs md:text-sm font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t("contactTelegram")}</span>
          </a>

          {/* Direct Messages Button */}
          <Link
            href={`/${locale}/student/messages`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-xs md:text-sm font-bold hover:bg-muted/80 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>{t("openMessages")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
