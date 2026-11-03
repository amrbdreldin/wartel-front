"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSafeHref, isHttpUrl } from "./ad-utils";

interface AdActionLinkProps {
  url: string | null | undefined;
  label: string;
  className?: string;
  onClick?: () => void;
}

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

/**
 * CTA link shared by every ad layout. External URLs open in a new tab,
 * relative paths use client-side navigation, anything else is not rendered.
 */
export function AdActionLink({ url, label, className, onClick }: AdActionLinkProps) {
  const locale = useLocale();
  const href = getSafeHref(url);
  if (!href) return null;

  const classes = cn(BASE_CLASS, className);

  if (isHttpUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={classes}>
        <span>{label}</span>
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
      </a>
    );
  }

  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;
  return (
    <Link href={href} onClick={onClick} className={classes}>
      <span>{label}</span>
      <ArrowIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
    </Link>
  );
}

