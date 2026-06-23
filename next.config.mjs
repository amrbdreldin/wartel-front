import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

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

const sentryConfig = {
  org: "warattel-academy",
  project: "warattel-academy",

  // Source map upload auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload wider set of client source files for better stack trace resolution
  widenClientFileUpload: true,

  // Create a proxy API route to bypass ad-blockers
  tunnelRoute: "/monitoring",

  // Suppress non-CI output
  silent: !process.env.CI,
};

export default withSentryConfig(withNextIntl(withPWA(nextConfig)), sentryConfig);


