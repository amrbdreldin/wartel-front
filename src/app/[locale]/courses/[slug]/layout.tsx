import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "seo.joinCourse" });
  return buildPageMetadata({
    locale,
    path: `/courses/${slug}`,
    title: t("title"),
    description: t("description"),
    noindex: true,
  });
}

export default function JoinCourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
