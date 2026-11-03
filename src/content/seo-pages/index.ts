// ============================================================
// Keyword landing pages & blog posts – registry
// ============================================================
// Adding a page: create its content file, register it here, add a thin
// route under src/app/[locale]/…, and list its path in PUBLIC_ROUTES (src/lib/seo.ts).
// ============================================================

import { LOCALES, type Locale } from "@/lib/constants";
import { freePage } from "./free-quran-memorization";
import { howToRegisterPage } from "./how-to-register";
import { memorizePost } from "./how-to-memorize-quran";
import { kidsPage } from "./quran-for-kids";
import { womenPage } from "./quran-for-women";
import { tajweedPost } from "./tajweed-for-beginners";
import { tartilPost } from "./warattil-al-quran-tartila";
import type { SeoPageContent, SeoPageDefinition, SeoPageKey } from "./types";

export const SEO_PAGES: Record<SeoPageKey, SeoPageDefinition> = {
  women: womenPage,
  kids: kidsPage,
  free: freePage,
  register: howToRegisterPage,
  tartil: tartilPost,
  memorize: memorizePost,
  tajweed: tajweedPost,
};

/** Landing pages linked from the homepage keyword section, in display order */
export const HOME_LINKED_PAGES: SeoPageKey[] = ["women", "kids", "free", "register"];
export const BLOG_PAGES: SeoPageKey[] = ["tartil", "memorize", "tajweed"];

/**
 * Blog author shown on articles and in Article JSON-LD.
 * TODO(owner): fill in the scholar/teacher who wrote or reviewed the articles
 * (name, qualification e.g. "مجازة بالقراءات العشر", short bio).
 * While `name` is empty the articles are credited to the academy (Organization).
 */
export const ARTICLE_AUTHOR = {
  name: "",
  jobTitle: "",
  description: "",
};

export function getSeoPage(key: SeoPageKey): SeoPageDefinition {
  return SEO_PAGES[key];
}

/** Locales the page has content for, in LOCALES order */
export function pageLocales(def: SeoPageDefinition): Locale[] {
  return LOCALES.filter((l) => def.content[l]);
}

/** Strip "[anchor](/path)" link markup – for JSON-LD and llms.txt */
export function plainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

/** Visible word count (lead + sections + FAQ + CTA; owner TODOs excluded) */
export function pageWordCount(c: SeoPageContent): number {
  const texts: string[] = [c.h1, c.lead, c.cta.title, c.cta.text];
  for (const s of c.sections) {
    texts.push(s.h2);
    for (const b of s.blocks) {
      if (b.type === "p" || b.type === "quote") texts.push(b.text);
      else if (b.type === "ul" || b.type === "ol") texts.push(...b.items);
      else if (b.type === "table") texts.push(...b.head, ...b.rows.flat());
    }
  }
  if (c.schema.type === "howto") for (const s of c.schema.steps) texts.push(s.name, s.text);
  for (const f of c.faq) texts.push(f.q, f.a);
  return plainText(texts.join(" ")).split(/\s+/).filter(Boolean).length;
}
