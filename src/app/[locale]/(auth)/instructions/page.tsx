"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InstructionsContent } from "./_components/InstructionsContent";

// ============================================================
// Instructions Page – layout shell only
// ============================================================

export default function InstructionsPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary py-12 px-4 relative overflow-hidden">
      {/* ── Premium Ambient Background Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[45%] -start-[35%] w-[90%] h-[90%] rounded-full bg-white/10 dark:bg-white/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-[45%] -end-[35%] w-[90%] h-[90%] rounded-full bg-secondary/15 dark:bg-secondary/10 blur-[120px] animate-pulse-slow delay-2000" />
        <div className="absolute top-[30%] start-[20%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href={`/${locale}`}
            className="inline-block text-4xl md:text-5xl font-black text-white drop-shadow-md mb-4 hover:scale-105 transition-transform"
          >
            وَرَتِّلْ
          </Link>
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              <p className="text-white font-bold tracking-wide uppercase text-sm">
                {t("auth.admissionCriteria")}
              </p>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("auth.registerWelcome")}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            نسعد بانضمامكِ إلينا في رحلة حفظ كتاب الله. يرجى قراءة التعليمات والضوابط التالية بعناية قبل البدء في عملية التسجيل.
          </p>
        </div>

        {/* Instructions Card */}
        <Suspense fallback={<div className="bg-card/85 backdrop-blur-md rounded-[2.5rem] p-10 text-center text-foreground font-bold">{t("common.loading")}</div>}>
          <InstructionsContent />
        </Suspense>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/login`}
            className="text-white/60 hover:text-white text-sm font-bold transition-colors"
          >
            {t("auth.alreadyHaveAccount")} <span className="underline">{t("auth.login")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
