import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { RTL_LOCALES, type Locale } from "@/lib/constants";
import Providers from "@/store/provider";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { OG_LOCALES, SOCIAL_PROFILES, getBaseUrl, jsonLd } from "@/lib/seo";
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
  const saasConfig = await getTenantConfig(headersList.get("host") || "");
  const { tenant_metadata, seo_and_metadata } = saasConfig;
  const t = await getTranslations({ locale, namespace: "seo" });
  const baseUrl = await getBaseUrl();
  const siteName = locale === "ar" ? tenant_metadata.academy_name : t("siteName");
  const description =
    locale === "ar"
      ? seo_and_metadata.default_meta_description || t("home.description")
      : t("home.description");
  const shareImageUrl = seo_and_metadata.default_share_image_url || "/og-image.jpg";
  const publisher = tenant_metadata.legal_name || tenant_metadata.academy_name;

  // NOTE: no `alternates.canonical` here – a layout-level canonical is inherited by every page
  // and would point them all at the home page. Public pages set their own via buildPageMetadata().
  return {
    metadataBase: new URL(baseUrl),
    applicationName: siteName,
    title: {
      template: `%s | ${siteName}`,
      default: t("home.title"),
    },
    description,
    keywords: [...seo_and_metadata.default_keywords, tenant_metadata.academy_name],
    authors: [{ name: publisher }],
    creator: publisher,
    publisher,
    category: "education",
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
      title: siteName,
      statusBarStyle: "default",
      startupImage: "/apple-touch-icon.png",
    },
    verification: {
      google: seo_and_metadata.google_site_verification_id || undefined,
    },
    formatDetection: {
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: t("home.title"),
      description,
      url: `${baseUrl}/${locale}`,
      siteName,
      images: [
        {
          url: shareImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.ar,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("home.title"),
      description,
      images: [shareImageUrl],
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
  const baseUrl = await getBaseUrl();
  const t = await getTranslations({ locale, namespace: "seo" });
  const { tenant_metadata, contact_and_support } = saasConfig;
  const whatsapp = contact_and_support.whatsapp_number || contact_and_support.contact_phone;

  // Site-wide entity graph: lets Google / AI engines identify the academy, its site and official profiles
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "NGO"],
        "@id": `${baseUrl}/#organization`,
        name: tenant_metadata.academy_name,
        alternateName: [t("siteName"), "Wartel Academy", "أكاديمية ورتل", "ورتل"],
        legalName: tenant_metadata.legal_name || tenant_metadata.academy_name,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
        image: `${baseUrl}/og-image.jpg`,
        description: t("home.description"),
        sameAs: SOCIAL_PROFILES,
        knowsAbout: ["Quran memorization", "Tajweed", "Ijazah", "Noorani Qaida", "تحفيظ القرآن", "التجويد", "الإجازات القرآنية"],
        knowsLanguage: ["ar", "en"],
        contactPoint: {
          "@type": "ContactPoint",
          email: contact_and_support.support_email,
          telephone: whatsapp ? `+${whatsapp.replace(/^\+/, "")}` : undefined,
          contactType: "customer support",
          availableLanguage: ["Arabic", "English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: locale === "ar" ? tenant_metadata.academy_name : t("siteName"),
        description: t("home.description"),
        inLanguage: locale,
        publisher: { "@id": `${baseUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
      </head>
      <body
        suppressHydrationWarning
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
