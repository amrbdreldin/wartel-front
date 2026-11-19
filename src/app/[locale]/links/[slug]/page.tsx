"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, Check, ExternalLink, Home, Layers, Loader2, Share2 } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { PlatformIcon, getPlatformStyle } from "@/components/bio-links/PlatformIcon";
import { useBioLinkCategory } from "@/hooks/api/useBioLinkQueries";
import { bioLinkService, sanitizeBioLinkUrl, type BioLinkItem } from "@/services/bioLink.service";
import { cn } from "@/lib/utils";

export default function BioLinkCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const decodedSlug = useMemo(() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  }, [slug]);

  const { data: response, isLoading, isError } = useBioLinkCategory(decodedSlug);
  const category = response?.success ? response.data : null;

  const validLinks = useMemo(() => {
    if (!category?.links) return [];
    return category.links
      .map((item) => ({
        ...item,
        safeUrl: sanitizeBioLinkUrl(item.url),
      }))
      .filter((item): item is BioLinkItem & { safeUrl: string } => Boolean(item.safeUrl));
  }, [category]);

  const handleLinkClick = (linkId: number) => {
    // Fire-and-forget click tracking without blocking navigation
    bioLinkService.trackClick(linkId).catch(() => {});
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (!shareUrl) return;

    if (navigator.share && category) {
      try {
        await navigator.share({ title: category.name, url: shareUrl });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  const themeColor = category?.theme_color || "#059669";

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Subtle Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute -top-[35%] -start-[25%] w-[80%] h-[80%] rounded-full opacity-15 blur-[130px]"
          style={{ backgroundColor: themeColor }}
        />
        <div className="absolute -bottom-[35%] -end-[25%] w-[75%] h-[75%] rounded-full bg-accent/10 blur-[130px]" />
      </div>
      <div
        className="fixed inset-0 -z-10 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />

      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Top Bar: Share button */}
        {category && (
          <div className="w-full flex justify-end mb-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-full text-xs font-medium bg-card/85 backdrop-blur-md border border-border/60 text-foreground hover:border-primary/40 shadow-sm transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("bioLinks.copied")}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t("bioLinks.share")}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full flex flex-col items-center gap-4 py-16">
            <Logo size="lg" />
            <Loader2 className="w-7 h-7 animate-spin text-primary mt-4" />
          </div>
        )}

        {/* Not Found / Error State */}
        {!isLoading && (isError || !category) && (
          <div className="w-full flex flex-col items-center mt-6">
            <div className="mb-6">
              <Logo size="lg" />
            </div>
            <Card className="w-full rounded-2xl border-border/60 bg-card/90 backdrop-blur-md shadow-xl">
              <CardContent className="p-6 sm:p-8 text-center space-y-4">
                <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 text-destructive">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-lg font-bold text-foreground">
                    {t("bioLinks.notFoundTitle")}
                  </h1>
                  <p className="text-sm text-muted-foreground break-words">
                    {t("bioLinks.notFoundDesc")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2 justify-center">
                  <Link
                    href={`/${locale}/links`}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{t("bioLinks.backToDirectory")}</span>
                  </Link>
                  <Link
                    href={`/${locale}`}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition"
                  >
                    <Home className="w-4 h-4" />
                    <span>{t("bioLinks.backToHome")}</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Profile & Links */}
        {!isLoading && !isError && category && (
          <>
            {/* Profile Avatar / Logo */}
            <div className="mb-4 flex flex-col items-center">
              <div
                className="p-3 rounded-3xl bg-card/90 backdrop-blur-md border border-border/60 shadow-lg mb-4"
                style={{ boxShadow: `0 10px 30px -10px ${themeColor}33` }}
              >
                <Logo size="lg" />
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground text-center break-words">
                {category.name}
              </h1>

              {category.description && (
                <p className="text-sm sm:text-base text-muted-foreground text-center mt-2 max-w-md leading-relaxed break-words">
                  {category.description}
                </p>
              )}
            </div>

            {/* Links List */}
            {validLinks.length === 0 ? (
              <Card className="w-full mt-4 rounded-2xl border-border/60 bg-card/85 backdrop-blur-md">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  {t("bioLinks.noLinks")}
                </CardContent>
              </Card>
            ) : (
              <div className="w-full flex flex-col gap-3.5 mt-4">
                {validLinks.map((item) => {
                  const style = getPlatformStyle(item.platform);
                  const isMailOrTel = /^(mailto:|tel:)/i.test(item.safeUrl);

                  return (
                    <a
                      key={item.id}
                      href={item.safeUrl}
                      target={isMailOrTel ? undefined : "_blank"}
                      rel={isMailOrTel ? undefined : "noopener noreferrer"}
                      onClick={() => handleLinkClick(item.id)}
                      className={cn(
                        "group relative w-full min-h-[60px] flex items-center gap-3.5 px-4 py-3.5 rounded-2xl",
                        "bg-card/95 backdrop-blur-md border border-border/60 shadow-sm",
                        "hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200",
                        style.border
                      )}
                    >
                      {/* Platform Brand Logo */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-11 h-11 rounded-xl shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105",
                          style.bg,
                          style.text
                        )}
                      >
                        <PlatformIcon platform={item.platform} className="w-5 h-5" />
                      </div>

                      {/* Button Label & Optional Subtitle */}
                      <div className="flex-1 min-w-0 text-start">
                        <div className="font-bold text-sm sm:text-base text-foreground break-words leading-snug">
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-xs text-muted-foreground mt-0.5 break-words line-clamp-2">
                            {item.subtitle}
                          </div>
                        )}
                      </div>

                      {/* External Link Indicator */}
                      <ExternalLink className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground shrink-0 transition-colors" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Footer Link back to directory */}
            <div className="mt-10 pt-4 text-center">
              <Link
                href={`/${locale}/links`}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[40px] px-3"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t("bioLinks.backToDirectory")}</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
