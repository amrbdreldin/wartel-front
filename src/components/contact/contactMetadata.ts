import { getTenantConfig } from "@/utils/saas";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

// ============================================================
// Shared, localized metadata for every Contact Us route.
// `absolute` because role layouts (e.g. student/layout.tsx) set a plain title,
// which stops the `[locale]/layout.tsx` "%s | academy" template from reaching these pages.
// ============================================================

export async function generateContactMetadata(
  params: Promise<{ locale: string }>
): Promise<Metadata> {
  const { locale } = await params;
  const [t, headersList] = await Promise.all([
    getTranslations({ locale, namespace: "contactUs" }),
    headers(),
  ]);
  const { tenant_metadata } = await getTenantConfig(headersList.get("host") || "");

  return {
    title: { absolute: `${t("metaTitle")} | ${tenant_metadata.academy_name}` },
    description: t("metaDescription", { academyName: tenant_metadata.academy_name }),
  };
}
