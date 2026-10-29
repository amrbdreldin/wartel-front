import { ContactUsView } from "@/components/contact/ContactUsView";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.contactUs" });
  return buildPageMetadata({
    locale,
    path: "/contact-us",
    title: t("title"),
    description: t("description"),
  });
}

export default async function GeneralContactUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <DashboardShell locale={locale}>
      <ContactUsView />
    </DashboardShell>
  );
}
