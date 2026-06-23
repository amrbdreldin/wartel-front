# Warattel Academy: Enterprise Auditing & Before-and-After Enhancement Report

This report provides a detailed, production-grade technical comparison and implementation plan across the **7 core pillars of modern web applications** requested. Every comparison is grounded directly in the Warattel Academy stack: **Next.js 16.2 (App Router)**, **React 19.2**, **Tailwind CSS v4**, **Redux Toolkit**, **next-intl (multilingual AR/EN)**, and **@sentry/nextjs**.

---

## 🛠️ The Architecture Stack Baseline
*   **Package Manager:** Yarn
*   **Styling:** Tailwind CSS v4 (logical properties for bidirectional AR/EN flows)
*   **State:** Redux Toolkit (`authSlice`, `uiSlice`, `notificationSlice`)
*   **API Management:** TanStack React Query v5 + Axios
*   **Validation:** Formik + Yup
*   **Error Monitoring:** Sentry Next.js SDK

---

## 📊 Executive Before & After Summary

| # | Pillar | Before Status (Standard / legacy pattern) | After Status (Enterprise-grade implementation) |
|---|---|---|---|
| **1** | **UI/UX Interaction & Forms** | Forms fail silently on large viewports; loading states rely on basic boolean state; generic WCAG outlines are missing. | Auto-scroll to form errors; mutation-linked load states; Base UI / Radix primitives with WCAG 2.1 AA keyboard focus. |
| **2** | **Responsive & RTL (AR/EN)** | Bidirectional layout achieved via separate classes or hardcoded `ml-4` / `mr-4`; mobile elements have small touch surfaces. | 100% Tailwind v4 logical CSS properties (`ms-*`, `pe-*`, `start-*`); `48x48px` minimum touch target; Playwright visual snapshots. |
| **3** | **SEO & Dynamic GEO** | Static layout metadata; missing translation alternates (`hreflang`); single static sitemap; default routing for regional users. | Layout metadata generator reading SaaS branding configurations; dynamic hreflangs; dynamic `sitemap.ts`; Edge Geolocation routing. |
| **4** | **Performance & Web Vitals** | Layout shifts (CLS) on dynamic query updates; large bundle sizes from charts; unoptimized static landing page elements. | Image preloads with Priority; layout-reserved height slots; lazy component bundles (`next/dynamic`); CDN caching & ISR. |
| **5** | **Automated Testing Suite** | No test runner configured in `package.json`; frontend queries hit mock mockups rather than actual service proxies. | Vitest and React Testing Library; network layer mocking via Mock Service Worker (MSW); multi-viewport E2E Playwright tests. |
| **6** | **Enterprise Security** | Default Vercel headers; unprotected local storage session caching; dynamic HTML content rendered unsanitized. | Multi-layer Content Security Policy (CSP); HttpOnly, Secure, SameSite=Lax cookies; DOMPurify sanitization; CI dependency scans. |
| **7** | **GTM & GA4 Telemetry** | Blocked script loads; flat tag integrations without multi-tenant segmentations; tracking without user consent. | Performance-first tag injection; dynamic partitioned GTM DataLayer with tenant IDs; Google Consent Mode v2 integration. |

---

## 1. UI/UX: Interactive Forms & Accessibility

### 1.1 Form Validation & Smooth Error Focusing
*   **Before:** When users submit long registration forms (e.g., student path selection + audio file uploads), Yup validation fails silently. If the invalid field is off-screen, the user sees nothing happening and repeatedly clicks "Submit," leading to high abandonment rates.
*   **After:** Inject an active Formik helper `<ScrollToFieldError />` that tracks validation state. On invalid submit, the viewport automatically, smoothly scrolls to center the first invalid input element.

```tsx
// src/app/[locale]/(auth)/register/_components/ScrollToFieldError.tsx
"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";

export function ScrollToFieldError() {
  const { submitCount, isValid, errors } = useFormikContext();

  useEffect(() => {
    if (submitCount > 0 && !isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        // Query elements by name attribute (standard input) or ID (custom selectors)
        const errorElement =
          document.querySelector(`[name="${firstErrorKey}"]`) ||
          document.getElementById(firstErrorKey);
        
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          
          // If the element can be focused (like standard inputs), trigger focus
          if (errorElement instanceof HTMLElement) {
            errorElement.focus({ preventScroll: true });
          }
        }
      }
    }
  }, [submitCount, isValid, errors]);

  return null;
}
```

