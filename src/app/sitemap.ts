import { MetadataRoute } from "next";
import { LOCALES } from "@/lib/constants";
import { DEFAULT_SEO_LOCALE, PUBLIC_ROUTES, getBaseUrl } from "@/lib/seo";

// Stable per-deploy timestamp – a fresh `new Date()` per request tells crawlers
// every page changed on every fetch, which erodes trust in <lastmod>.
const LAST_MODIFIED = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();

  return PUBLIC_ROUTES.flatMap(({ path, priority, changeFrequency }) => {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) languages[l] = `${baseUrl}/${l}${path}`;
    languages["x-default"] = `${baseUrl}/${DEFAULT_SEO_LOCALE}${path}`;

    return LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: { languages },
      ...(path === "" ? { images: [`${baseUrl}/og-image.jpg`, `${baseUrl}/hero.png`] } : {}),
    }));
  });
}
