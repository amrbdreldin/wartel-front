"use client";

import { Award, Mic, UserPlus, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function TimelineSection() {
  const t = useTranslations("landing.timeline");

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">{t("subtitle")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-heading">{t("title")}</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto z-10">
          <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-primary/10 -translate-y-1/2 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-background border-4 border-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-black mb-6 group-hover:border-secondary group-hover:bg-secondary/10 transition-all duration-300 shadow-sm relative">
                1
                <div className="absolute -bottom-2 -end-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  <UserPlus className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t("s1Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("s1Desc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-background border-4 border-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-black mb-6 group-hover:border-secondary group-hover:bg-secondary/10 transition-all duration-300 shadow-sm relative">
                2
                <div className="absolute -bottom-2 -end-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  <Mic className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t("s2Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("s2Desc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-background border-4 border-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-black mb-6 group-hover:border-secondary group-hover:bg-secondary/10 transition-all duration-300 shadow-sm relative">
                3
                <div className="absolute -bottom-2 -end-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t("s3Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("s3Desc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-background border-4 border-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-black mb-6 group-hover:border-secondary group-hover:bg-secondary/10 transition-all duration-300 shadow-sm relative">
                4
                <div className="absolute -bottom-2 -end-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t("s4Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("s4Desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