### 1.2 Context-Aware Submission Feedback
*   **Before:** Forms use generic loading indicators or disable buttons using simple local booleans. Double-clicking remains common because form libraries process async validation prior to updating internal submission states.
*   **After:** Disable forms directly using TanStack React Query’s mutation `isPending` state. Replace the button contents dynamically with context-specific translations (`جاري الحفظ...` / `Saving...`) and localized spinner animations.

```tsx
// src/components/ui/LoadingButton.tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingKey?: string; // Key in global translation JSON (e.g. "auth.saving")
  children: React.ReactNode;
}

export function LoadingButton({ isLoading, loadingKey = "saving", children, ...props }: LoadingButtonProps) {
  const t = useTranslations("common");
  
  return (
    <Button disabled={isLoading || props.disabled} {...props} className="gap-2">
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? t(loadingKey) : children}
    </Button>
  );
}
```

---

## 2. Responsive & Bidirectional RTL/LTR Adaptation

### 2.1 Tailwind CSS v4 Logical Properties
*   **Before:** Handlers use conditional CSS or separate files to accommodate Arabic (RTL) and English (LTR) alignments. Developers hardcode layout rules like `ml-4` or `right-2`, which result in broken layouts when the user toggles the language.
*   **After:** Migrate 100% to **logical CSS properties** native to Tailwind CSS v4. Standardize spatial spacing variables to dynamically switch based on the document direction.

```html
<!-- BEFORE (Incorrect/Manual LTR vs RTL overrides) -->
<div className="pl-4 pr-2 text-left rtl:pr-4 rtl:pl-2 rtl:text-right">
  <span className="mr-2 rtl:ml-2">📖</span>
  <span>قرآن</span>
</div>

<!-- AFTER (Tailwind v4 Clean Bidirectional Logical flow) -->
<div className="ps-4 pe-2 text-start">
  <span className="me-2">📖</span>
  <span>قرآن</span>
</div>
```

| Physical Property | Tailwind v4 Logical Class | LTR Behavior | RTL Behavior |
|---|---|---|---|
| `margin-left` / `margin-right` | `ms-4` / `me-4` | `margin-left` / `margin-right` | `margin-right` / `margin-left` |
| `padding-left` / `padding-right` | `ps-2` / `pe-2` | `padding-left` / `padding-right` | `padding-right` / `padding-left` |
| `left: 0` / `right: 0` | `start-0` / `end-0` | `left: 0` / `right: 0` | `right: 0` / `left: 0` |
| `text-align: left/right` | `text-start` / `text-end` | `text-align: left` | `text-align: right` |

### 2.2 Mobile Touch-Target Safety & Floating Sheets
*   **Before:** Modals and filters on mobile devices open as scaled-down desktop dialogs. Interactive items have a target size of `30px`, rendering them difficult to click on mobile touchscreens.
*   **After:** Restructure responsive wrappers using dynamic breakpoint queries. Transform dialog components to render as standard sheets (bottom drawers) on viewports `< 768px` and guarantee all touchable components have an interactive footprint of at least `48px x 48px`.

```tsx
// src/components/common/ResponsiveDialog.tsx
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export function ResponsiveDialog({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6 rounded-3xl border border-border/50 bg-card glass">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-6 rounded-t-[32px] bg-card border-t border-border/50">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-4" />
        {children}
      </DrawerContent>
    </Drawer>
  );
}
```

---

## 3. SEO (Search Engine Optimization) & GEO (Geographic Localization)

### 3.1 Next.js Dynamic Multi-Tenant Metadata API
*   **Before:** The application renders a single static metadata object defined in `layout.tsx`. Multi-tenant school sites (e.g. `school1.warattel.com` vs `school2.warattel.com`) share identical titles, descriptions, and icon configurations.
*   **After:** Utilize Next.js `generateMetadata` function inside the localized root path `[locale]/layout.tsx`. This dynamically queries tenant branding information at runtime based on the requested host header.

