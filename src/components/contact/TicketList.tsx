"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContactThreadsData } from "@/types/contact.types";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MessageSquare,
  Plus,
  Search,
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
}

export function TicketList({
  threadsData,
  isLoading,
  selectedTicketId,
  onSelectTicket,
  onOpenCreateModal,
  currentPage,
  onPageChange,
}: TicketListProps) {
  const t = useTranslations("contactUs");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const threads = useMemo(() => threadsData?.data ?? [], [threadsData?.data]);
  const meta = threadsData?.meta;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Client-side quick filter on current page items for search query & status tabs
  const filteredThreads = useMemo(() => {
    return threads.filter((item) => {
      // Status filter
      if (statusFilter !== "all") {
        if (String(item.status).toLowerCase() !== statusFilter) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSubject = item.subject?.toLowerCase().includes(q);
        const matchesId = String(item.id).includes(q);
        const matchesMessage = item.last_message?.message
          ?.toLowerCase()
          .includes(q);
        if (!matchesSubject && !matchesId && !matchesMessage) {
          return false;
        }
      }

      return true;
    });
  }, [threads, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-3xl shadow-xs overflow-hidden">
      {/* List Header & Search */}
      <div className="p-4 border-b border-border space-y-3 bg-muted/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {t("pageTitle")}
              </h2>
              {meta && (
                <span className="text-[11px] text-muted-foreground">
                  {meta.total} {t("totalTickets").toLowerCase()}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t("newTicket")}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full h-9 ps-9 pe-3 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: "all", label: t("filterAll") },
            { id: "pending_admin", label: t("filterPendingAdmin") },
            { id: "pending_user", label: t("filterPendingUser") },
            { id: "closed", label: t("filterClosed") },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer",
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
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {isLoading ? (
          <div className="p-4 space-y-3">
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
              {searchQuery ? <Filter className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {searchQuery ? t("noSearchResults") : t("noTickets")}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                {searchQuery ? t("noSearchResultsDesc") : t("noTicketsDesc")}
              </p>
            </div>
            {!searchQuery && (
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("newTicket")}</span>
              </button>
            )}
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isSelected = selectedTicketId === thread.id;
            const snippet =
              thread.last_message?.message || thread.subject;
            const dateDisplay =
              thread.last_replied_at || thread.created_at;

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => onSelectTicket(thread.id)}
                className={cn(
                  "w-full text-start p-4 transition-all hover:bg-muted/40 cursor-pointer block relative group",
                  isSelected
                    ? "bg-primary/5 hover:bg-primary/10 border-s-4 border-s-primary"
                    : "border-s-4 border-s-transparent"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-muted-foreground">
                    #{thread.id}
                  </span>
                  <TicketStatusBadge
                    status={thread.status}
                    label={thread.status_label}
                  />
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

                <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground/60" />
                    <span>{formatDate(dateDisplay)}</span>
                  </span>

                  {thread.last_message?.is_from_admin && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                      {t("adminSupport")}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {meta && meta.last_page > 1 && (
        <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {t("page")} {meta.current_page} {t("of")} {meta.last_page}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous Page"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
            </button>
            <button
              type="button"
              disabled={currentPage >= meta.last_page || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next Page"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
