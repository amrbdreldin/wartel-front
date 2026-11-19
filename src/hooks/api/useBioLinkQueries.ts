import type { Locale } from "@/lib/constants";
import {
  bioLinkService,
  type BioLinkCategoriesResponse,
  type BioLinkCategoryResponse,
} from "@/services/bioLink.service";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const bioLinkKeys = {
  all: ["bio-links"] as const,
  list: () => [...bioLinkKeys.all, "list"] as const,
  detail: (slug: string) => [...bioLinkKeys.all, "detail", slug] as const,
};

export function useBioLinkCategories() {
  const lang = useLocale() as Locale;
  return useQuery<BioLinkCategoriesResponse>({
    queryKey: bioLinkKeys.list(),
    queryFn: () => bioLinkService.getCategories({ lang }),
    staleTime: 60_000,
  });
}

export function useBioLinkCategory(slug: string) {
  const lang = useLocale() as Locale;
  return useQuery<BioLinkCategoryResponse>({
    queryKey: bioLinkKeys.detail(slug),
    queryFn: () => bioLinkService.getCategoryBySlug(slug, { lang }),
    enabled: !!slug,
    retry: false,
    staleTime: 30_000,
  });
}
