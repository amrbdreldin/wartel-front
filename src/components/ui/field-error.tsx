"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// ============================================================
// FieldError – Atom: displays a translated validation error
// ============================================================

interface FieldErrorProps {
  error?: string | null;
  className?: string;
}

export function FieldError({ error, className }: FieldErrorProps) {
  const t = useTranslations();

  if (!error) return null;

  // Resolve i18n key if the error string looks like a translation key
  const message = error.includes(".")
    ? t(error as Parameters<typeof t>[0])
    : error;

  return (
    <p
      className={cn(
        "text-xs text-destructive mt-1 flex items-center gap-1",
        className
      )}
      role="alert"
    >
      <svg
        className="h-3.5 w-3.5 shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
}