```tsx
// src/app/[locale]/layout.tsx (Usage example in Next.js 16 metadata generator)
import { Metadata } from "next";
import { headers } from "next/headers";
import { getTenantConfig } from "@/utils/saas";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  // Retrieve white-label branding configurations from DB/Cache
  const saasConfig = await getTenantConfig(host);
  const branding = saasConfig.branding;
  
  const titleDefault = locale === "ar" 
    ? branding.tenant_metadata.academy_name_ar || "أكاديمية ورتل"
    : branding.tenant_metadata.academy_name_en || "Warattel Academy";

  const desc = locale === "ar"
    ? branding.tenant_metadata.description_ar
    : branding.tenant_metadata.description_en;

  return {
    title: {
      template: `%s | ${titleDefault}`,
      default: titleDefault,
    },
    description: desc,
    alternates: {
      canonical: `https://${host}/${locale}`,
      languages: {
        ar: `https://${host}/ar`,
        en: `https://${host}/en`,
      },
    },
    openGraph: {
      title: titleDefault,
      description: desc,
      images: [branding.visual_settings.logo_url],
    },
  };
}
```

### 3.2 Dynamic Multi-Tenant robots.txt and sitemap.ts
*   **Before:** Single static `sitemap.xml` file mapping only static pages. Search engines index secure white-label manager dashboards, while failing to discover public pages.
*   **After:** Dynamic route handlers for `sitemap.ts` and `robots.ts` that dynamically filter search visibility depending on the requested sub-tenant's plan settings.

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getTenantConfig } from "@/utils/saas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const config = await getTenantConfig(host);

  // Private white-labeled academies return empty sitemaps
  if (config.tenant_metadata.is_private) {
    return [];
  }

  const baseUrl = `https://${host}`;
  const staticPaths = ["", "/ar", "/en", "/ar/login", "/en/login"];
  
  return staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
```

### 3.3 Vercel Edge Geolocation Router
*   **Before:** Users hitting the root path `/` must manually select their country/language, or the server guesses using standard browser headers, which can be inaccurate.
*   **After:** Middleware leverage Vercel's Geo-location headers (`x-vercel-ip-country`) to automatically redirect target learners to their local currencies, phone prefixes, and dialect directions upon their first visit.

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Process geolocation headers on the root page
  if (pathname === "/") {
    const country = request.headers.get("x-vercel-ip-country") || "US";
    const arabicSpeakingCountries = ["SA", "AE", "EG", "JO", "QA", "KW", "BH", "OM"];
    
    const targetLocale = arabicSpeakingCountries.includes(country) ? "ar" : "en";
    
    return NextResponse.redirect(new URL(`/${targetLocale}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
```

---

## 4. Performance: Core Web Vitals Optimization

### 4.1 LCP (Largest Contentful Paint) Image Preloading
*   **Before:** Branding logos and hero banners render late during client hydration, resulting in high LCP layout delays.
*   **After:** Configure next/image tags with strict sizing boundaries, modern `webp`/`avif` encoding structures, and high-priority attributes to preload main above-the-fold graphical elements.

```tsx
// src/components/landing/HeroSection.tsx
import Image from "next/image";

export function HeroSection({ heroImageUrl }: { heroImageUrl: string }) {
  return (
    <div className="relative w-full min-h-[500px]">
      <Image
        src={heroImageUrl || "/images/hero-default.webp"}
        alt="Warattel Learning Portal"
        fill
        priority // Preloads dynamic LCP hero banner immediately
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover rounded-3xl"
        quality={85}
      />
    </div>
  );
}
```

### 4.2 CLS (Cumulative Layout Shift) Prevention via Skeletons
*   **Before:** Dynamic dashboard modules (e.g. Student Excuse lists or Teacher Session cards) load from React Query endpoints and display as raw null objects until the network returns, causing layout content jumps.
*   **After:** Reserve physical container layouts using structured layout slots, utilizing shimmer CSS variables to mask loading timelines.

```tsx
// src/components/ui/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="bg-card rounded-3xl border border-border/50 p-6 space-y-4 animate-pulse">
      {/* Reserve Avatar layout */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
      {/* Reserve text body block */}
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-[90%] rounded bg-muted" />
      </div>
    </div>
  );
}
```

### 4.3 Bundle Minimization using Dynamic Lazy Loading
*   **Before:** Landing pages load heavy visualization elements like charts, calendars, and text editors on the initial bundle, inflating the main thread execution sizes.
*   **After:** Split bundles dynamically using `next/dynamic` so that resource-heavy interfaces load lazily on scroll or user click.

```tsx
// src/app/[locale]/(dashboard)/supervisor/page.tsx
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

