"use client";

import React, { useEffect } from "react";
import { SaasBrandingPayload } from "@/types/saas";

interface Props {
  branding: SaasBrandingPayload;
  children: React.ReactNode;
}

export function TenantThemeProvider({ branding, children }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    const theme = branding.theme_colors;

    // Helper to map color settings straight into CSS variables on the document element
    const applyColors = (colors: any) => {
      Object.entries(colors).forEach(([key, value]) => {
        // Formats camelCase or snake_case key to CSS variables (e.g. primary_foreground -> --primary-foreground)
        const cssKey = `--${key.replace(/_/g, "-")}`;
        if (typeof value === "string") {
          root.style.setProperty(cssKey, value);
        }
      });
    };

    // Apply appropriate palette base colors based on current class list
    const updateThemeStyles = () => {
      const isDark = root.classList.contains("dark");
      applyColors(isDark ? theme.dark : theme.light);
    };

    // Apply colors immediately on load
    updateThemeStyles();

    // Set custom radius variable matching backend specifications
    if (branding.visual_settings?.border_radius) {
      root.style.setProperty("--radius", branding.visual_settings.border_radius);
    }

    // Dynamic Google Fonts injector
    const loadFont = (fontName: string, id: string) => {
      if (!fontName || fontName === "Inter" || fontName === "Tajawal") return;
      
      const linkId = `tenant-font-${id}`;
      let linkElement = document.getElementById(linkId) as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.id = linkId;
        linkElement.rel = "stylesheet";
        document.head.appendChild(linkElement);
      }
      linkElement.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;700;800&display=swap`;
      
      const variableName = `--font-${id}`;
      root.style.setProperty(variableName, `'${fontName}', sans-serif`);
    };

    // Load custom fonts dynamically if provided from tenant specifications
    if (branding.typography?.font_sans_latin) {
      loadFont(branding.typography.font_sans_latin, "sans");
    }
    if (branding.typography?.font_arabic) {
      loadFont(branding.typography.font_arabic, "arabic");
    }

    // Set up a MutationObserver to listen to class list additions (like theme switches)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateThemeStyles();
        }
      });
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, [branding]);

  return <>{children}</>;
}
export default TenantThemeProvider;
