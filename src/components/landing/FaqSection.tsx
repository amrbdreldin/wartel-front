"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useFaqs } from "@/hooks/api/useFaqQueries";
import { HelpCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function FaqSection() {
  const t = useTranslations("landing.faq");
  const { data: response, isLoading, isError, refetch } = useFaqs();

  const faqs = response?.data || [];

  return (
    <section id="faq" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-heading">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="w-full space-y-4 animate-in fade-in duration-300" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border border-border/50 rounded-2xl bg-muted/20 px-6 py-5 flex items-center justify-between"
              >
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-5 w-5 rounded-full shrink-0 ms-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="text-center p-8 border border-destructive/20 bg-destructive/5 rounded-2xl animate-in fade-in duration-300">
            <p className="text-destructive font-medium mb-3">{t("error")}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t("retry")}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && faqs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-border/40 rounded-2xl bg-muted/10">
            <p>{t("empty")}</p>
          </div>
        )}

        {/* Dynamic Accordion */}
        {!isLoading && !isError && faqs.length > 0 && (
          <Accordion className="w-full space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className="border border-border/50 rounded-2xl bg-muted/30 px-6 transition-colors hover:border-primary/30"
              >
                <AccordionTrigger className="hover:no-underline font-bold text-foreground text-start py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Support Callout */}
        <div className="mt-12 text-center bg-primary/5 p-6 rounded-3xl border border-primary/10 inline-block w-full">
          <HelpCircle className="h-10 w-10 text-primary mx-auto mb-3" />
          <p className="text-foreground font-bold mb-1">{t("moreQuestions")}</p>
          <p className="text-sm text-muted-foreground mb-4">{t("supportText")}</p>
          <a
            href="https://t.me/+_mhvkTv6CH44MWFk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-background text-primary font-bold border border-primary/20 rounded-full hover:bg-primary hover:text-white transition-colors inline-block text-sm"
          >
            {t("contactBtn")}
          </a>
        </div>
      </div>
    </section>
  );
}
