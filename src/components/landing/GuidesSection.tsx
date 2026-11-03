import { BLOG_PAGES, HOME_LINKED_PAGES, SEO_PAGES } from "@/content/seo-pages";
import type { Locale } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

// ============================================================
// Homepage → keyword landing pages & blog (internal linking).
// Anchor text is each page's primary keyword.
// ============================================================

export async function GuidesSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "seoPages" });
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const pick = (keys: typeof HOME_LINKED_PAGES) =>
    keys
      .map((key) => ({ def: SEO_PAGES[key], content: SEO_PAGES[key].content[locale as Locale] }))
      .filter((p) => p.content);
  const pages = pick(HOME_LINKED_PAGES);
  const posts = pick(BLOG_PAGES);

  return (
    <section id="guides" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 font-bold text-primary">{t("sectionSubtitle")}</p>
          <h2 className="mb-4 text-3xl font-black text-foreground md:text-4xl">{t("sectionTitle")}</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">{t("sectionDesc")}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map(({ def, content }) => (
            <li key={def.key}>
              <Link
                href={`/${locale}${def.path}`}
                className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
              >
                <span className="text-lg font-bold leading-snug text-foreground">{content!.keyword}</span>
                <Arrow className="h-5 w-5 text-primary" />
              </Link>
            </li>
          ))}
        </ul>

        {posts.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 text-center text-xl font-bold text-foreground">{t("blogTitle")}</h3>
            <ul className="flex flex-wrap justify-center gap-3">
              {posts.map(({ def, content }) => (
                <li key={def.key}>
                  <Link
                    href={`/${locale}${def.path}`}
                    className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-5 py-2 font-bold text-primary transition-colors hover:bg-primary/10"
                  >
                    {content!.keyword}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
