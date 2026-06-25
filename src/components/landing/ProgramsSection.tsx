"use client";

import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, RefreshCw, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export function ProgramsSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("landing.programs");

  return (
    <section id="programs" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute end-0 top-0 w-1/3 h-full bg-primary/5 z-0 hidden lg:block rounded-s-[100px]" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3 text-center lg:text-start">
            <span className="text-primary font-bold tracking-wider mb-4 text-sm uppercase">{t("subtitle")}</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 font-heading">{t("title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("desc")}
            </p>
            <Link
              href={`/${locale}/instructions?type=student`}
              className="inline-block px-8 py-3 rounded-full gradient-primary text-white font-bold hover:opacity-90 hover:text-secondary hover:-translate-y-1 transition-all shadow-md"
            >
              {t("btn")}
            </Link>
          </div>

          <div className="lg:w-2/3 grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-full h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
              <Type className="h-10 w-10 text-wartel-secondary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">{t("p1Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t("p1Desc")}</p>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1 text-xs">{t("p1Tag")}</Badge>
            </div>

            <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-full h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
              <BookOpen className="h-10 w-10 text-wartel-secondary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">{t("p2Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t("p2Desc")}</p>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1 text-xs">{t("p2Tag")}</Badge>
            </div>

            <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-full h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
              <RefreshCw className="h-10 w-10 text-wartel-secondary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">{t("p3Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t("p3Desc")}</p>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1 text-xs">{t("p3Tag")}</Badge>
            </div>

            <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-full h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
              <Award className="h-10 w-10 text-wartel-secondary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">{t("p4Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t("p4Desc")}</p>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3 py-1 text-xs">{t("p4Tag")}</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
