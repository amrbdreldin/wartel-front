import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getTenantConfig } from "@/utils/saas";
import { LOCALES } from "@/lib/constants";
import { AI_BOTS, BLOCKED_BOTS, PRIVATE_SEGMENTS, getBaseUrl } from "@/lib/seo";

// Explicit per-locale prefixes (no wildcards) so "/ar/parent" is blocked
// while the public "/ar/register/parent" page stays crawlable.
const privatePaths = [
  "/api/",
  ...LOCALES.flatMap((locale) => PRIVATE_SEGMENTS.map((segment) => `/${locale}/${segment}`)),
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const saasConfig = await getTenantConfig(headersList.get("host") || "");
  const directives = saasConfig.seo_and_metadata.robots_directives || "index, follow";
  const baseUrl = await getBaseUrl();

  // If the tenant forbids indexing in their SaaS config, disallow everything
  if (directives.toLowerCase().includes("noindex")) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      // Abusive SEO scrapers – no value, only load
      { userAgent: BLOCKED_BOTS, disallow: "/" },
      // AI search / answer engines (GEO & AEO) – welcome on public pages
      // (crawlDelay is a hint for bots that honour it; middleware enforces a hard rate limit with 429)
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: privatePaths, crawlDelay: 10 },
      // Everyone else (Googlebot, Bingbot, …). /_next/ must stay crawlable so Google can render CSS/JS.
      { userAgent: "*", allow: "/", disallow: privatePaths },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
