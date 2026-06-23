import { TenantSaaSConfig } from "@/types/saas";

// Default system branding that matches existing global.css variables
export const DEFAULT_SAAS_CONFIG: TenantSaaSConfig = {
  tenant_metadata: {
    tenant_id: "default-system-tenant",
    academy_name: "ورتل - أكاديمية القرآن",
    legal_name: "Wartel Learning Systems LLC",
    slug: "default",
    status: "ACTIVE",
    subscription_tier: "COMMUNITY",
    created_at: new Date().toISOString(),
  },
  branding: {
    logos: {
      light_mode_logo_url: "/logo.svg",
      dark_mode_logo_url: "/logo.svg",
      collapsed_sidebar_logo_url: "/logo-icon.svg",
      favicon_url: "/favicon.ico",
    },
    typography: {
      font_sans_latin: "Inter",
      font_arabic: "Tajawal",
      font_heading: "Tajawal",
      font_weights: ["300", "400", "500", "700", "800"],
    },
    visual_settings: {
      border_radius: "0.625rem",
      glassmorphism_intensity: "medium",
      dashboard_layout_variant: "sidebar-collapsible",
    },
    theme_colors: {
      light: {
        primary: "#008F8F",
        primary_foreground: "#FFFFFF",
        secondary: "#F1F5F9",
        secondary_foreground: "#1A1D23",
        accent: "#ED8A22",
        accent_foreground: "#FFFFFF",
        background: "#FAFBFC",
        foreground: "#1A1D23",
        card: "#FFFFFF",
        card_foreground: "#1A1D23",
        popover: "#FFFFFF",
        popover_foreground: "#1A1D23",
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#008F8F",
        sidebar: "#FFFFFF",
        sidebar_foreground: "#1A1D23",
        sidebar_primary: "#008F8F",
        sidebar_accent: "#F0FDFA",
      },
      dark: {
        primary: "#00B3B3",
        primary_foreground: "#0F1117",
        secondary: "#1E2130",
        secondary_foreground: "#F1F5F9",
        accent: "#F5A94D",
        accent_foreground: "#0F1117",
        background: "#0F1117",
        foreground: "#F1F5F9",
        card: "#1A1D27",
        card_foreground: "#F1F5F9",
        popover: "#1A1D27",
        popover_foreground: "#F1F5F9",
        border: "#2D3148",
        input: "#2D3148",
        ring: "#00B3B3",
        sidebar: "#141620",
        sidebar_foreground: "#F1F5F9",
        sidebar_primary: "#00B3B3",
        sidebar_accent: "#1E2835",
      },
    },
  },
  localization: {
    default_locale: "ar",
    supported_locales: ["ar", "en"],
    direction_default: "rtl",
    timezone: "Asia/Riyadh",
    currency_code: "SAR",
    currency_symbol: "ر.س",
    number_format: "arabic-east",
    date_format: "YYYY-MM-DD",
  },
  seo_and_metadata: {
    global_meta_title_suffix: "منصة ورتل التعليمية",
    default_meta_description: "منصة قرآنية متكاملة لإدارة الحلقات والتسميع والمتابعة",
    default_keywords: ["Quran", "Academy", "LMS", "Wartel", "ورتل", "حلقات", "تسميع"],
    default_share_image_url: "/og-image.jpg",
    google_site_verification_id: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID || "",
    sitemap_frequency: "daily",
    robots_directives: "index, follow",
  },
  contact_and_support: {
    support_email: "support@warattel.com",
    contact_phone: "+966500000000",
    whatsapp_number: "201229449474",
  },
  feature_flags: {
    enable_student_excuses: true,
    enable_teacher_requests: true,
    enable_parent_portal: true,
    enable_digital_library: true,
    enable_exams_module: true,
    enable_grade_entry: true,
    enable_notifications_bell: true,
    enable_dark_mode_toggle: true,
    enable_role_switching_dev_mode: true,
    allow_student_self_registration: true,
  },
  quotas_and_limits: {
    max_students: 1000,
    max_teachers: 50,
    max_supervisors: 10,
    max_cloud_storage_bytes: 100 * 1024 * 1024 * 1024,
    max_simultaneous_video_rooms: 20,
  },
  integrations: {
    google_tag_manager_id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || "GTM-DEMO123", // Demo ID as requested
    google_analytics_id: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-R22ZFH7GKK",
  },
};

/**
 * Dynamically resolves the SaaS Tenant Configuration based on the host domain.
 * In a real SaaS, this performs a server-side DB query or fetch request to cache-optimized routes.
 * 
 * @param host The request host domain (e.g., academy.warattel.com or school.domain.com)
 */
export async function getTenantConfig(host?: string): Promise<TenantSaaSConfig> {
  // If no host, or in local development without custom domains, return default configuration
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return DEFAULT_SAAS_CONFIG;
  }

  // Example placeholder of dynamic domain loading:
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/by-domain?domain=${host}`, {
    //   next: { revalidate: 3600 } // cache for 1 hour
    // });
    // if (res.ok) return await res.json();
    return DEFAULT_SAAS_CONFIG;
  } catch (err) {
    console.error("Failed to load tenant configuration dynamically:", err);
    return DEFAULT_SAAS_CONFIG;
  }
}
