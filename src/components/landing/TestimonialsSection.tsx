"use client";

import { Star, StarHalf } from "lucide-react";
import { useTranslations } from "next-intl";

export function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">{t("subtitle")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-heading">{t("title")}</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-8">
          <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm relative mt-6 hover:-translate-y-1 transition-transform cursor-default">
            <div className="absolute -top-8 end-8 w-16 h-16 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl font-black shadow-sm">ع</div>
            <div className="flex gap-1 text-warning-400 mb-4 mt-2">
              <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium mb-6 italic">"{t("t1Text")}"</p>
            <hr className="border-border/60 mb-4" />
            <h5 className="font-bold text-foreground">{t("t1Name")}</h5>
            <p className="text-xs text-muted-foreground font-bold">{t("t1Role")}</p>
          </div>

          <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm relative mt-6 hover:-translate-y-1 transition-transform cursor-default">
            <div className="absolute -top-8 end-8 w-16 h-16 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl font-black shadow-sm">م</div>
            <div className="flex gap-1 text-warning-400 mb-4 mt-2">
              <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium mb-6 italic">"{t("t2Text")}"</p>
            <hr className="border-border/60 mb-4" />
            <h5 className="font-bold text-foreground">{t("t2Name")}</h5>
            <p className="text-xs text-muted-foreground font-bold">{t("t2Role")}</p>
          </div>

          <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm relative mt-6 hover:-translate-y-1 transition-transform cursor-default">
            <div className="absolute -top-8 end-8 w-16 h-16 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl font-black shadow-sm">ن</div>
            <div className="flex gap-1 text-warning-400 mb-4 mt-2">
              <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><div className="relative"><StarHalf className="h-4 w-4 fill-current absolute top-0 start-0" /><Star className="h-4 w-4 fill-current opacity-30" /></div>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium mb-6 italic">"{t("t3Text")}"</p>
            <hr className="border-border/60 mb-4" />
            <h5 className="font-bold text-foreground">{t("t3Name")}</h5>
            <p className="text-xs text-muted-foreground font-bold">{t("t3Role")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
