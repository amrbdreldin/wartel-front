import { MetadataRoute } from "next";
import { LOCALES } from "@/lib/constants";
import { PUBLIC_ROUTES, buildLanguages, getBaseUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();

  return PUBLIC_ROUTES.flatMap(({ path, priority, changeFrequency, lastModified, locales = LOCALES }) => {
    const languages = buildLanguages(baseUrl, path, locales);

    return locales.map((locale) => ({
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
