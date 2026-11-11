import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const t = await getTranslations({ locale, namespace: "seo.qrRedirect" });
  return buildPageMetadata({
    locale,
    path: `/qr/${code}`,
    title: t("title"),
    description: t("description"),
    noindex: true,
  });
}

export default function QrRedirectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
