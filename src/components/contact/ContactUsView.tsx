"use client";

import { useContactThreads } from "@/hooks/api/useContactQueries";
import { cn } from "@/lib/utils";
import {
  Clock,
  Headphones,
  MessageSquare,
  MessageSquareCheck,
  Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { CreateTicketModal } from "./CreateTicketModal";
import { TicketConversation } from "./TicketConversation";
import { TicketList } from "./TicketList";

function ContactUsViewInner() {
  const t = useTranslations("contactUs");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Read ticket ID from URL if present
  const queryTicketId = searchParams.get("ticket");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
    queryTicketId ? Number(queryTicketId) : null
  );

  const {
    data: threadsResponse,
    isLoading,
    refetch,
  } = useContactThreads({ page, per_page: 15 });

  const threadsData = threadsResponse?.data;
  const threads = useMemo(() => threadsData?.data ?? [], [threadsData?.data]);

  // If no ticket selected yet and desktop view, auto-select the first ticket
  useEffect(() => {
    if (!selectedTicketId && threads.length > 0 && typeof window !== "undefined") {
      if (window.innerWidth >= 1024) {
        const timer = setTimeout(() => {
          setSelectedTicketId(threads[0].id);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [threads, selectedTicketId]);

  // Handle ticket selection & update URL
  const handleSelectTicket = (id: number) => {
    setSelectedTicketId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("ticket", String(id));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleBackToList = () => {
    setSelectedTicketId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ticket");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Quick statistics computation
  const stats = useMemo(() => {
    const total = threadsData?.meta?.total ?? threads.length;
    const pendingAdmin = threads.filter(
      (t) => String(t.status).toLowerCase() === "pending_admin"
    ).length;
    const pendingUser = threads.filter(
      (t) => String(t.status).toLowerCase() === "pending_user"
    ).length;

    return { total, pendingAdmin, pendingUser };
  }, [threadsData?.meta?.total, threads]);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Top Banner & Action */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-card border border-primary/20 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                {t("pageTitle")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-1 sm:line-clamp-none">
              {t("pageSubtitle")}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t("newTicket")}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mt-3.5 pt-3.5 border-t border-border/40">
          <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-card/70 backdrop-blur-xs border border-border/60 hover:bg-card/90 transition-all">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate font-medium">
                {t("totalTickets")}
              </p>
              <p className="text-sm sm:text-lg md:text-xl font-bold text-foreground leading-tight mt-0.5">
                {stats.total}
              </p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-card/70 backdrop-blur-xs border border-border/60 hover:bg-card/90 transition-all">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate font-medium">
                {t("pendingAdmin")}
              </p>
              <p className="text-sm sm:text-lg md:text-xl font-bold text-amber-600 dark:text-amber-400 leading-tight mt-0.5">
                {stats.pendingAdmin}
              </p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-card/70 backdrop-blur-xs border border-border/60 hover:bg-card/90 transition-all">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate font-medium">
                {t("pendingUser")}
              </p>
              <p className="text-sm sm:text-lg md:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-tight mt-0.5">
                {stats.pendingUser}
              </p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquareCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-230px)] min-h-[550px]">
        {/* Left List Pane: shown on desktop always, on mobile only when no ticket selected */}
        <div
          className={cn(
            "lg:col-span-5 h-full",
            selectedTicketId ? "hidden lg:block" : "block"
          )}
        >
          <TicketList
            threadsData={threadsData}
            isLoading={isLoading}
            selectedTicketId={selectedTicketId}
            onSelectTicket={handleSelectTicket}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>

        {/* Right Conversation Pane: shown on desktop always, on mobile only when a ticket is selected */}
        <div
          className={cn(
            "lg:col-span-7 h-full",
            !selectedTicketId ? "hidden lg:block" : "block"
          )}
        >
          <TicketConversation
            threadId={selectedTicketId}
            onBackToList={handleBackToList}
          />
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTicketCreated={(newId) => {
          handleSelectTicket(newId);
          refetch();
        }}
      />
    </div>
  );
}

export function ContactUsView() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto p-4 sm:p-6">
          <div className="h-28 sm:h-32 rounded-2xl sm:rounded-3xl bg-muted animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[550px]">
            <div className="lg:col-span-5 h-full rounded-3xl bg-muted animate-pulse" />
            <div className="lg:col-span-7 h-full rounded-3xl bg-muted animate-pulse" />
          </div>
        </div>
      }
    >
      <ContactUsViewInner />
    </Suspense>
  );
}
