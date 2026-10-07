"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { useCreateContactThread } from "@/hooks/api/useContactQueries";
import { Loader2, Send, UploadCloud, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated?: (ticketId: number) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function CreateTicketModal({
  open,
  onOpenChange,
  onTicketCreated,
}: CreateTicketModalProps) {
  const t = useTranslations("contactUs");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ subject?: string; message?: string; file?: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createThread, isPending } = useCreateContactThread();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      setErrors((prev) => ({ ...prev, file: t("invalidFileType") }));
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, file: t("fileTooLarge") }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isPending) return;
    handleRemoveFile();
    setSubject("");
    setMessage("");
    setErrors({});
    onOpenChange(false);
  };

  const validate = () => {
    const newErrors: { subject?: string; message?: string } = {};

    if (!subject.trim()) {
      newErrors.subject = t("subjectRequired");
    } else if (subject.trim().length < 3) {
      newErrors.subject = t("subjectMin");
    }

    if (!message.trim()) {
      newErrors.message = t("messageRequired");
    } else if (message.trim().length < 5) {
      newErrors.message = t("messageMin");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isPending) return;

    createThread(
      {
        subject: subject.trim(),
        message: message.trim(),
        file: file || undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || t("createTicketSuccess"));
          const createdId = res?.data?.id;
          handleClose();
          if (createdId && onTicketCreated) {
            onTicketCreated(createdId);
          }
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
          const errMsg =
            errorObj?.response?.data?.message || errorObj?.message || t("errorLoading");
          toast.error(errMsg);
        },
      }
    );
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={handleClose}>
      <ResponsiveDialogContent className="sm:max-w-xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6">
        {/* Subtle mobile sheet drag handle */}
        <div className="sm:hidden w-12 h-1.5 bg-muted-foreground/25 rounded-full mx-auto -mt-1 mb-2.5 shrink-0" />

        <ResponsiveDialogHeader className="space-y-1 text-start">
          <ResponsiveDialogTitle className="text-lg sm:text-xl font-bold text-foreground">
            {t("newTicketTitle")}
          </ResponsiveDialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("newTicketSubtitle")}
          </p>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 pt-2">
          {/* Subject Field */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-subject" className="text-xs sm:text-sm font-semibold text-foreground">
              {t("subject")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ticket-subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
              }}
              placeholder={t("subjectPlaceholder")}
              disabled={isPending}
              maxLength={150}
              className="h-10 sm:h-11 rounded-xl bg-card border-border text-sm"
              autoFocus
            />
            {errors.subject && (
              <p className="text-xs text-destructive animate-in fade-in">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-message" className="text-xs sm:text-sm font-semibold text-foreground">
              {t("message")} <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="ticket-message"
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              placeholder={t("messagePlaceholder")}
              disabled={isPending}
              className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y min-h-[90px] sm:min-h-[110px]"
            />
            {errors.message && (
              <p className="text-xs text-destructive animate-in fade-in">
                {errors.message}
              </p>
            )}
          </div>

          {/* Optional Attachment */}
          <div className="space-y-1.5">
            <Label className="text-xs sm:text-sm font-semibold text-foreground">
              {t("attachFileOptional")}
            </Label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              disabled={isPending}
            />

            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="w-full flex flex-col items-center justify-center gap-1.5 p-3.5 sm:p-4 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-2xl transition-all cursor-pointer group text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {t("attachFile")}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t("attachFileHint")}
                  </p>
                </div>
              </button>
            ) : (
              <div className="relative flex items-center gap-3 p-2.5 sm:p-3 bg-muted/50 border border-border rounded-2xl">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-background">
                  <Image
                    src={previewUrl}
                    alt="Attachment preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {file?.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isPending}
                  className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                  aria-label={t("removeFile")}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {errors.file && (
              <p className="text-xs text-destructive animate-in fade-in">
                {errors.file}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-xl px-5 h-10 sm:h-10 w-full sm:w-auto cursor-pointer"
            >
              {t("cancel")}
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl px-6 h-10 sm:h-10 bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("sending")}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 rtl:rotate-180" />
                  <span>{t("submitTicket")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
