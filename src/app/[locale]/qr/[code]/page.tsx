"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, ArrowRight, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { GradientBar } from "@/components/ui/gradient-bar";
import { useQrCode } from "@/hooks/api/useQrQueries";
import { extractQrErrorMessage, sanitizeRedirectUrl } from "./_components/qr-utils";

// ============================================================
// QR Code Redirect Page – /[locale]/qr/[code]
// ============================================================

export default function QrRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { code } = use(params);
  const locale = useLocale();
  const t = useTranslations();

  const decodedCode = useMemo(() => {
    try {
      return decodeURIComponent(code);
    } catch {
      return code;
    }
  }, [code]);

  const { data: response, isLoading, isFetching, isError, error, refetch } = useQrCode(decodedCode);

  const safeTargetUrl = useMemo(() => {
    if (!response?.success) return null;
    return sanitizeRedirectUrl(response.data?.target_url);
  }, [response]);

  const hasValidRedirect = Boolean(safeTargetUrl);
  const showLoading = isLoading || (isFetching && !hasValidRedirect);
  const showError = !showLoading && (isError || !hasValidRedirect);

  const errorMessage = extractQrErrorMessage(
    error,
    response,
    t("qr.invalidOrNotFound")
  );

  useEffect(() => {
    if (!safeTargetUrl) return;
    window.location.replace(safeTargetUrl);
  }, [safeTargetUrl]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[40%] -start-[30%] w-[80%] h-[80%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[130px] animate-pulse-slow" />
        <div className="absolute -bottom-[40%] -end-[30%] w-[80%] h-[80%] rounded-full bg-accent/10 dark:bg-accent/15 blur-[130px] animate-pulse-slow delay-2000" />
      </div>
      <div
        className="absolute top-0 end-0 bottom-0 start-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />

      {/* Logo */}
      <div className="mb-6">
        <Logo size="lg" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border border-border/50 bg-card/85 backdrop-blur-md overflow-hidden rounded-2xl">
          <GradientBar variant="primary" />

          <CardContent className="p-6 sm:p-8">
            {/* Loading State */}
            {showLoading && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg font-bold text-foreground">
                    {t("qr.checkingTitle")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t("qr.checkingDesc")}
                  </p>
                </div>
              </div>
            )}

            {/* Redirecting State (shown briefly while browser navigates) */}
            {!showLoading && hasValidRedirect && safeTargetUrl && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg font-bold text-foreground">
                    {t("qr.redirectingTitle")}
                  </h1>
                  {response?.data?.title && (
                    <p className="text-sm font-medium text-foreground/90">
                      {response.data.title}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {t("qr.redirectingDesc")}
                  </p>
                </div>
                <a href={safeTargetUrl} className={cn(buttonVariants(), "gap-2 mt-2")}>
                  <ExternalLink className="w-4 h-4" />
                  {t("qr.openLink")}
                </a>
              </div>
            )}

            {/* Error State */}
            {showError && (
              <div className="flex flex-col items-center gap-4 py-8 text-center" role="alert">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 text-destructive">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="text-lg font-bold text-foreground">
                    {t("qr.errorTitle")}
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {errorMessage}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t("common.retry")}
                  </Button>
                  <Link href={`/${locale}`} className={cn(buttonVariants(), "gap-2")}>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    {t("common.backToHome")}
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-xs text-muted-foreground text-center">
          {t("auth.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
}
