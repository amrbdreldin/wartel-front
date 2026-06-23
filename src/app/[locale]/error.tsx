"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");
  const locale = useLocale();

  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center p-4">
      {/* Decorative background blur blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-8 text-center shadow-xl backdrop-blur-md">
        {/* Animated Error Icon Container */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive animate-bounce-short">
          <AlertCircle className="h-10 w-10" />
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
          {t("error")}
        </h1>

        {/* Description */}
        <p className="mb-6 text-muted-foreground leading-relaxed text-sm">
          {t("errorOccurred")}
        </p>

        {/* Technical Digest (for support) */}
        {error.digest && (
          <div className="mb-6 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground font-mono select-all">
            Digest: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4 animate-spin-hover" />
            {t("retry")}
          </Button>

          <Link href={`/${locale}`} passHref legacyBehavior>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              {t("backToHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
