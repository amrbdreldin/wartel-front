"use client";

import { useContactThreads } from "@/hooks/api/useContactQueries";
import { cn } from "@/lib/utils";
import {
  Clock,
  Headphones,
  LifeBuoy,
  MessageSquare,
  MessageSquareCheck,
  Plus,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { CreateTicketModal } from "./CreateTicketModal";
import { TicketConversation } from "./TicketConversation";
import { TicketList } from "./TicketList";

function ContactUsViewInner() {
  const t = useTranslations("contactUs");
  const locale = useLocale();
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
  const threads = threadsData?.data || [];

  // If no ticket selected yet and desktop view, auto-select the first ticket
  useEffect(() => {
    if (!selectedTicketId && threads.length > 0 && typeof window !== "undefined") {
      if (window.innerWidth >= 1024) {
        setSelectedTicketId(threads[0].id);
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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Top Banner & Action */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-card border border-primary/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Headphones className="w-3.5 h-3.5" />
              <span>{t("pageTitle")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t("pageTitle")}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("pageSubtitle")}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>{t("newTicket")}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 backdrop-blur-xs border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("totalTickets")}</p>
              <p className="text-lg font-bold text-foreground">{stats.total}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 backdrop-blur-xs border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("pendingAdmin")}</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {stats.pendingAdmin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 backdrop-blur-xs border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquareCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("pendingUser")}</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.pendingUser}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-280px)] min-h-[600px]">
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
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
          <div className="h-44 rounded-3xl bg-muted animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
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
