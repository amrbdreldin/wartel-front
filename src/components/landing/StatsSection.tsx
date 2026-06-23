"use client";

import { useTranslations } from "next-intl";

export function StatsSection() {
  const t = useTranslations("landing.stats");

  return (
    <section id="stats" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="gradient-primary rounded-[3rem] px-8 py-16 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl z-0 transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-2xl z-0 transform -translate-x-1/2 translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center md:divide-x md:divide-x-reverse md:divide-white/20">
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black text-secondary-light mb-2 font-heading">+5,000</div>
              <div className="text-white/80 font-semibold text-lg">{t("students")}</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black text-secondary-light mb-2 font-heading">+250</div>
              <div className="text-white/80 font-semibold text-lg">{t("teachers")}</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black text-secondary-light mb-2 font-heading">4</div>
              <div className="text-white/80 font-semibold text-lg">{t("tracks")}</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-black text-secondary-light mb-2 font-heading">100%</div>
              <div className="text-white/80 font-semibold text-lg">{t("online")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
