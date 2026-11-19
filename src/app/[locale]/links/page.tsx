"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Layers, Link2, Loader2 } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { useBioLinkCategories } from "@/hooks/api/useBioLinkQueries";
import { cn } from "@/lib/utils";

export default function BioLinksDirectoryPage() {
  const locale = useLocale();
  const t = useTranslations();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const { data: response, isLoading, isError, refetch } = useBioLinkCategories();
  const categories = response?.success && Array.isArray(response.data) ? response.data : [];

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[35%] -start-[25%] w-[75%] h-[75%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-[35%] -end-[25%] w-[75%] h-[75%] rounded-full bg-accent/10 dark:bg-accent/15 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="mb-4">
          <Logo size="lg" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2">
          {t("bioLinks.directoryTitle")}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm break-words">
          {t("bioLinks.directoryDesc")}
        </p>

        {/* Loading */}
        {isLoading && (
          <div className="w-full flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <Card className="w-full rounded-2xl border-border/60 bg-card/85 backdrop-blur-md">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">{t("bioLinks.noCategories")}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
              >
                {t("bioLinks.retry")}
              </button>
            </CardContent>
          </Card>
        )}

        {/* Empty */}
        {!isLoading && !isError && categories.length === 0 && (
          <Card className="w-full rounded-2xl border-border/60 bg-card/85 backdrop-blur-md">
            <CardContent className="p-8 text-center space-y-3">
              <Layers className="w-10 h-10 mx-auto text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">{t("bioLinks.noCategories")}</p>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        {!isLoading && !isError && categories.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/links/${encodeURIComponent(cat.slug)}`}
                className={cn(
                  "group w-full min-h-[64px] flex items-center gap-3.5 p-4 rounded-2xl",
                  "bg-card/90 backdrop-blur-md border border-border/60 shadow-sm",
                  "hover:shadow-md hover:border-primary/40 active:scale-[0.99] transition-all duration-200"
                )}
              >
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-xl text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: cat.theme_color || "#059669" }}
                >
                  <Link2 className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 text-start">
                  <div className="font-bold text-base text-foreground truncate">
                    {cat.name}
                  </div>
                  {cat.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5 break-words">
                      {cat.description}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {t("bioLinks.linksCount", { count: cat.links_count })}
                  </span>
                  <ArrowIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
