"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { studentService } from "@/services/student.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

import { DatePicker } from "@/components/ui/DatePicker";

// ============================================================
// Shared input style constants
// ============================================================
const INPUT_BASE =
  "w-full bg-muted/50 border text-foreground text-sm rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-3.5 transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer";
const INPUT_NORMAL = "border-border/50";
const INPUT_ERROR =
  "border-destructive focus:ring-destructive/20 focus:border-destructive";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive mt-1.5 flex items-center gap-1" role="alert">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}

// ============================================================
// ExcuseForm Component
// ============================================================
export function ExcuseForm({ isModal = false, onSuccess }: { isModal?: boolean; onSuccess?: () => void }) {
  const t = useTranslations();

  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const isAfterToday = (dateStr: string) => {
    if (!dateStr) return true;
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  // Derived validation errors
  const errors = {
    fromDate: submitted && !fromDate
      ? t("validation.required")
      : submitted && fromDate && !isAfterToday(fromDate)
        ? t("validation.startDateAfterToday")
        : undefined,
    toDate: submitted && !toDate
      ? t("validation.required")
      : submitted && fromDate && toDate && new Date(fromDate) > new Date(toDate)
        ? t("validation.invalidDateRange")
        : undefined,
    reason: submitted && !reason.trim() ? t("validation.required") : undefined,
  };

  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: (data: { start_date: string; end_date: string; reason: string }) =>
      studentService.submitExcuse(data),
    onSuccess: (res) => {
      setFormState("success");
      toast.success(res?.message || t("student.requestSentSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ["student-leaves"] });
      onSuccess?.();
      setTimeout(() => {
        setFormState("idle");
        setSubmitted(false);
        setFromDate("");
        setToDate("");
        setReason("");
      }, 3000);
    },
    onError: () => {
      setFormState("idle");
      // API error toast is handled by the global axios interceptor
    },
  });

  const handleFromDateChange = (val: string) => {
    setFromDate(val);
    // If new from > existing to, clear to so user must re-pick
    if (toDate && val > toDate) setToDate("");
  };

  const handleToDateChange = (val: string) => {
    setToDate(val);
    // If new to < existing from, clear from so user must re-pick
    if (fromDate && val < fromDate) setFromDate("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!fromDate || !toDate || !reason.trim()) return;
    if (new Date(fromDate) > new Date(toDate)) return;
    if (!isAfterToday(fromDate)) return;
    setFormState("submitting");
    submitMutation.mutate({ start_date: fromDate, end_date: toDate, reason });
  };

  const formContent = (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* From Date */}
        <div>
          <label className="block text-sm font-bold text-foreground/80 mb-2">
            {t("student.fromDate")} <span className="text-destructive">*</span>
          </label>
          <DatePicker
            value={fromDate}
            minDate={tomorrowStr}
            maxDate={toDate || undefined}
            onChange={handleFromDateChange}
            hasError={!!errors.fromDate}
            placeholder={t("student.fromDate")}
          />
          <FieldError message={errors.fromDate} />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-bold text-foreground/80 mb-2">
            {t("student.toDate")} <span className="text-destructive">*</span>
          </label>
          <DatePicker
            value={toDate}
            minDate={fromDate || tomorrowStr}
            onChange={handleToDateChange}
            hasError={!!errors.toDate}
            placeholder={t("student.toDate")}
          />
          <FieldError message={errors.toDate} />
        </div>
      </div>

      {/* Reason */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-foreground/80 mb-2">
          {t("student.excuseDetails")} <span className="text-destructive">*</span>
        </label>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={cn(
            "w-full bg-muted/50 border text-foreground text-sm rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-3.5 transition-colors resize-none",
            errors.reason ? INPUT_ERROR : INPUT_NORMAL
          )}
          placeholder={t("student.excuseDetailsPlaceholder")}
        />
        <FieldError message={errors.reason} />
      </div>

      <button
        type="submit"
        disabled={formState !== "idle"}
        className={cn(
          "w-full flex items-center justify-center gap-2 text-center font-bold py-4 px-6 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer",
          formState === "idle"
            ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:-translate-y-1 shadow-primary/20"
            : formState === "submitting"
              ? "bg-primary opacity-50 cursor-not-allowed"
              : "bg-success-500 hover:bg-success-600 text-white"
        )}
      >
        {formState === "idle" && <> {t("student.submitRequestForReview")} <Send className="w-5 h-5 rtl:-rotate-90" /></>}
        {formState === "submitting" && <><Loader2 className="w-5 h-5 animate-spin" /> {t("student.sending")}</>}
        {formState === "success" && <><Check className="w-5 h-5" /> {t("student.requestSentSuccessfully")}</>}
      </button>
    </form>
  );

  if (isModal) return formContent;

  return (
    <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm">
      <h5 className="font-bold text-primary text-xl mb-6">{t("student.submitNewRequest")}</h5>
      {formContent}
    </div>
  );
}
