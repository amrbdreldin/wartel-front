/**
 * useGroupQueries.ts – Hooks for group direct-join flow.
 */
import type { Locale } from "@/lib/constants";
import { groupService, type JoinGroupRequest } from "@/services/group.service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const groupKeys = {
  all: ["group"] as const,
  directJoin: (slug: string) => [...groupKeys.all, "direct-join", slug] as const,
};

export function useDirectJoinGroup(slug: string) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: groupKeys.directJoin(slug),
    queryFn: () => groupService.getDirectJoinGroup(slug, { lang }),
    enabled: !!slug,
    retry: 1,
  });
}

export function useJoinGroupMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (data: JoinGroupRequest) =>
      groupService.joinGroup(data, { lang }),
  });
}
