"use client";

import { LoginForm } from "./_components/LoginForm";
import { useTranslations } from "next-intl";

// ============================================================
// Login Page – layout shell only
// ============================================================

export default function LoginPage() {
  const t = useTranslations();

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* ── Left Decorative Panel (hidden on mobile) ──── */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center gradient-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "150px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />

        {/* Glow effects inside the primary panel */}
        <div className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-white/10 blur-[80px] animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-black/20 blur-[80px] animate-pulse-slow delay-2000" />

        <div className="relative z-10 px-12 text-center text-white max-w-lg">
          <p className="text-lg mb-8 opacity-80 font-arabic">{t("auth.basmalah")}</p>
          <blockquote className="text-3xl font-bold leading-relaxed mb-6 font-arabic">
            {t("auth.quranQuote")}
          </blockquote>
          <p className="text-sm opacity-70 mb-10">{t("auth.quranQuoteDesc")}</p>

          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-white/30" />
            <div className="h-2 w-2 rotate-45 border border-white/40" />
            <div className="h-px w-16 bg-white/30" />
          </div>

          <h1 className="text-4xl font-bold mb-3">{t("common.appName")}</h1>
          <p className="text-base opacity-80 leading-relaxed">
            {t("auth.loginDesc")}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">٥٠٠٠+</p>
              <p className="text-xs opacity-70 mt-1">{t("auth.studentRole")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">٢٥٠+</p>
              <p className="text-xs opacity-70 mt-1">{t("auth.teacherRole")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">٥٠+</p>
              <p className="text-xs opacity-70 mt-1">{t("auth.circleRole")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        {/* Mobile decorative header */}
        <div className="lg:hidden text-center mb-8">
          <p className="text-sm text-primary/60 font-arabic mb-2">{t("auth.basmalah")}</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 bg-primary/20" />
            <div className="h-1.5 w-1.5 rotate-45 bg-primary/30" />
            <div className="h-px w-10 bg-primary/20" />
          </div>
        </div>

        <LoginForm />

        <p className="mt-8 text-xs text-muted-foreground text-center">
          {t("auth.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>

      {/* ── Premium Ambient Background Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[40%] -start-[30%] w-[80%] h-[80%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[130px] animate-pulse-slow" />
        <div className="absolute -bottom-[40%] -end-[30%] w-[80%] h-[80%] rounded-full bg-accent/10 dark:bg-accent/15 blur-[130px] animate-pulse-slow delay-2000" />
        <div className="absolute top-[20%] start-[60%] w-[40%] h-[40%] rounded-full bg-wartel-primary-light/5 dark:bg-wartel-primary-light/10 blur-[95px] animate-pulse-slow delay-1000" />
      </div>

      {/* ── Background decoration ──── */}
      <div
        className="absolute top-0 end-0 bottom-0 start-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />
    </div>
  );
}
