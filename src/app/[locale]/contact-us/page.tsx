import { ContactUsView } from "@/components/contact/ContactUsView";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { generateContactMetadata } from "@/components/contact/contactMetadata";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return generateContactMetadata(params);
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
