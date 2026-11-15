import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PublicLibraryClient } from "@/components/library/PublicLibraryClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "publicLibrary" });
  return buildPageMetadata({
    locale,
    path: "/library",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default function PublicLibraryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1 bg-background">
        <PublicLibraryClient />
      </main>
      <LandingFooter />
    </div>
  );
}
