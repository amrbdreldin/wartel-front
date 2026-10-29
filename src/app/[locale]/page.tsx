import { AboutSection } from "@/components/landing/AboutSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ProgramsSection } from "@/components/landing/ProgramsSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { AchievementsSection } from "@/components/landing/AchievementsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TimelineSection } from "@/components/landing/TimelineSection";
import { buildPageMetadata, fetchPublicFaqs, getBaseUrl, jsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  return buildPageMetadata({ locale, title: t("title"), description: t("description") });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const [t, faqs, baseUrl, headersList] = await Promise.all([
    getTranslations({ locale, namespace: "landing" }),
    fetchPublicFaqs(locale),
    getBaseUrl(),
    headers(),
  ]);
  const nonce = headersList.get("x-nonce") || undefined;
  const pageUrl = `${baseUrl}/${locale}`;
  const organization = { "@id": `${baseUrl}/#organization` };

  // Structured data mirrors visible page content: tracks (ProgramsSection) and FAQs (FaqSection)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t("about.title"),
        description: t("about.desc"),
        inLanguage: locale,
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: organization,
        primaryImageOfPage: `${baseUrl}/og-image.jpg`,
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#programs`,
        name: t("programs.title"),
        description: t("programs.desc"),
        itemListElement: [1, 2, 3, 4].map((n) => ({
          "@type": "ListItem",
          position: n,
          item: {
            "@type": "Course",
            name: t(`programs.p${n}Title`),
            description: t(`programs.p${n}Desc`),
            educationalLevel: t(`programs.p${n}Tag`),
            inLanguage: "ar",
            isAccessibleForFree: true,
            provider: organization,
            offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
            },
          },
        })),
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary selection:text-primary-foreground selection:bg-opacity-90">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <TimelineSection />
        <ProgramsSection />
        <StatsSection />
        <AchievementsSection />
        <TestimonialsSection />
        <CtaSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
