import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { RTL_LOCALES, type Locale } from "@/lib/constants";
import Providers from "@/store/provider";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getTenantConfig } from "@/utils/saas";
import TenantThemeProvider from "@/components/providers/TenantThemeProvider";
import DynamicAnalyticsProvider from "@/components/providers/DynamicAnalyticsProvider";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import PWAInstallPrompt from "@/components/common/PWAInstallPrompt";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { ScrollToTop } from "@/components/common/ScrollToTop";

// ============================================================
// Fonts
// ============================================================
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// ============================================================
// Metadata
// ============================================================
export const viewport: Viewport = {
  themeColor: "#8B6914",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const saasConfig = await getTenantConfig(host);
  const { tenant_metadata, seo_and_metadata } = saasConfig;
  const logoUrl = saasConfig.branding.logos.light_mode_logo_url || "/icon.png";

  return {
    title: {
      template: `%s | ${tenant_metadata.academy_name}`,
      default: `${tenant_metadata.academy_name}`,
    },
    description: seo_and_metadata.default_meta_description || "منصة قرآنية متكاملة لإدارة الحلقات والتسميع والمتابعة",
    keywords: [...seo_and_metadata.default_keywords, tenant_metadata.academy_name],
    authors: [{ name: tenant_metadata.legal_name || tenant_metadata.academy_name }],
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: saasConfig.branding.logos.favicon_url || "/favicon.ico",
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    appleWebApp: {
      capable: true,
      title: tenant_metadata.academy_name,
      statusBarStyle: "default",
      startupImage: "/apple-touch-icon.png",
    },
    verification: {
      google: seo_and_metadata.google_site_verification_id,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      title: tenant_metadata.academy_name,
      description: seo_and_metadata.default_meta_description || "منصة قرآنية متكاملة لإدارة الحلقات والتسميع والمتابعة",
      url: `https://${host}/${locale}`,
      siteName: tenant_metadata.academy_name,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: tenant_metadata.academy_name,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tenant_metadata.academy_name,
      description: seo_and_metadata.default_meta_description || "منصة قرآنية متكاملة لإدارة الحلقات والتسميع والمتابعة",
      images: [logoUrl],
    },
    alternates: {
      canonical: `https://${host}/${locale}`,
    },
  };
}

// ============================================================
// Locale Layout
// ============================================================
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr";

  // Fetch SaaS configurations dynamically at runtime by extracting host header
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const nonce = headersList.get("x-nonce") || "";
  const saasConfig = await getTenantConfig(host);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: saasConfig.tenant_metadata.academy_name,
              legalName: saasConfig.tenant_metadata.legal_name || saasConfig.tenant_metadata.academy_name,
              url: `https://${host}`,
              logo: saasConfig.branding.logos.light_mode_logo_url,
              description: saasConfig.seo_and_metadata.default_meta_description,
              contactPoint: {
                "@type": "ContactPoint",
                email: saasConfig.contact_and_support.support_email,
                telephone: saasConfig.contact_and_support.contact_phone,
                contactType: "customer support",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${tajawal.variable} ${inter.variable} ${
          dir === "rtl" ? "font-arabic" : "font-sans"
        } antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <TenantThemeProvider branding={saasConfig.branding}>
              <DynamicAnalyticsProvider 
                integrations={saasConfig.integrations} 
                tenantSlug={saasConfig.tenant_metadata.slug}
                nonce={nonce}
              >
                {children}
                <CookieConsentBanner />
                <PWAInstallPrompt />
                <FloatingWhatsApp whatsappNumber={saasConfig.contact_and_support.whatsapp_number || saasConfig.contact_and_support.contact_phone} />
                <ScrollToTop />
              </DynamicAnalyticsProvider>
            </TenantThemeProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
