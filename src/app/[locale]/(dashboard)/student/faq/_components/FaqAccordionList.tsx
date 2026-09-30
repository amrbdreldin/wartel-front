"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import type { FaqItem } from "@/types/faq.types";
import { AlertTriangle, HelpCircle, RefreshCw, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface FaqAccordionListProps {
  faqs: FaqItem[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isSearching: boolean;
  onClearSearch: () => void;
}

export function FaqAccordionList({
  faqs,
  totalCount,
  isLoading,
  isError,
  onRetry,
  isSearching,
  onClearSearch,
}: FaqAccordionListProps) {
  const t = useTranslations("student.faq");

  // Loading Skeletons
  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-card border border-border/50 rounded-2xl p-6 shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-4 rounded-full ms-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">
            {t("errorState")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("needMoreHelpDesc")}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("retry")}</span>
        </button>
      </div>
    );
  }

  // Empty List (API returned no FAQs)
  if (totalCount === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-3xl p-12 text-center space-y-3 shadow-xs">
        <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto" />
        <p className="text-foreground font-bold text-lg">{t("emptyState")}</p>
      </div>
    );
  }

  // Search Returned No Matches
  if (faqs.length === 0 && isSearching) {
    return (
      <div className="bg-card border border-border/60 rounded-3xl p-10 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground mx-auto flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">
            {t("noFaqsFound")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t("noFaqsDesc")}
          </p>
        </div>
        <button
          type="button"
          onClick={onClearSearch}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/90 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>{t("clearSearch")}</span>
        </button>
      </div>
    );
  }

  // Accordion List
  return (
    <Accordion className="w-full space-y-4">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={`student-faq-${faq.id}`}
          className="border border-border/70 rounded-2xl bg-card px-6 transition-all duration-200 hover:border-primary/40 hover:shadow-xs group"
        >
          <AccordionTrigger className="hover:no-underline font-bold text-foreground text-start py-5 text-base md:text-lg transition-colors group-hover:text-primary">
            <span className="pe-4">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-sm md:text-base border-t border-border/40 pt-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
