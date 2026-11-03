import { SeoContentPage, seoPageMetadata } from "@/components/seo/SeoContentPage";
import { BLOG_PAGES, SEO_PAGES } from "@/content/seo-pages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Blog posts: src/content/seo-pages (kind "article"); currently Arabic-only
type Props = { params: Promise<{ locale: string; slug: string }> };

function postKey(slug: string) {
  return BLOG_PAGES.find((key) => SEO_PAGES[key].path === `/blog/${slug}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const key = postKey(slug);
  return key ? seoPageMetadata(key, locale) : {};
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const key = postKey(slug);
  if (!key) notFound();
  return <SeoContentPage pageKey={key} locale={locale} />;
}
