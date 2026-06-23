export interface ThemeColorSet {
  primary: string;
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  accent: string;
  accent_foreground: string;
  background: string;
  foreground: string;
  card: string;
  card_foreground: string;
  popover: string;
  popover_foreground: string;
  border: string;
  input: string;
  ring: string;
  sidebar: string;
  sidebar_foreground: string;
  sidebar_primary: string;
  sidebar_accent: string;
}

export interface BrandingConfig {
  logos: {
    light_mode_logo_url: string;
    dark_mode_logo_url: string;
    collapsed_sidebar_logo_url: string;
    favicon_url: string;
  };
  typography: {
    font_sans_latin: string;
    font_arabic: string;
    font_heading: string;
    font_weights: string[];
  };
  visual_settings: {
    border_radius: string;
    glassmorphism_intensity: string;
    dashboard_layout_variant: string;
  };
  theme_colors: {
    light: ThemeColorSet;
    dark: ThemeColorSet;
  };
}

export interface LocalizationConfig {
  default_locale: string;
  supported_locales: string[];
  direction_default: "rtl" | "ltr";
  timezone: string;
  currency_code: string;
  currency_symbol: string;
  number_format: string;
  date_format: string;
}

export interface SEOConfig {
  global_meta_title_suffix: string;
  default_meta_description: string;
  default_keywords: string[];
  default_share_image_url: string;
  google_site_verification_id?: string;
  sitemap_frequency: string;
  robots_directives: string;
}

export interface FeatureFlags {
  enable_student_excuses: boolean;
  enable_teacher_requests: boolean;
  enable_parent_portal: boolean;
  enable_digital_library: boolean;
  enable_exams_module: boolean;
  enable_grade_entry: boolean;
  enable_notifications_bell: boolean;
  enable_dark_mode_toggle: boolean;
  enable_role_switching_dev_mode: boolean;
  allow_student_self_registration: boolean;
}

export interface QuotasLimits {
  max_students: number;
  max_teachers: number;
  max_supervisors: number;
  max_cloud_storage_bytes: number;
  max_simultaneous_video_rooms: number;
}

export interface IntegrationKeys {
  google_tag_manager_id?: string;
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  sentry_dsn?: string;
  google_meet_client_id?: string;
  zoom_client_id?: string;
  payment_gateways?: {
    stripe?: {
      enabled: boolean;
      publishable_key: string;
      currency_supported: string[];
    };
    paytabs?: {
      enabled: boolean;
      merchant_id: string;
      profile_id: string;
      currency_supported: string[];
    };
  };
}

export interface TenantSaaSConfig {
  tenant_metadata: {
    tenant_id: string;
    academy_name: string;
    legal_name: string;
    slug: string;
    custom_domain?: string;
    status: "ACTIVE" | "SUSPENDED" | "MAINTENANCE";
    subscription_tier: string;
    created_at: string;
  };
  branding: BrandingConfig;
  localization: LocalizationConfig;
  seo_and_metadata: SEOConfig;
  contact_and_support: {
    support_email: string;
    contact_phone: string;
    whatsapp_number?: string;
    telegram_channel?: string;
    social_links?: Record<string, string>;
  };
  feature_flags: FeatureFlags;
  quotas_and_limits: QuotasLimits;
  integrations: IntegrationKeys;
}
export type SaasBrandingPayload = BrandingConfig;
