"use client";

import { Calendar, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ExcuseForm } from "@/app/[locale]/(dashboard)/student/excuses/_components/ExcuseForm";

interface ExcuseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExcuseModal({ isOpen, onClose }: ExcuseModalProps) {
  const t = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col bg-card rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 z-10">
        {/* Top Header */}
        <div className="shrink-0 bg-primary/5 border-b border-border/50 px-4 py-3 sm:p-6 flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-black text-foreground">{t("student.submitExcuse") || "تقديم عذر"}</h3>
                    <p className="text-xs text-muted-foreground font-bold">{t("student.submitNewRequest") || "تقديم طلب جديد"}</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label={t("common.close")}
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-8">
            <ExcuseForm isModal onSuccess={() => setTimeout(onClose, 2000)} />
        </div>
      </div>
    </div>
  );
}
