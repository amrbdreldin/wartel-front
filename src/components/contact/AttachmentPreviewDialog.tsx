"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface AttachmentPreviewDialogProps {
  src: string | null;
  onClose: () => void;
}

export function AttachmentPreviewDialog({ src, onClose }: AttachmentPreviewDialogProps) {
  const t = useTranslations("contactUs");

  return (
    <Dialog open={Boolean(src)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-2 gap-0">
        <DialogHeader className="p-3 border-b border-border">
          <DialogTitle className="text-xs font-semibold">{t("openFullImage")}</DialogTitle>
        </DialogHeader>
        {src && (
          <div className="relative w-full h-[70vh] bg-background rounded-b-xl overflow-hidden">
            <Image
              src={src}
              alt={t("attachmentAlt")}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
