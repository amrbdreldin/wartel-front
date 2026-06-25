"use client";

import { ArrowLeft, ArrowRight, Award, BookOpen, Bot, LineChart, Sparkles, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export function FeaturesSection() {
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="py-24 bg-muted/30 relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">{t("subtitle")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 font-heading">{t("title")}</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          <div className="group bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 rotate-3 group-hover:-rotate-3">
              <Bot className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{t("f1Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("f1Desc")}</p>
          </div>

          <div className="group bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 rotate-3 group-hover:-rotate-3">
              <Video className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{t("f2Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("f2Desc")}</p>
          </div>

          <div className="group bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 rotate-3 group-hover:-rotate-3">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{t("f3Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("f3Desc")}</p>
          </div>

          <div className="group bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 rotate-3 group-hover:-rotate-3">
              <LineChart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{t("f4Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("f4Desc")}</p>
          </div>

          <div className="group bg-background p-8 rounded-3xl shadow-sm hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 rotate-3 group-hover:-rotate-3">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">{t("f5Title")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("f5Desc")}</p>
          </div>

          <div className="group bg-gradient-to-br from-primary to-primary/90 text-primary-foreground p-8 rounded-3xl shadow-sm hover:shadow-xl border border-primary/20 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center text-3xl mb-6 group-hover:bg-background group-hover:text-primary transition-colors duration-300 rotate-3 group-hover:-rotate-3">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{t("f6Title")}</h3>
            <p className="text-white/90 leading-relaxed">{t("f6Desc")}</p>
            <Link href={`/${locale}/instructions?type=student`} className="inline-flex items-center mt-4 text-secondary-light font-bold hover:text-white transition-colors gap-1">
              {t("f6Btn")} {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
