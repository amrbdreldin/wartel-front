import { MetadataRoute } from "next";
import { LOCALES } from "@/lib/constants";
import { DEFAULT_SEO_LOCALE, PUBLIC_ROUTES, getBaseUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();

  return PUBLIC_ROUTES.flatMap(({ path, priority, changeFrequency, lastModified }) => {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) languages[l] = `${baseUrl}/${l}${path}`;
    languages["x-default"] = `${baseUrl}/${DEFAULT_SEO_LOCALE}${path}`;

    return LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      // Fixed per-route date – a fresh `new Date()` per request makes <lastmod> meaningless to crawlers
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
      ...(path === "" ? { images: [`${baseUrl}/og-image.jpg`, `${baseUrl}/hero.png`] } : {}),
    }));
  });
}
