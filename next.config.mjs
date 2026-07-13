import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

// إعدادات البيئة لتجاهل الفحوصات الثقيلة أثناء البناء
process.env.ESLINT_NO_DEV_ERRORS = "true";
process.env.NEXT_DISABLE_ESLINT = "true";
process.env.NEXT_IGNORE_TYPE_CHECK = "true";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  output: "standalone",
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Strip console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

// التصدير النظيف والمعدل للعمل مع كوليفاي
export default withNextIntl(withPWA(nextConfig));