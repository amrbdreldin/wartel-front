"use client";

import { HeartPulse, ShieldCheck, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export function AboutSection() {
  const t = useTranslations("landing.about");

  return (
    <section id="about" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">{t("subtitle")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 font-heading">{t("title")}</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("desc")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-background text-primary flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
              <HeartPulse className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{t("value1Title")}</h3>
            <p className="text-muted-foreground">{t("value1Desc")}</p>
          </div>
          <div className="p-8 rounded-3xl bg-secondary/10 border border-secondary/20 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-background text-secondary flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{t("value2Title")}</h3>
            <p className="text-muted-foreground">{t("value2Desc")}</p>
          </div>
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-background text-primary flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{t("value3Title")}</h3>
            <p className="text-muted-foreground">{t("value3Desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
