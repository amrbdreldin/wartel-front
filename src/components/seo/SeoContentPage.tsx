// ============================================================
// Keyword landing page / blog post renderer (server component)
// ============================================================
// One template for every page in src/content/seo-pages: breadcrumb, H1,
// direct-answer lead, H2 sections, visible FAQ, CTA, related links and a
// JSON-LD @graph (WebPage|Article + BreadcrumbList + FAQPage + Course|HowTo)
// that mirrors exactly what is visible on the page.
// ============================================================

import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import {
  ARTICLE_AUTHOR,
  getSeoPage,
  pageLocales,
  pageWordCount,
  plainText,
  SEO_PAGES,
} from "@/content/seo-pages";
import type { Block, SeoPageContent, SeoPageKey } from "@/content/seo-pages/types";
import { LOCALES, type Locale } from "@/lib/constants";
import { buildPageMetadata, getBaseUrl, jsonLd } from "@/lib/seo";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const isDev = process.env.NODE_ENV !== "production";

const LOCALE_PREFIX_RE = new RegExp(`^/(${LOCALES.join("|")})(/|$)`);

/** "/x" → "/{locale}/x"; paths that already carry a locale (e.g. "/ar/blog/…") and absolute URLs pass through */
function localHref(href: string, locale: string): string {
  if (!href.startsWith("/") || LOCALE_PREFIX_RE.test(href)) return href;
  return `/${locale}${href}`;
}

