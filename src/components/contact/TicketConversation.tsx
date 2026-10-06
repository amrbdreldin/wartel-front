"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useContactThreadDetail,
  useReplyContactThread,
} from "@/hooks/api/useContactQueries";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types/contact.types";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  HelpCircle,
  ImageIcon,
  Loader2,
  Lock,
  RefreshCw,
  Send,
  Shield,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TicketStatusBadge } from "./TicketStatusBadge";

interface TicketConversationProps {
  threadId: number | null;
  onBackToList?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function TicketConversation({
  threadId,
  onBackToList,
}: TicketConversationProps) {
  const t = useTranslations("contactUs");
  const locale = useLocale();

  const [replyMessage, setReplyMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: threadResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useContactThreadDetail(threadId);

  const { mutate: replyThread, isPending: isReplying } = useReplyContactThread();

  const thread = threadResponse?.data;
  const isPendingAdmin = String(thread?.status).toLowerCase() === "pending_admin";

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (thread?.messages?.length) {
      scrollToBottom();
    }
  }, [thread?.messages?.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_IMAGE_TYPES.includes(selected.type)) {
      setFileError(t("invalidFileType"));
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFileError(t("fileTooLarge"));
      return;
    }

    setFileError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadId || isPendingAdmin || isReplying) return;

    if (!replyMessage.trim()) {
      toast.error(t("messageRequired"));
      return;
    }

    replyThread(
      {
        threadId,
        message: replyMessage.trim(),
        file: file || undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || t("replySuccess"));
          setReplyMessage("");
          handleRemoveFile();
          refetch();
        },
        onError: (err: any) => {
          const errMsg =
            err?.response?.data?.message || err?.message || t("errorLoading");
          toast.error(errMsg);
        },
      }
    );
  };

  if (!threadId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[450px] p-8 text-center bg-card border border-border rounded-3xl shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          {t("selectTicketPrompt")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("selectTicketDesc")}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-card border border-border rounded-3xl shadow-xs p-6 space-y-6">
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
      <div className="flex flex-col items-center justify-center h-full min-h-[450px] p-8 text-center bg-card border border-border rounded-3xl shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            {t("errorLoading")}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {t("errorLoadingDesc")}
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="rounded-xl gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("retry")}</span>
        </Button>
      </div>
    );
  }

  const messages: ContactMessage[] = thread.messages || [];

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-3xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-muted/20 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {onBackToList && (
              <button
                type="button"
                onClick={onBackToList}
                className="lg:hidden p-2 -ms-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                aria-label={t("backToList")}
              >
                <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">
                  #{thread.id}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground truncate">
                  {formatDate(thread.created_at)}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
                {thread.subject}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <TicketStatusBadge
              status={thread.status}
              label={thread.status_label}
            />
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title={t("retry")}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4",
                  isFetching && "animate-spin text-primary"
                )}
              />
            </button>
          </div>
        </div>

        {/* Status description alert if pending admin */}
        {isPendingAdmin && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed animate-in fade-in">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="font-medium">{t("cannotReplyPendingAdmin")}</p>
          </div>
        )}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-background/50">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            {t("noTicketsDesc")}
          </div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.is_from_admin;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3 max-w-[85%] sm:max-w-[75%]",
                  isAdmin ? "me-auto" : "ms-auto flex-row-reverse"
                )}
              >
                {/* Avatar Icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-1",
                    isAdmin
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-muted text-foreground border border-border"
                  )}
                >
                  {isAdmin ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={cn(
                    "flex flex-col space-y-1.5 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm shadow-2xs border transition-all",
                    isAdmin
                      ? "bg-primary/5 border-primary/20 text-foreground rounded-ss-xs"
                      : "bg-card border-border text-foreground rounded-se-xs"
                  )}
                >
                  {/* Sender Name & Badge */}
                  <div className="flex items-center justify-between gap-2 text-[11px] pb-1 border-b border-border/40">
                    <span className="font-bold text-foreground">
                      {isAdmin
                        ? msg.sender_name || t("adminSupport")
                        : t("you")}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 rounded-md bg-primary/10 text-primary font-semibold text-[10px]">
                        {t("supportStaff")}
                      </span>
                    )}
                  </div>

                  {/* Message Body */}
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground font-normal">
                    {msg.message}
                  </p>

                  {/* Optional File Attachment */}
                  {(msg.file || msg.file_url) && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageModal(msg.file_url || msg.file || null)
                        }
                        className="relative block w-48 h-32 rounded-xl overflow-hidden border border-border bg-background hover:opacity-90 transition-opacity cursor-pointer group"
                      >
                        <Image
                          src={msg.file_url || msg.file || ""}
                          alt="Attachment"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{t("viewAttachment")}</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Message Timestamp & Read Status */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-muted-foreground">
                    <span>{formatDate(msg.created_at)}</span>
                    {!isAdmin && (
                      <span
                        className="inline-flex items-center gap-1"
                        title={msg.read_at ? t("read") : t("unread")}
                      >
                        {msg.read_at ? (
                          <CheckCheck className="w-3 h-3 text-primary" />
                        ) : (
                          <Check className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span>{msg.read_at ? t("read") : t("unread")}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input Area */}
      <div className="p-4 border-t border-border bg-card">
        {isPendingAdmin ? (
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/40 border border-border/80 text-center space-y-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-foreground">
              {t("cannotReplyPendingAdmin")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendReply} className="space-y-3">
            {/* Attachment Preview thumbnail if chosen */}
            {previewUrl && (
              <div className="relative inline-flex items-center gap-2 p-2 bg-muted/50 border border-border rounded-xl">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-medium text-foreground truncate max-w-[150px]">
                    {file?.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {file ? `${(file.size / 1024).toFixed(0)} KB` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {fileError && (
              <p className="text-xs text-destructive animate-in fade-in">
                {fileError}
              </p>
            )}

            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={t("replyPlaceholder")}
                disabled={isReplying}
                className="flex-1 rounded-2xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none min-h-[44px] max-h-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply(e);
                  }
                }}
              />

              {/* Attach File Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={isReplying}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isReplying}
                className="h-11 w-11 rounded-2xl border-border text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                aria-label={t("attachFile")}
                title={t("attachFile")}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>

              {/* Send Button */}
              <Button
                type="submit"
                disabled={isReplying || !replyMessage.trim()}
                className="h-11 px-4 sm:px-5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 shrink-0 gap-1.5 cursor-pointer"
              >
                {isReplying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span className="hidden sm:inline">{t("sendReply")}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImageModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full bg-card rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="text-xs font-semibold text-foreground">
                {t("openFullImage")}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-[70vh] bg-background">
              <Image
                src={selectedImageModal}
                alt="Enlarged attachment"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
