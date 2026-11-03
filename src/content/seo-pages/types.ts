// ============================================================
// Keyword landing pages & blog posts – content model
// ============================================================
// Body text supports inline links: "[anchor](/how-to-register)".
// Paths without a locale get the current locale prefixed; paths that start with a
// locale (e.g. "/ar/blog/…" from an English page) and absolute URLs pass through.
// `todo` blocks are owner reminders: rendered only in development, never in production.
// ============================================================

import type { Locale } from "@/lib/constants";

export type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "todo"; text: string };

export interface Section {
  h2: string;
  blocks: Block[];
}

export interface Faq {
  q: string;
  a: string;
}

export type PageSchema =
  | { type: "course"; name: string; description: string; audience: string; level?: string }
  | { type: "howto"; name: string; steps: { name: string; text: string; path?: string }[] }
  | { type: "article"; datePublished: string; dateModified: string };

export interface SeoPageContent {
  /** Primary keyword: starts the <title>, appears in the H1, the lead and the description */
  keyword: string;
  /** < 60 chars, starts with the keyword */
  title: string;
  /** < 155 chars, keyword + CTA */
  description: string;
  h1: string;
  /** Short name for breadcrumbs and related-page links */
  linkLabel: string;
  /** 2–3 sentence direct answer shown first (AI Overviews / answer-engine citations) */
  lead: string;
  sections: Section[];
  faq: Faq[];
  cta: { title: string; text: string; label: string; href: string; secondary?: { label: string; href: string } };
  schema: PageSchema;
}

export type SeoPageKey =
  | "women"
  | "kids"
  | "free"
  | "register"
  | "tartil"
  | "memorize"
  | "tajweed";

export interface SeoPageDefinition {
  key: SeoPageKey;
  path: string;
  kind: "landing" | "article";
  related: SeoPageKey[];
  content: Partial<Record<Locale, SeoPageContent>>;
}