// Heavy visual report chart loaded on-demand
const HeavyMetricsChart = dynamic(
  () => import("@/components/charts/HeavyMetricsChart"),
  {
    ssr: false, // Prevents server-side hydration bloat
    loading: () => <SkeletonCard />
  }
);
```

---

## 5. Automated Testing: Unit, Integration & E2E

### 5.1 Unit Testing Hooks with Vitest
*   **Before:** Component utilities, language routing systems, and Redux slices (e.g., `authSlice`) must be manually tested by spinning up the entire Next.js browser page.
*   **After:** Implement high-speed Unit Tests via `Vitest` and `React Testing Library` to secure layout functions and custom Hooks isolated from active backend servers.

```typescript
// src/hooks/__tests__/useRole.test.ts
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRole } from "@/hooks/useRole";
import { useSelector } from "react-redux";

// Mock React-Redux hook dependencies
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

describe("useRole custom hook", () => {
  it("should extract permissions based on active student user roles", () => {
    vi.mocked(useSelector).mockReturnValue({
      user: { role: "STUDENT", email: "student@warattel.com" },
    });

    const { result } = renderHook(() => useRole());
    
    expect(result.current.isStudent).toBe(true);
    expect(result.current.isManager).toBe(false);
  });
});
```

### 5.2 Mocking API Transactions with MSW (Mock Service Worker)
*   **Before:** Network tests hit real test servers, which can be slow, fragile, and prone to failures due to credential changes or local internet interruptions.
*   **After:** Set up Mock Service Worker (MSW) handlers to capture and mock API transactions directly at the network layer during testing.

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.warattel.com/v1/student/profile", () => {
    return HttpResponse.json({
      id: "std-789",
      full_name: "Ahmed Mostafa",
      path: "hifz",
      attendance_percentage: 95,
    });
  }),
];
```

### 5.3 E2E Security Navigation with Playwright
*   **Before:** Security changes can accidentally break route guards, allowing users with a `STUDENT` role to access admin pages at `/manager`.
*   **After:** Write end-to-end Playwright tests that simulate different user roles to verify that routing restrictions and redirects are working correctly.

```typescript
// e2e/navigation-guards.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Security Navigation Authorization Guards", () => {
  test("should prevent students from accessing the manager portal", async ({ page }) => {
    // Authenticate the session as a Student
    await page.goto("/ar/login");
    await page.fill("[name='email']", "student@warattel.com");
    await page.fill("[name='password']", "securepassword123");
    await page.click("button[type='submit']");
    
    // Attempt direct navigation to manager portal
    await page.goto("/ar/manager/system-settings");
    
    // Validate redirect to unauthorized or fallback home
    await expect(page).toHaveURL(/.*\/student/);
  });
});
```

---

## 6. Security Hardening

### 6.1 Strict Content Security Policy (CSP) Headers
*   **Before:** Default Next.js setup allows third-party scripts, stylesheets, and fonts to load from any source, exposing the app to Cross-Site Scripting (XSS) and content injection attacks.
*   **After:** Inject a strict Content Security Policy (CSP) using Next.js middleware, allowing resource loading *only* from verified, trusted domains.

```typescript
// src/middleware.ts (Enhanced)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

export function middleware(request: NextRequest) {
  // Generate random cryptographic nonce value
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  
  // Construct CSP parameters restricting code injections
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' https://www.googletagmanager.com 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' blob: data: https://*.sentry.io https://*.google-analytics.com;
    connect-src 'self' https://api.warattel.com https://*.sentry.io https://*.google-analytics.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}
```

### 6.2 Safe Session Caching via Secure SameSite Cookie Variables
*   **Before:** Client credentials are cached in browser `localStorage` or standard cookies, making them vulnerable to Cross-Site Scripting (XSS) attacks.
*   **After:** Store authentication tokens in secure, `httpOnly` cookies with `SameSite=Lax` configuration, and include anti-CSRF request verification headers on all write API requests.

```typescript
// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const response = await axios.post("https://api.warattel.com/v1/auth/login", { email, password });
    const { token, user } = response.data;

    const nextResponse = NextResponse.json({ success: true, user });

    // Store auth token securely within httpOnly browser cookie
    nextResponse.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return nextResponse;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

### 6.3 Secure HTML Parsing via DOMPurify
*   **Before:** Educational syllabus and notices returned from manager endpoints are rendered raw using `dangerouslySetInnerHTML`, leaving the client vulnerable to cross-site script injection attacks.
*   **After:** Sanitize user-generated HTML contents using `isomorphic-dompurify` prior to rendering them in the DOM.

```tsx
// src/components/common/SafeHtml.tsx
import DOMPurify from "isomorphic-dompurify";

