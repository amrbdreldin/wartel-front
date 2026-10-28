"use client";

import { Baby, ExternalLink, Radio } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLiveSessionLinkQuery } from "@/hooks/api/useAuthMutations";

// ============================================================
// LiveSessionBanner – flashing announcement for the open
// recitation-correction sessions (session_24 for adults,
// session_child_24 for children). Hidden when no link.
// ============================================================

export function LiveSessionBanner() {
  const t = useTranslations("liveSession");
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const { data: links } = useLiveSessionLinkQuery(pathname, isAuthenticated);

  if (!isAuthenticated || !links) return null;

  return (
    <div
      role="alert"
      className="relative z-50 flex w-full flex-col items-center gap-3 overflow-hidden gradient-primary px-4 py-3 text-white shadow-lg ring-2 ring-wartel-primary-dark sm:flex-row sm:justify-between lg:px-6"
    >
      {/* Flashing overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 gradient-secondary animate-live-flash motion-reduce:animate-none"
      />
      {/* Site pattern overlay (same as PromoBanner) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />

      <div className="relative flex items-center gap-3 text-center sm:text-start">
        <span className="relative flex size-3 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-white" />
        </span>
        <Radio className="hidden size-6 shrink-0 sm:block" />
        <div>
          <p className="text-base font-extrabold leading-tight sm:text-lg">{t("title")}</p>
          <p className="text-sm text-white/90">{t("subtitle")}</p>
        </div>
      </div>

      <div className="relative flex shrink-0 flex-wrap items-center justify-center gap-2">
        {links.adult && (
          <a
            href={links.adult}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-wartel-primary-dark shadow-md transition hover:scale-105 hover:bg-wartel-secondary hover:text-white"
          >
            <ExternalLink className="size-4" />
            {t("join")}
          </a>
        )}
        {links.child && (
          <a
            href={links.child}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
          >
            <Baby className="size-4" />
            {t("joinChild")}
          </a>
        )}
      </div>
    </div>
  );
}
