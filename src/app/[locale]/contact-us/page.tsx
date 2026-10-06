import { ContactUsView } from "@/components/contact/ContactUsView";
import { DashboardShell } from "@/components/layout/DashboardShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - نظام التذاكر | أكاديمية ورتل",
  description:
    "تواصل مع إدارة أكاديمية ورتل واستفسر عن الحلقات وتابع تذاكر الدعم الفني بكل سهولة.",
};

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
