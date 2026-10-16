"use client";

import { Button } from "@/components/ui/button";
import { useReplyContactThread } from "@/hooks/api/useContactQueries";
import { ATTACHMENT_ACCEPT, validateAttachment } from "@/utils/contactThread";
import { ImageIcon, Loader2, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ReplyComposerProps {
  threadId: number;
}

export function ReplyComposer({ threadId }: ReplyComposerProps) {
  const t = useTranslations("contactUs");
  const [replyMessage, setReplyMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate: replyThread, isPending: isReplying } = useReplyContactThread();

  // Release the object URL when it is replaced or the composer unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const errorKey = validateAttachment(selected);
    if (errorKey) {
      setFileError(t(errorKey));
      return;
    }

    setFileError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReplying) return;

    if (!replyMessage.trim()) {
      toast.error(t("messageRequired"));
      return;
    }

    // Errors are toasted globally by the axios interceptor; the detail query is invalidated by the hook
    replyThread(
      { threadId, message: replyMessage.trim(), file: file || undefined },
      {
        onSuccess: (res) => {
          toast.success(res?.message || t("replySuccess"));
          setReplyMessage("");
          clearFile();
        },
      }
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSendReply} className="space-y-3">
      {previewUrl && (
        <div className="relative inline-flex items-center gap-2 p-2 bg-muted/50 border border-border rounded-xl">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border">
            <Image src={previewUrl} alt={t("attachmentAlt")} fill sizes="48px" className="object-cover" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground truncate max-w-[150px]">{file?.name}</p>
            <p className="text-[10px] text-muted-foreground" dir="ltr">
              {file ? `${(file.size / 1024).toFixed(0)} KB` : ""}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={clearFile}
            className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label={t("removeFile")}
          >
            <X />
          </Button>
        </div>
      )}

      {fileError && (
        <p className="text-xs text-destructive animate-in fade-in" role="alert">
          {fileError}
        </p>
      )}

      <div className="flex items-end gap-2">
        <textarea
          rows={2}
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          placeholder={t("replyPlaceholder")}
          aria-label={t("replyPlaceholder")}
          disabled={isReplying}
          className="flex-1 rounded-2xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none min-h-[44px] max-h-32"
          onKeyDown={(e) => {
            // Ignore Enter while an IME (e.g. Arabic keyboard) is composing a word
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={ATTACHMENT_ACCEPT}
          className="hidden"
          disabled={isReplying}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isReplying}
          className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-foreground shrink-0"
          aria-label={t("attachFile")}
          title={t("attachFile")}
        >
          <ImageIcon className="size-5" />
        </Button>

        <Button
          type="submit"
          disabled={isReplying || !replyMessage.trim()}
          className="h-11 px-4 sm:px-5 rounded-2xl font-semibold shadow-xs hover:bg-primary/90 shrink-0 gap-1.5"
          aria-label={t("sendReply")}
        >
          {isReplying ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send className="rtl:rotate-180" />
              <span className="hidden sm:inline">{t("sendReply")}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
