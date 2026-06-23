"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums";
import { Loader2 } from "lucide-react";
import { RegisterForm } from "./_components/RegisterForm";

// ============================================================
// Register Page – layout shell only
// ============================================================

export default function RegisterPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      const roleIdStr = String(user.role_id);
      const isStudent = user.role === UserRole.STUDENT || roleIdStr === "1" || roleIdStr === "3";
      if (isStudent) {
        router.replace(`/${locale}/student`);
      }
    }
  }, [mounted, isAuthenticated, user, locale, router]);

  const isStudent = isAuthenticated && user && (user.role === UserRole.STUDENT || String(user.role_id) === "1" || String(user.role_id) === "3");

  if (mounted && isStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary relative overflow-hidden">
        <Loader2 className="animate-spin text-white h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary py-8 px-4 relative overflow-hidden">
      {/* ── Premium Ambient Background Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[45%] -start-[35%] w-[90%] h-[90%] rounded-full bg-white/10 dark:bg-white/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-[45%] -end-[35%] w-[90%] h-[90%] rounded-full bg-secondary/15 dark:bg-secondary/10 blur-[120px] animate-pulse-slow delay-2000" />
        <div className="absolute top-[30%] start-[20%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            href={`/${locale}`}
            className="inline-block text-4xl md:text-5xl font-black text-white drop-shadow-md mb-2 hover:scale-105 transition-transform"
            aria-label={t("common.appName")}
          >
            وَرَتِّلْ
          </Link>
          <p className="text-white/80 text-sm font-medium">{t("auth.registerWelcome")}</p>
        </div>

        {/* Main Card */}
        <RegisterForm />
      </div>
    </div>
  );
}
