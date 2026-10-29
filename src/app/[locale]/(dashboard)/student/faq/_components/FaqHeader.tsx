"use client";

import { BookOpen, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FaqHeaderProps {
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
}

export function FaqHeader({ totalCount, isLoading, isError }: FaqHeaderProps) {
  const t = useTranslations("student.faq");

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 px-5 py-4 md:px-6 md:py-5">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="hidden sm:flex shrink-0 w-11 h-11 rounded-2xl bg-primary/10 text-primary items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black text-foreground font-heading tracking-tight">
              {t("title")}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        {!isLoading && !isError && totalCount > 0 && (
          <div className="shrink-0 self-start sm:self-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-4 py-2 shadow-xs flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <p className="text-[0.7rem] text-muted-foreground font-medium">
                {t("totalFaqs")}
              </p>
              <p className="text-base font-black text-foreground leading-tight">
                {totalCount}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Decorative background watermark */}
      <HelpCircle
        className="absolute -bottom-10 -end-6 w-40 h-40 text-primary/5 pointer-events-none stroke-[1]"
        aria-hidden="true"
      />
    </header>
  );
}
