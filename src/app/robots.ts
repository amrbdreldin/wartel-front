import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getTenantConfig } from "@/utils/saas";

const blockedUserAgents = [
  "Bytespider",
  "PetalBot",
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "facebookexternalhit",
  "Amazonbot",
  "SemrushBot",
  "AhrefsBot",
  "DotBot",
  "MJ12bot",
  "cohere-ai",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const saasConfig = await getTenantConfig(host);
  const directives = saasConfig.seo_and_metadata.robots_directives || "index, follow";
  
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // If the tenant forbids indexing in their SaaS config, disallow everything
  if (directives.toLowerCase().includes("noindex")) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  // Enterprise defaults for an Educational Platform
  return {
    rules: [
      {
        userAgent: blockedUserAgents,
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        // Secure private boundaries
        disallow: [
          "/api/", 
          "/_next/", 
          "/*/dashboard/", 
          "/*/admin/", 
          "/*/student/", 
          "/*/teacher/"
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
