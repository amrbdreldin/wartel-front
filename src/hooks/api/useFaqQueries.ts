import type { Locale } from "@/lib/constants";
import { STALE_TIME } from "@/lib/constants";
import { faqService } from "@/services/faq.service";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

// ============================================================
// TanStack Query Hooks for FAQ
// ============================================================

export const faqKeys = {
  all: ["faqs"] as const,
  list: (lang?: string) => [...faqKeys.all, "list", lang] as const,
};

export function useFaqs() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: faqKeys.list(lang),
    queryFn: () => faqService.getFaqs({ lang }),
    staleTime: STALE_TIME.MEDIUM,
  });
}
