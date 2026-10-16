"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactThreadDetail } from "@/hooks/api/useContactQueries";
import { cn } from "@/lib/utils";
import { formatThreadDate, isThreadClosed, isThreadPendingAdmin } from "@/utils/contactThread";
import { AlertCircle, ArrowRight, HelpCircle, Lock, MessageSquare, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { AttachmentPreviewDialog } from "./AttachmentPreviewDialog";
import { ReplyComposer } from "./ReplyComposer";
import { ThreadMessageBubble } from "./ThreadMessageBubble";
import { TicketStatusBadge } from "./TicketStatusBadge";

interface TicketConversationProps {
  threadId: number | null;
  onBackToList?: () => void;
}

const PANEL_CLASS = "flex flex-col h-full bg-card border border-border rounded-3xl shadow-xs";

export function TicketConversation({ threadId, onBackToList }: TicketConversationProps) {
  const t = useTranslations("contactUs");
  const locale = useLocale();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLUListElement>(null);

  const { data: threadResponse, isLoading, isFetching, isError, refetch } =
    useContactThreadDetail(threadId);

  const thread = threadResponse?.data;
  const messages = thread?.messages ?? [];
  const isPendingAdmin = isThreadPendingAdmin(thread?.status);
  const isClosed = isThreadClosed(thread?.status);
  const cannotReply = isPendingAdmin || isClosed;

  // Scroll only the messages pane (scrollIntoView would also scroll the page on mobile)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && messages.length) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]);

  if (!threadId) {
    return (
      <div className={cn(PANEL_CLASS, "items-center justify-center min-h-112.5 p-8 text-center")}>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">{t("selectTicketPrompt")}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{t("selectTicketDesc")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn(PANEL_CLASS, "p-6 space-y-6")} aria-busy="true">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-6 w-64 rounded" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex-1 space-y-4 py-4">
          <Skeleton className="h-20 w-3/4 rounded-2xl" />
          <Skeleton className="h-24 w-3/4 ms-auto rounded-2xl" />
          <Skeleton className="h-16 w-2/3 rounded-2xl" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !thread) {
    return (
      <div className={cn(PANEL_CLASS, "items-center justify-center min-h-112.5 p-8 text-center space-y-4")}>
        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="w-7 h-7" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">{t("errorLoading")}</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">{t("errorLoadingDesc")}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="rounded-xl gap-2">
          <RefreshCw aria-hidden="true" />
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(PANEL_CLASS, "overflow-hidden")}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {onBackToList && (
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={onBackToList}
                className="lg:hidden -ms-1 rounded-xl text-muted-foreground"
                aria-label={t("backToList")}
              >
                <ArrowRight className="size-5 rotate-180 rtl:rotate-0" />
              </Button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold">#{thread.id}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={thread.created_at} className="truncate">
                  {formatThreadDate(thread.created_at, locale, true)}
                </time>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
                {thread.subject}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <TicketStatusBadge status={thread.status} label={thread.status_label} />
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-xl text-muted-foreground"
              aria-label={t("refresh")}
              title={t("refresh")}
            >
              <RefreshCw className={cn(isFetching && "animate-spin text-primary")} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ul
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-background/50"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <li className="flex flex-col items-center gap-2 text-center py-12 text-muted-foreground text-xs">
            <MessageSquare className="w-6 h-6" aria-hidden="true" />
            {t("noMessagesInThread")}
          </li>
        ) : (
          messages.map((msg) => (
            <ThreadMessageBubble key={msg.id} message={msg} onOpenAttachment={setPreviewImage} />
          ))
        )}
      </ul>

      {/* Reply area */}
      <div className="p-4 border-t border-border bg-card">
        {cannotReply ? (
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/40 border border-border/80 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium text-foreground">
              {isClosed ? t("cannotReplyClosed") : t("cannotReplyPendingAdmin")}
            </p>
          </div>
        ) : (
          <ReplyComposer key={thread.id} threadId={thread.id} />
        )}
      </div>

      <AttachmentPreviewDialog src={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}
