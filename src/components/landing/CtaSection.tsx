"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CtaSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("landing.cta");

  return (
    <section className="py-24 bg-muted/30 text-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 font-heading">{t("title")}</h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          {t("desc")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* <Link
            href={`/${locale}/instructions?type=student`}
            className="px-10 py-4 rounded-full gradient-secondary text-primary-dark font-bold text-lg hover:opacity-90 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            {t("registerBtn")}
          </Link> */}
          <a
            href="#faq"
            className="px-10 py-4 rounded-full border-2 border-primary text-primary font-bold text-lg hover:bg-primary hover:text-white transition-all"
          >
            {t("tamamBtn")}
          </a>
        </div>
      </div>
    </section>
  );
}
