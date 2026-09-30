"use client";

import { BookOpen, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FaqHeaderProps {
  totalCount: number;
  filteredCount: number;
  isSearching: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function FaqHeader({
  totalCount,
  filteredCount,
  isSearching,
  isLoading,
  isError,
}: FaqHeaderProps) {
  const t = useTranslations("student.faq");

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t("title")}</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground font-heading tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Counter Badge */}
        {!isLoading && !isError && totalCount > 0 && (
          <div className="shrink-0 self-start md:self-auto bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {isSearching ? t("searchResultsCount") : t("totalFaqs")}
              </p>
              <p className="text-lg font-black text-foreground">
                {isSearching ? `${filteredCount} / ${totalCount}` : totalCount}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Decorative background watermark */}
      <HelpCircle
        className="absolute -bottom-8 -end-8 w-64 h-64 text-primary/5 pointer-events-none stroke-[1]"
        aria-hidden="true"
      />
    </header>
  );
}
