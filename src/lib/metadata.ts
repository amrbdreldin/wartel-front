import { getTenantConfig } from "@/utils/saas";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

// ============================================================
// Metadata helpers for dashboard routes
// Pages under (dashboard) are client components, so titles come from layouts.
// ============================================================

type LayoutProps = { params: Promise<{ locale: string }> };

/**
 * Role layout (student / teacher / parent): localized default title and a
 * "%s | <academy>" template that every nested section title inherits.
 */
export function roleLayoutMetadata(titleKey: string) {
  return async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { locale } = await params;
    const [t, headersList] = await Promise.all([getTranslations({ locale }), headers()]);
    const { tenant_metadata } = await getTenantConfig(headersList.get("host") || "");
    const academy = tenant_metadata.academy_name;

    return {
      title: {
        // The [locale] layout template already appends the academy name to this default
        default: t(titleKey),
        template: `%s | ${academy}`,
      },
    };
  };
}

/** Section layout: just the localized section name (suffix comes from the role template) */
export function sectionMetadata(titleKey: string) {
  return async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return { title: t(titleKey) };
  };
}
