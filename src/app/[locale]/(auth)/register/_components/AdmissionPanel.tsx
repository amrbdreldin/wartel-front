"use client";

import { Info, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface AdmissionPanelProps {
  type?: "women" | "parent";
}

// ── Left Panel: Admission Criteria ──────────────────────────
export function AdmissionPanel({ type }: AdmissionPanelProps) {
  const t = useTranslations("auth");
  const params = useParams();
  const locale = params.locale as string;
  const searchParams = useSearchParams();
  const studentParam = searchParams.get("student");

  return (
    <div className="hidden lg:flex lg:w-2/5 gradient-primary text-white p-10 flex-col relative overflow-hidden">
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "150px" }}
      />

      {/* Glow effects inside the panel */}
      <div className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-white/10 blur-[80px] animate-pulse-slow" />
      <div className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-black/20 blur-[80px] animate-pulse-slow delay-2000" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
          <Info className="h-10 w-10 text-wartel-secondary-light" />
        </div>

        <h3 className="text-2xl font-black mb-4">{t("readyToStart")}</h3>
        <p className="text-white/80 leading-relaxed mb-10 text-sm max-w-[280px]">
          {t("readInstructionsFirst")}
        </p>

        {type === "women" ? (
          // <Link
          //   href={`/${locale}/instructions?type=student`}
          //   className="group relative px-8 py-4 rounded-2xl bg-white text-primary font-black text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl"
          // >
          //   <span className="relative z-10 flex items-center gap-2">
          //     {t("goToInstructions")}
          //     <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:-rotate-90 rtl:group-hover:-translate-x-1" />
          //   </span>
          // </Link>
          null
        ) : (
          <Link
            href={
              type === "parent"
                ? `/${locale}/instructions?type=parent`
                : `/${locale}/instructions`
            }
            className="group relative px-8 py-4 rounded-2xl bg-white text-primary font-black text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("goToInstructions")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:-rotate-90 rtl:group-hover:-translate-x-1" />
            </span>
          </Link>
        )}

        <div className="mt-12 w-full pt-12 border-t border-white/10">
          <div className="flex items-center justify-center gap-4 opacity-60">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Wartel Secure Registry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
