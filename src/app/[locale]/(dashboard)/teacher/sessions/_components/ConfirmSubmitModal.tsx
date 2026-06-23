"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function ConfirmSubmitModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ConfirmSubmitModalProps) {
  const t = useTranslations("teacherBoard");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-background rounded-3xl p-6 w-full max-w-md shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-3 text-destructive">
          <div className="p-2 bg-destructive/10 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {t("confirmSubmitTitle") || "تأكيد اعتماد سجل الحضور"}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6 font-medium leading-relaxed">
          {t("confirmSubmitDesc") || "هل أنت/ــي متأكد/ة من رغبتك في اعتماد سجل الحضور بشكل نهائي؟ لن تتمكن/ــي من تعديل أي درجات أو بيانات حضور بعد هذا الإجراء."}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
          >
            {t("confirmSubmitCancel") || "إلغاء"}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("confirmSubmitOk") || "نعم، اعتماد"}
          </button>
        </div>
      </div>
    </div>
  );
}
