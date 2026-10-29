import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.registerParent" });
  return buildPageMetadata({
    locale,
    path: "/register/parent",
    title: t("title"),
    description: t("description"),
  });
}

export default function ParentRegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
