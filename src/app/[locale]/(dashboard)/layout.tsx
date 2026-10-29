import { DashboardShell } from "@/components/layout/DashboardShell";
import type { Metadata } from "next";

// Private, authenticated area – keep it out of search & AI indexes
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

// ============================================================
// Dashboard Layout – Shared sidebar + topbar shell
// ============================================================

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <DashboardShell locale={locale}>{children}</DashboardShell>;
}
