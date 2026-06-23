"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function FaqSection() {
  const t = useTranslations("landing.faq");

  return (
    <section id="faq" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">{t("subtitle")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-heading">{t("title")}</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <Accordion className="w-full space-y-4">
          <AccordionItem value="item-1" className="border border-border/50 rounded-2xl bg-muted/30 px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground text-start py-5">
              {t("q1")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
              {t("a1")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-border/50 rounded-2xl bg-muted/30 px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground text-start py-5">
              {t("q2")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
              {t("a2")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-border/50 rounded-2xl bg-muted/30 px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground text-start py-5">
              {t("q3")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
              {t("a3")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-border/50 rounded-2xl bg-muted/30 px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground text-start py-5">
              {t("q4")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
              {t("a4")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
