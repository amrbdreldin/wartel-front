"use client";

import { Check, Info, ArrowLeft, ArrowRight, BookOpen, Users, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// ============================================================
// InstructionsContent – tabbed instructions with interactive consent
// ============================================================

export function InstructionsContent() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type"); // "women" or "parent"

  const [activeTab, setActiveTab] = useState<"women" | "children">("women");
  const [hasAgreed, setHasAgreed] = useState(false);

  // Sync activeTab with typeParam if present
  useEffect(() => {
    if (typeParam === "women") {
      setActiveTab("women");
    } else if (typeParam === "parent") {
      setActiveTab("children");
    }
  }, [typeParam]);

  // Safely fetch translated arrays with fallbacks
  let womenItems: string[] = [];
  let childrenItems: string[] = [];

  try {
    womenItems = t.raw("instructions.women.items") || [];
  } catch (e) {
    console.error("Failed to load women items", e);
  }

  try {
    childrenItems = t.raw("instructions.children.items") || [];
  } catch (e) {
    console.error("Failed to load children items", e);
  }

  return (
    <div className="bg-card/85 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
      <div className="p-6 md:p-10">
        
        {/* ── Tabs Navigation ── */}
        {!typeParam && (
          <div className="flex p-1.5 bg-muted/60 dark:bg-muted/30 rounded-2xl max-w-md mx-auto mb-8 border border-border/40">
            <button
              onClick={() => {
                setActiveTab("women");
                setHasAgreed(false);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer",
                activeTab === "women"
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
              role="tab"
              aria-selected={activeTab === "women"}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              {t("instructions.womenTab")}
            </button>
            <button
              onClick={() => {
                setActiveTab("children");
                setHasAgreed(false);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer",
                activeTab === "children"
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
              role="tab"
              aria-selected={activeTab === "children"}
            >
              <Users className="w-4 h-4 shrink-0" />
              {t("instructions.childrenTab")}
            </button>
          </div>
        )}

        {/* ── Active Tab Content ── */}
        <div className="min-h-[300px] transition-all duration-500 ease-in-out">
          {activeTab === "women" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground">
                    {t("instructions.women.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("instructions.women.subtitle")}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {womenItems.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-muted/20 dark:bg-muted/10 border border-border/30 hover:border-primary/20 hover:bg-muted/40 dark:hover:bg-muted/20 transition-all duration-300"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/25 text-primary text-xs font-black">
                      {i + 1}
                    </div>
                    <span className="text-sm md:text-base leading-relaxed text-foreground/90">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Children Intro Callout */}
              <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-3xl p-5 md:p-6 mb-6 flex gap-4 items-start">
                <Info className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-amber-900 dark:text-amber-400 mb-2 text-base md:text-lg">
                    {t("instructions.children.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-amber-800/90 dark:text-amber-500/90 whitespace-pre-line">
                    {t("instructions.children.subtitle")}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {childrenItems.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-muted/20 dark:bg-muted/10 border border-border/30 hover:border-amber-500/20 hover:bg-muted/40 dark:hover:bg-muted/20 transition-all duration-300"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/25 text-amber-600 dark:text-amber-500 text-xs font-black">
                      {i + 1}
                    </div>
                    <span className="text-sm md:text-base leading-relaxed text-foreground/90">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Children Closing Callout */}
              {t("instructions.children.closing") && (
                <div className="mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/10 text-center italic text-sm md:text-base text-primary font-bold">
                  {t("instructions.children.closing")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Consent & Action Button ── */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col items-center justify-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer group select-none max-w-xl text-center">
            <div className="relative shrink-0">
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="sr-only"
                aria-label={t("instructions.agreeCheckbox")}
              />
              <div className={cn(
                "w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
                hasAgreed
                  ? "border-primary bg-primary text-white"
                  : "border-muted-foreground group-hover:border-foreground"
              )}>
                {hasAgreed && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
            <span className="text-sm md:text-base font-bold text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
              {t("instructions.agreeCheckbox")}
            </span>
          </label>

          <Link
            href={
              typeParam === "women"
                ? `/${locale}/register`
                : typeParam === "parent"
                ? `/${locale}/register/parent`
                : activeTab === "women"
                ? `/${locale}/register`
                : `/${locale}/register/parent`
            }
            className={cn(
              "w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl px-12 py-5 text-white font-black text-lg transition-all duration-300",
              hasAgreed
                ? "gradient-primary hover:opacity-90 hover:-translate-y-1 hover:shadow-2xl shadow-primary/20"
                : "bg-muted-foreground/30 text-muted-foreground pointer-events-none cursor-not-allowed opacity-50"
            )}
            aria-disabled={!hasAgreed}
            tabIndex={hasAgreed ? 0 : -1}
          >
            {t("auth.registerNow")}
            {isRTL ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </Link>
        </div>

      </div>
    </div>
  );
}