/** Renders body text with inline "[anchor](/path)" links */
function RichText({ text, locale }: { text: string; locale: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const [raw, label, href] = match;
    parts.push(text.slice(last, match.index));
    const linkClass = "font-bold text-primary underline underline-offset-4 hover:text-primary/80";
    parts.push(
      href.startsWith("/") ? (
        <Link key={match.index} href={localHref(href, locale)} hrefLang={LOCALE_PREFIX_RE.exec(href)?.[1]} className={linkClass}>
          {label}
        </Link>
      ) : (
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
        </a>
      ),
    );
    last = match.index + raw.length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

function BlockView({ block, locale }: { block: Block; locale: string }) {
  switch (block.type) {
    case "p":
      return (
        <p className="leading-loose text-foreground/85">
          <RichText text={block.text} locale={locale} />
        </p>
      );
    case "ul":
    case "ol": {
      const List = block.type === "ul" ? "ul" : "ol";
      return (
        <List className={`space-y-2 ps-6 leading-loose text-foreground/85 ${block.type === "ul" ? "list-disc" : "list-decimal"} marker:text-primary`}>
          {block.items.map((item, i) => (
            <li key={i}>
              <RichText text={item} locale={locale} />
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-primary/10 text-foreground">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-start font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 align-top leading-relaxed text-foreground/85">
                      <RichText text={cell} locale={locale} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "quote":
      return (
        <blockquote className="rounded-2xl border-s-4 border-primary bg-primary/5 px-6 py-4 font-arabic text-xl leading-loose text-foreground">
          {block.text}
          {block.cite && <cite className="mt-2 block text-sm not-italic text-muted-foreground">{block.cite}</cite>}
        </blockquote>
      );
    case "todo":
      // Owner reminder – visible only in development so placeholders never reach visitors
      return isDev ? (
        <p className="rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
          TODO: {block.text}
        </p>
      ) : null;
  }
}

/** generateMetadata for a page in the registry */
export async function seoPageMetadata(key: SeoPageKey, locale: string): Promise<Metadata> {
  const def = getSeoPage(key);
  const content = def.content[locale as Locale];
  if (!content) return {};
  return buildPageMetadata({
    locale,
    path: def.path,
    title: content.title,
    description: content.description,
    locales: pageLocales(def),
    article:
      content.schema.type === "article"
        ? { publishedTime: content.schema.datePublished, modifiedTime: content.schema.dateModified }
        : undefined,
  });
}

function buildStructuredData(
  key: SeoPageKey,
  content: SeoPageContent,
  locale: string,
  baseUrl: string,
  homeLabel: string,
) {
  const def = getSeoPage(key);
  const url = `${baseUrl}/${locale}${def.path}`;
  const organization = { "@id": `${baseUrl}/#organization` };
  const image = `${baseUrl}/og-image.jpg`;
  const schema = content.schema;

  const page =
    schema.type === "article"
      ? {
          "@type": "Article",
          "@id": `${url}#article`,
          headline: content.h1,
          description: content.description,
          inLanguage: locale,
          image,
          datePublished: schema.datePublished,
          dateModified: schema.dateModified,
          wordCount: pageWordCount(content),
          keywords: content.keyword,
          // Person once the owner fills ARTICLE_AUTHOR; until then the academy is credited
          author: ARTICLE_AUTHOR.name
            ? {
                "@type": "Person",
                name: ARTICLE_AUTHOR.name,
                ...(ARTICLE_AUTHOR.jobTitle ? { jobTitle: ARTICLE_AUTHOR.jobTitle } : {}),
                ...(ARTICLE_AUTHOR.description ? { description: ARTICLE_AUTHOR.description } : {}),
                worksFor: organization,
              }
            : organization,
          publisher: organization,
          mainEntityOfPage: url,
          isPartOf: { "@id": `${baseUrl}/#website` },
          breadcrumb: { "@id": `${url}#breadcrumb` },
        }
      : {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: content.title,
          description: content.description,
          inLanguage: locale,
          isPartOf: { "@id": `${baseUrl}/#website` },
          about: organization,
          primaryImageOfPage: image,
          breadcrumb: { "@id": `${url}#breadcrumb` },
        };

  const extra =
    schema.type === "course"
      ? [
          {
            "@type": "Course",
            "@id": `${url}#course`,
            name: schema.name,
            description: schema.description,
            url,
            inLanguage: "ar",
            isAccessibleForFree: true,
            provider: organization,
            audience: { "@type": "EducationalAudience", audienceType: schema.audience },
            ...(schema.level ? { educationalLevel: schema.level } : {}),
            offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
            hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
          },
        ]
      : schema.type === "howto"
        ? [
            {
              "@type": "HowTo",
              "@id": `${url}#howto`,
              name: schema.name,
              description: plainText(content.lead),
              inLanguage: locale,
              estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: 0 },
              step: schema.steps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.name,
                text: plainText(s.text),
                url: s.path ? `${baseUrl}/${locale}${s.path}` : `${url}#step-${i + 1}`,
              })),
            },
          ]
        : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      page,
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeLabel, item: `${baseUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: content.linkLabel, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: content.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
        })),
      },
      ...extra,
    ],
  };
}

export async function SeoContentPage({ pageKey, locale }: { pageKey: SeoPageKey; locale: string }) {
  const def = getSeoPage(pageKey);
  const content = def.content[locale as Locale];
  if (!content) notFound();

  const [t, baseUrl, headersList] = await Promise.all([
    getTranslations({ locale, namespace: "seoPages" }),
    getBaseUrl(),
    headers(),
  ]);
  const nonce = headersList.get("x-nonce") || undefined;
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const related = def.related
    .map((k) => ({ key: k, def: SEO_PAGES[k], content: SEO_PAGES[k].content[locale as Locale] }))
    .filter((r) => r.content);
  const schema = content.schema;

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: jsonLd(buildStructuredData(pageKey, content, locale, baseUrl, t("home"))) }}
      />
      <LandingNavbar />

      <main className="flex-1 pt-24">
        {/* ── Header ── */}
        <header className="border-b border-border bg-linear-to-b from-primary/10 to-transparent">
          <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6">
            <nav aria-label={t("breadcrumb")} className="mb-6 text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href={`/${locale}`} className="hover:text-primary">
                    {t("home")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-bold text-foreground">
                  {content.linkLabel}
                </li>
              </ol>
            </nav>

            <h1 className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl">{content.h1}</h1>
            <p className="text-lg leading-loose text-foreground/90">
              <RichText text={content.lead} locale={locale} />
            </p>

            {schema.type === "article" && (
              <p className="mt-4 text-sm text-muted-foreground">
                {t("updated")}: <time dateTime={schema.dateModified}>{schema.dateModified}</time>
                {ARTICLE_AUTHOR.name && ` · ${t("author")}: ${ARTICLE_AUTHOR.name}`}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localHref(content.cta.href, locale)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-primary/90"
              >
                {content.cta.label}
                <Arrow className="h-4 w-4" />
              </Link>
              {def.key !== "register" && (
                <Link
                  href={`/${locale}/how-to-register`}
                  className="inline-flex items-center rounded-xl border-2 border-primary/20 bg-primary/5 px-6 py-3 font-bold text-primary transition-all hover:bg-primary/10"
                >
                  {t("howToRegister")}
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          {/* ── Table of contents ── */}
          <nav aria-label={t("toc")} className="mb-12 rounded-2xl border border-border bg-card p-6">
            <p className="mb-3 font-bold text-foreground">{t("toc")}</p>
            <ol className="list-decimal space-y-1 ps-6 text-sm marker:text-primary">
              {content.sections.map((s, i) => (
                <li key={s.h2}>
                  <a href={`#section-${i + 1}`} className="text-foreground/80 hover:text-primary">
                    {s.h2}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-foreground/80 hover:text-primary">
                  {t("faq")}
                </a>
              </li>
            </ol>
          </nav>

          {/* ── Body ── */}
          <article className="space-y-12">
            {content.sections.map((section, i) => (
              <section key={section.h2} id={`section-${i + 1}`} className="scroll-mt-28 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">{section.h2}</h2>
                {section.blocks.map((block, j) => (
                  <Fragment key={j}>
                    <BlockView block={block} locale={locale} />
                  </Fragment>
                ))}
              </section>
            ))}

            {/* HowTo steps – visible counterpart of the HowTo JSON-LD */}
            {schema.type === "howto" && (
              <section id="steps" className="scroll-mt-28 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">{schema.name}</h2>
                <ol className="space-y-4">
                  {schema.steps.map((step, i) => (
                    <li key={step.name} id={`step-${i + 1}`} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="mb-1 font-bold text-foreground">{step.name}</p>
                        <p className="leading-relaxed text-foreground/85">
                          <RichText text={step.text} locale={locale} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* ── FAQ (mirrors FAQPage JSON-LD) ── */}
            <section id="faq" className="scroll-mt-28 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("faq")}</h2>
              <div className="space-y-3">
                {content.faq.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 open:shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground">
                      <h3 className="text-base">{f.q}</h3>
                      <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 leading-loose text-foreground/85">
                      <RichText text={f.a} locale={locale} />
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </article>

          {/* ── CTA ── */}
          <aside className="mt-14 rounded-3xl gradient-primary p-8 text-center text-white shadow-lg">
            <p className="mb-3 text-2xl font-black">{content.cta.title}</p>
            <p className="mx-auto mb-6 max-w-xl leading-relaxed text-white/85">{content.cta.text}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={localHref(content.cta.href, locale)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-primary shadow-md transition-all hover:bg-white/90"
              >
                {content.cta.label}
                <Arrow className="h-4 w-4" />
              </Link>
              {content.cta.secondary && (
                <Link
                  href={localHref(content.cta.secondary.href, locale)}
                  className="inline-flex items-center rounded-xl border-2 border-white/40 px-6 py-3 font-bold text-white transition-all hover:bg-white/10"
                >
                  {content.cta.secondary.label}
                </Link>
              )}
            </div>
          </aside>

          {/* ── Related pages (internal linking) ── */}
          {related.length > 0 && (
            <nav aria-label={t("related")} className="mt-14">
              <h2 className="mb-4 text-xl font-bold text-foreground">{t("related")}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.key}>
                    <Link
                      href={`/${locale}${r.def.path}`}
                      className="flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {r.content!.keyword}
                      <Arrow className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
