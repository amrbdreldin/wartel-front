import { SeoContentPage, seoPageMetadata } from "@/components/seo/SeoContentPage";
import type { Metadata } from "next";

// Content: src/content/seo-pages
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return seoPageMetadata("free", locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <SeoContentPage pageKey="free" locale={locale} />;
}
