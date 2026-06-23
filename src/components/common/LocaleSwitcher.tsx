"use client";

import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

// ============================================================
// LocaleSwitcher – Toggle between AR and EN
// ============================================================

export function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const targetLocale = locale === "ar" ? "en" : "ar";

  const handleSwitch = () => {
    const segments = pathname.split("/");
    if (segments[1] === locale) {
      segments[1] = targetLocale;
    }
    router.push(segments.join("/"));
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleSwitch}
      className="h-9 w-9 border-border/80 hover:bg-muted text-foreground transition-all font-sans font-bold uppercase tracking-normal rounded-xl cursor-pointer shadow-sm flex items-center justify-center text-xs hover:text-primary hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]"
      aria-label={t("language")}
    >
      {targetLocale}
    </Button>
  );
}
