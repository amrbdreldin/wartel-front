"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContactThreadsData } from "@/types/contact.types";
import { THREAD_STATUS, formatThreadDate, normalizeThreadStatus } from "@/utils/contactThread";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MessageSquare,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { TicketStatusBadge } from "./TicketStatusBadge";

interface TicketListProps {
  threadsData?: ContactThreadsData;
  isLoading: boolean;
  selectedTicketId: number | null;
  onSelectTicket: (ticketId: number) => void;
  onOpenCreateModal: () => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  /** Decided by the parent (ContactUsView) — single source of truth */
  canCreateTicket: boolean;
}

type StatusFilter = "all" | (typeof THREAD_STATUS)[keyof typeof THREAD_STATUS];

export function TicketList({
  threadsData,
  isLoading,
  selectedTicketId,
  onSelectTicket,
  onOpenCreateModal,
  currentPage,
  onPageChange,
  canCreateTicket,
}: TicketListProps) {
  const t = useTranslations("contactUs");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const threads = useMemo(() => threadsData?.data ?? [], [threadsData?.data]);
  const meta = threadsData?.meta;
  const isFiltering = Boolean(searchQuery.trim()) || statusFilter !== "all";

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: THREAD_STATUS.PENDING_ADMIN, label: t("filterPendingAdmin") },
    { id: THREAD_STATUS.PENDING_USER, label: t("filterPendingUser") },
    { id: THREAD_STATUS.CLOSED, label: t("filterClosed") },
  ];

  // Client-side quick filter on current page items for search query & status tabs
  const filteredThreads = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return threads.filter((item) => {
      if (statusFilter !== "all" && normalizeThreadStatus(item.status) !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.subject?.toLowerCase().includes(q) ||
        String(item.id).includes(q) ||
        Boolean(item.last_message?.message?.toLowerCase().includes(q))
      );
    });
  }, [threads, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-3xl shadow-xs overflow-hidden">
      {/* List Header & Search */}
      <div className="p-4 border-b border-border space-y-3 bg-muted/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">{t("pageTitle")}</h2>
              {meta && (
                <span className="text-[11px] text-muted-foreground">
                  {meta.total} {t("totalTickets").toLocaleLowerCase(locale)}
                </span>
              )}
            </div>
          </div>

          {canCreateTicket && (
            <Button size="sm" onClick={onOpenCreateModal} className="rounded-xl font-semibold shadow-xs">
              <Plus aria-hidden="true" />
              {t("newTicket")}
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full h-9 ps-9 pe-9 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setSearchQuery("")}
              className="absolute end-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={t("clearSearch")}
            >
              <X />
            </Button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar" role="group" aria-label={t("filterAll")}>
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                aria-pressed={isActive}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3" aria-busy="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded-2xl border border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground/60">
              {isFiltering ? (
                <Filter className="w-6 h-6" aria-hidden="true" />
              ) : (
                <MessageSquare className="w-6 h-6" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isFiltering ? t("noSearchResults") : t("noTickets")}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                {isFiltering
                  ? t("noSearchResultsDesc")
                  : canCreateTicket
                    ? t("noTicketsDesc")
                    : t("noTicketsShort")}
              </p>
            </div>
            {!isFiltering && canCreateTicket && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenCreateModal}
                className="mt-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold"
              >
                <Plus aria-hidden="true" />
                {t("newTicket")}
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {filteredThreads.map((thread) => {
              const isSelected = selectedTicketId === thread.id;
              const snippet = thread.last_message?.message || thread.subject;
              const dateDisplay = thread.last_replied_at || thread.created_at;

              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTicket(thread.id)}
                    aria-current={isSelected ? "true" : undefined}
                    className={cn(
                      "w-full text-start p-4 transition-all hover:bg-muted/40 block relative group border-s-4 focus-visible:outline-none focus-visible:bg-muted/40",
                      isSelected ? "bg-primary/5 hover:bg-primary/10 border-s-primary" : "border-s-transparent"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-muted-foreground">#{thread.id}</span>
                      <TicketStatusBadge status={thread.status} label={thread.status_label} />
                    </div>

                    <h3
                      className={cn(
                        "text-sm font-bold line-clamp-2 leading-snug mb-1 transition-colors",
                        isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                      )}
                    >
                      {thread.subject}
                    </h3>

                    {snippet && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                        {snippet}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <time dateTime={dateDisplay ?? undefined}>{formatThreadDate(dateDisplay, locale)}</time>
                      </span>

                      {thread.last_message?.is_from_admin && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                          {t("adminSupport")}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination Footer */}
      {meta && meta.last_page > 1 && (
        <nav
          className="p-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground"
          aria-label={t("pagination")}
        >
          <span>
            {t("page")} {meta.current_page} {t("of")} {meta.last_page}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label={t("previousPage")}
            >
              <ChevronRight className="rotate-180 rtl:rotate-0" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage >= meta.last_page || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label={t("nextPage")}
            >
              <ChevronLeft className="rotate-180 rtl:rotate-0" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
