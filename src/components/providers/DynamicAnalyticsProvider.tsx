"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { IntegrationKeys } from "@/types/saas";

interface Props {
  integrations: IntegrationKeys;
  tenantSlug: string;
  nonce?: string;
  children: React.ReactNode;
}

export function DynamicAnalyticsProvider({ integrations, tenantSlug, nonce, children }: Props) {
  const gtmId = integrations.google_tag_manager_id;
  const gaId = integrations.google_analytics_id;

  useEffect(() => {
    // Standardize and register basic parameters in the dataLayer for multi-tenant segmentations
    if (typeof window !== "undefined") {
      const windowWithDataLayer = window as any;
      windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer || [];
      
      // Push multi-tenant identification context immediately on hydration
      windowWithDataLayer.dataLayer.push({
        event: "tenant_init",
        tenant_slug: tenantSlug,
        platform_env: process.env.NODE_ENV || "development"
      });
    }
  }, [tenantSlug]);

  return (
    <>
      {/* dynamically render performance-optimized GTM container if key exists */}
      {gtmId && gtmId !== "GTM-DEMO123" && (
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;var n=d.createAttribute('nonce');
              n.value='${nonce || ""}';j.setAttributeNode(n);f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}
      
      {/* dynamically render performance-optimized GA4 container if key exists */}
      {gaId && gaId !== "G-DEMO123456" && (
        <>
          <Script
            id="google-analytics-gtag"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
            nonce={nonce}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Initialize Consent Mode v2 based on cookie
                var hasConsent = document.cookie.indexOf('user_cookie_consent=granted') > -1;
                gtag('consent', 'default', {
                  'ad_storage': hasConsent ? 'granted' : 'denied',
                  'analytics_storage': hasConsent ? 'granted' : 'denied',
                  'ad_user_data': hasConsent ? 'granted' : 'denied',
                  'ad_personalization': hasConsent ? 'granted' : 'denied',
                  'wait_for_update': 500
                });
                
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {children}
    </>
  );
}

export default DynamicAnalyticsProvider;
