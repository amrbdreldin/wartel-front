// ============================================================
// SEO / GEO / AEO helpers (server-only)
// ============================================================
// Single source of truth for absolute URLs, hreflang alternates,
// the public (indexable) route list and crawler policy.
// ============================================================

import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { LOCALES, type Locale } from "./constants";

export const DEFAULT_SEO_LOCALE: Locale = "ar";

/** OpenGraph locale codes for each supported locale */
export const OG_LOCALES: Record<Locale, string> = {
  ar: "ar_AR",
  en: "en_US",
};

/** Official social profiles – used in Organization `sameAs` (entity linking for search & AI engines) */
export const SOCIAL_PROFILES = [
  "https://www.facebook.com/profile.php?id=100084393630106",
  "https://www.youtube.com/@wartelacademy",
  "https://t.me/+_mhvkTv6CH44MWFk",
  "https://wa.me/201229449474",
];

/**
 * Sitemap routes (without locale prefix) – content pages only, each must return 200.
 * Login/register stay indexable (own canonical) but are left out of the sitemap;
 * private areas and utility pages (forgot-password, join links) are excluded entirely.
 * Bump `lastModified` when a page's content actually changes.
 */
export const PUBLIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  lastModified: string;
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly", lastModified: "2026-10-29" },
  { path: "/instructions", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-10-29" },
  { path: "/contact-us", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-10-29" },
];

/** Private areas – blocked in robots.txt and marked noindex */
export const PRIVATE_SEGMENTS = ["dashboard", "admin", "student", "teacher", "parent", "courses", "forgot-password"];

/** Abusive SEO scrapers – blocked in robots.txt and by middleware */
export const BLOCKED_BOTS = [
  "Bytespider",
  "PetalBot",
  "SemrushBot",
  "AhrefsBot",
  "DotBot",
  "MJ12bot",
];

/** AI search / answer engines – explicitly allowed for GEO & AEO visibility */
export const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "Amazonbot",
  "CCBot",
  "cohere-ai",
  "MistralAI-User",
];

/** Production origin – canonical host (www) for every public URL */
export const DEFAULT_SITE_URL = "https://www.wartel-academy.com";

/**
 * Canonical site origin.
 * NEXT_PUBLIC_SITE_URL overrides; local dev uses the request host; everything else
 * (incl. the bare wartel-academy.com domain) canonicalises to DEFAULT_SITE_URL.
 */
export async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  return isLocal ? `http://${host}` : DEFAULT_SITE_URL;
}

/** canonical + hreflang alternates (incl. x-default) for a locale-agnostic path like "/register" */
export function buildAlternates(baseUrl: string, locale: string, path = ""): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${baseUrl}/${l}${path}`;
  languages["x-default"] = `${baseUrl}/${DEFAULT_SEO_LOCALE}${path}`;

  return {
    canonical: `${baseUrl}/${locale}${path}`,
    languages,
  };
}

/** Full page metadata for a public page: title, description, canonical, hreflang, OG & Twitter */
export async function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  noindex = false,
}: {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
  noindex?: boolean;
}): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/${locale}${path}`;
  const t = await getTranslations({ locale, namespace: "seo" });
  const siteName = t("siteName");
  const image = { url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: siteName };

  // openGraph / twitter objects REPLACE the parent layout's (no deep merge),
  // so they must be complete here – image, siteName and card included.
  return {
    // seo.* titles already carry the brand, so bypass the layout's "%s | site" template
    ...(title ? { title: { absolute: title } } : {}),
    ...(description ? { description } : {}),
    alternates: buildAlternates(baseUrl, locale, path),
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url,
      siteName,
      images: [image],
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.ar,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [image.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Strip HTML tags / collapse whitespace – for JSON-LD and llms.txt built from CMS content */
export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Serialize JSON-LD safely for inline <script> (prevents `</script>` breakouts) */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export interface PublicFaq {
  question: string;
  answer: string;
}

/**
 * Server-side FAQ fetch (the landing page renders the same list client-side).
 * Used for FAQPage structured data and llms.txt. Never throws.
 */
export async function fetchPublicFaqs(locale: string): Promise<PublicFaq[]> {
  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) return [];

  try {
    const res = await fetch(`${apiBase.replace(/\/+$/, "")}/faqs`, {
      headers: { Accept: "application/json", "Accept-Language": locale },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { data?: { question?: string; answer?: string }[] }[];
    };
    return (json.data ?? [])
      .flatMap((category) => category.data ?? [])
      .filter((f) => f.question && f.answer)
      .map((f) => ({ question: toPlainText(f.question!), answer: toPlainText(f.answer!) }));
  } catch {
    return [];
  }
}
