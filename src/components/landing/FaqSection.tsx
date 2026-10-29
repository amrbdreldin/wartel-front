"use client";

import { FaqBrowser } from "@/components/common/FaqBrowser";
import { useFaqs } from "@/hooks/api/useFaqQueries";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function FaqSection() {
  const t = useTranslations("landing.faq");
  const { data: response, isLoading, isError, refetch } = useFaqs();

  // Compact support callout shown under the category list (desktop) and under the panel (mobile)
  const supportCallout = (
    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 text-center">
      <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
      <p className="text-foreground font-bold mb-1 text-sm">{t("moreQuestions")}</p>
      <p className="text-xs text-muted-foreground mb-3">{t("supportText")}</p>
      <a
        href="https://t.me/+_mhvkTv6CH44MWFk"
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2 bg-background text-primary font-bold border border-primary/20 rounded-full hover:bg-primary hover:text-white transition-colors inline-block text-xs"
      >
        {t("contactBtn")}
      </a>
    </div>
  );

  return (
    <section id="faq" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-heading">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <FaqBrowser
          categories={response?.data || []}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          sidebarFooter={supportCallout}
        />

        <div className="mt-6 lg:hidden">{supportCallout}</div>
      </div>
    </section>
  );
}