export function SafeHtml({ htmlContent }: { htmlContent: string }) {
  // Purify inline script injections or malicious image triggers
  const cleanHtml = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target"],
  });

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
```

---

## 7. GTM (Google Tag Manager) & GA4 Multi-Tenant Integration

### 7.1 Unified Multi-Tenant DataLayer Architecture
*   **Before:** Analytics scripts are manually hardcoded in html files, which blocks main-thread rendering and loads static ID parameters that cannot track individual white-labeled tenant domains.
*   **After:** Utilize `@next/third-parties/google` components to asynchronously load analytics wrappers. Push key parameters like `tenant_slug` and `platform_env` to the GTM `dataLayer` during initial hydration.

```tsx
// src/components/providers/DynamicAnalyticsProvider.tsx
"use client";

import React, { useEffect } from "react";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { IntegrationKeys } from "@/types/saas";

interface Props {
  integrations: IntegrationKeys;
  tenantSlug: string;
  children: React.ReactNode;
}

export function DynamicAnalyticsProvider({ integrations, tenantSlug, children }: Props) {
  const gtmId = integrations.google_tag_manager_id;
  const gaId = integrations.google_analytics_id;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithDataLayer = window as any;
      windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer || [];
      
      // Push localized SaaS segmentations immediately on load
      windowWithDataLayer.dataLayer.push({
        event: "tenant_init",
        tenant_slug: tenantSlug,
        platform_env: process.env.NODE_ENV || "development"
      });
    }
  }, [tenantSlug]);

  return (
    <>
      {gtmId && gtmId !== "GTM-DEMO123" && <GoogleTagManager gtmId={gtmId} />}
      {gaId && gaId !== "G-DEMO123456" && <GoogleAnalytics gaId={gaId} />}
      {children}
    </>
  );
}
```

### 7.2 GDPR Google Consent Mode v2 Compliance
*   **Before:** GTM cookies drop immediately when the page loads, which violates GDPR rules in regional locations like Europe.
*   **After:** Set default analytics tracking status to `denied` on initial load. Update active tracking configurations programmatically only after the user consents via the cookie selection banner.

```html
<!-- BEFORE: GTM drops cookies immediately on page load -->
<script src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"></script>

<!-- AFTER: GTM loaded inside dynamic context enforcing default denials -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Register strict default cookie consent denials
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  });
</script>
```

```tsx
// src/components/common/CookieConsentBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("user_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptTracking = () => {
    Cookies.set("user_cookie_consent", "granted", { expires: 365 });
    setShowBanner(false);
    
    // Update consent programmatically for GTM / GA4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 start-6 z-50 max-w-sm p-6 bg-card border border-border/50 rounded-3xl glass shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
      <h3 className="font-semibold text-lg text-start mb-2">🍪 ملفات تعريف الارتباط</h3>
      <p className="text-sm text-muted-foreground text-start mb-4">
        نستخدم ملفات تعريف الارتباط لتحسين أداء منصتكم التعليمية وقياس حركة المرور. هل توافق على التتبع؟
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={() => setShowBanner(false)}>رفض</Button>
        <Button onClick={acceptTracking} className="bg-primary text-white">موافق</Button>
      </div>
    </div>
  );
}
```

---

## 📈 Next Steps & Execution Priority

1.  **Phase A (High Impact / Low Risk):** Integrate the **RTL Logical properties** cleanup (Pillar 2) & Next.js **Dynamic SEO metadata structures** (Pillar 3). These represent simple layout enhancements that can be done immediately without breaking APIs.
2.  **Phase B (Interaction & Quality):** Upgrade all dynamic panels to feature **Loading Buttons** linked to React Query mutation states, alongside **Smooth validation scrolling** (Pillar 1).
3.  **Phase C (Testing & Telemetry):** Configure **Vitest / Playwright** scripts inside `package.json` (Pillar 5) and wire up GTM **Consent Mode v2** structures (Pillar 7).
4.  **Phase D (Security Hardening):** Deploy **Middleware CSP dynamic nonce headers** and transition cookies to secure `httpOnly` sessions (Pillar 6).
