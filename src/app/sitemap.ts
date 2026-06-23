import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // High-level SEO requires identifying all public crawlable routes.
  // In a fully scaled SaaS, we would query the database here to include dynamic public pages (e.g. public course catalogs).
  const coreRoutes = ["", "/login", "/register", "/about"];

  return coreRoutes.flatMap((route) => [
    {
      url: `${baseUrl}/ar${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${route}`,
          en: `${baseUrl}/en${route}`,
          // Provide an x-default fallback for untargeted GEOs
          "x-default": `${baseUrl}/ar${route}`, 
        },
      },
    },
    {
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${route}`,
          en: `${baseUrl}/en${route}`,
          "x-default": `${baseUrl}/ar${route}`,
        },
      },
    },
  ]);
}
