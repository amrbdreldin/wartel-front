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

  // Type errors fail the build. If a low-RAM build server runs out of memory,
  // set SKIP_TYPECHECK=1 there and run `yarn typecheck` in CI instead.
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPECHECK === "1",
  },

  // Disable production source maps to save memory
  productionBrowserSourceMaps: false,

  // Memory & CPU optimizations for resource-constrained build environments
  experimental: {
    webpackMemoryOptimizations: true,
    cpus: 1,
  },

  webpack: (config, { dev }) => {
    // Disable Webpack persistent cache during production build to prevent memory bloat and OOM
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
  
  // Image optimization — only known media hosts may be proxied through /_next/image.
  // A wildcard here lets anyone use the optimizer as an open image proxy.
  // Add extra hosts (e.g. a new tenant CDN) via IMAGE_REMOTE_HOSTS="cdn.a.com,*.b.com".
  images: {
    remotePatterns: [
      "wartel.amrbdr.com",
      "api.warattel.com",
      "admin.wartel-academy.com",
      "**.r2.dev",
      "img.youtube.com",
      "**.ytimg.com",
      "images.unsplash.com",
      ...(process.env.IMAGE_REMOTE_HOSTS || "")
        .split(",")
        .map((host) => host.trim().replace(/^\*\./, "**."))
        .filter(Boolean),
    ].map((hostname) => ({ protocol: "https", hostname })),
  },

  // Strip console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

// التصدير النظيف والمعدل للعمل مع كوليفاي
export default withNextIntl(withPWA(nextConfig));