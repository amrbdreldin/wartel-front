/**
 * useGroupQueries.ts – Hooks for the group direct-join and apply flows.
 */
import type { Locale } from "@/lib/constants";
import {
  groupService,
  type AvailableGroup,
  type DirectJoinGroup,
  type JoinGroupRequest,
} from "@/services/group.service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const groupKeys = {
  all: ["group"] as const,
  directJoin: (slug: string) => [...groupKeys.all, "direct-join", slug] as const,
  available: () => [...groupKeys.all, "available"] as const,
};

export function useDirectJoinGroup(slug: string) {
  const lang = useLocale() as Locale;
  return useQuery<DirectJoinGroup[]>({
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

export function useAvailableGroups() {
  const lang = useLocale() as Locale;
  return useQuery<AvailableGroup[]>({
    queryKey: groupKeys.available(),
    queryFn: () => groupService.getAvailableGroups({ lang }),
  });
}

export function useApplyToGroupMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: ({ groupId, audio }: { groupId: number; audio?: File | null }) =>
      groupService.applyToGroup(groupId, audio, { lang }),
  });
}
