"use client";

import type { Locale } from "@/lib/constants";
import { STALE_TIME } from "@/lib/constants";
import { contactService } from "@/services/contact.service";
import type { CreateContactThreadPayload, ReplyContactThreadPayload } from "@/types/contact.types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

// ============================================================
// TanStack Query Hooks for Contact Us & Tickets
// ============================================================

export const contactKeys = {
  all: ["contact-threads"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (params?: { page?: number; per_page?: number }) =>
    [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all, "detail"] as const,
  detail: (id?: number | string | null) =>
    [...contactKeys.details(), String(id ?? "")] as const,
};

/**
 * Hook to fetch paginated list of contact threads
 */
export function useContactThreads(params?: { page?: number; per_page?: number }) {
  const lang = useLocale() as Locale;

  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => contactService.getThreads(params, { lang }),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME.SHORT,
  });
}

/**
 * Hook to fetch single contact thread details
 */
export function useContactThreadDetail(threadId: number | string | null | undefined) {
  const lang = useLocale() as Locale;

  return useQuery({
    queryKey: contactKeys.detail(threadId),
    queryFn: () => contactService.getThread(threadId!, { lang }),
    enabled: Boolean(threadId),
    staleTime: 5000,
    refetchInterval: threadId ? 15000 : false, // Poll every 15s when a thread is actively viewed
  });
}

/**
 * Mutation to create a new ticket / thread
 */
export function useCreateContactThread() {
  const lang = useLocale() as Locale;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContactThreadPayload) =>
      contactService.createThread(payload, { lang }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

/**
 * Mutation to reply to an existing thread
 */
export function useReplyContactThread() {
  const lang = useLocale() as Locale;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReplyContactThreadPayload) =>
      contactService.replyThread(payload, { lang }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(variables.threadId),
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
      });
    },
  });
}
