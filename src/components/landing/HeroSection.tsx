"use client";

import { BookOpen, CheckCircle2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export function HeroSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("landing.hero");

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "200px" }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full mix-blend-multiply blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-dark font-bold mb-6 border border-secondary/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
              </span>
              <span>{t("badge")}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6 font-heading">
              {t("titleLine1")} <br />
              <span className="text-gradient-brand">{t("titleLine2")}</span> {t("titleLine3")}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t("desc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              {/* <Link
                href={`/${locale}/instructions?type=student`}
                className="w-full sm:w-auto px-8 py-4 rounded-full gradient-primary text-white font-bold text-lg hover:opacity-90 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
              >
                <BookOpen className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                {t("registerWomenBtn")}
              </Link> */}
              <Link
                href={`/${locale}/instructions?type=parent`}
                className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-primary text-primary bg-background font-bold text-lg hover:bg-primary/5 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
              >
                <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("registerParentBtn")}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-muted-foreground font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success-500" /> {t("check1")}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success-500" /> {t("check2")}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success-500" /> {t("check3")}
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none px-4 sm:px-0">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl rounded-full scale-90" />
            
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-background/50 ring-1 ring-border/50 z-10 w-full h-80 sm:h-96 lg:h-[550px] transform hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center" aria-hidden="true">
                 <BookOpen className="h-24 w-24 text-primary/40 animate-pulse" />
              </div>
              <Image
                src="/hero.png"
                alt="القرآن الكريم"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover absolute inset-0 z-10"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
              <div className="absolute bottom-8 end-8 start-8 text-white text-center md:text-end z-30">
                <p className="font-bold text-lg md:text-2xl opacity-95 leading-relaxed text-shadow-sm">&quot;{t("quote")}&quot;</p>
              </div>
            </div>

            {/* <div className="absolute -bottom-6 -start-2 sm:-start-6 bg-background p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4 z-40 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-2xl">
                <Star className="h-6 w-6 fill-amber-300" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold mb-1">{t("evalTitle")}</p>
                <p className="font-black text-foreground text-lg cursor-default">4.9 / 5.0</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
