"use client";

import { useState } from "react";
import { Plus, Trash2, Clock, Save, Loader2, CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { studentService } from "@/services/student.service";
import type { AvailableTimeSlot, AvailableBuddyTime } from "@/types/student.types";

// ============================================================
// Available Time Form – Add recitation availability
// ============================================================

const DAYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"] as const;

interface AvailableTimeFormProps {
  groupId: number;
  onSuccess?: (savedTimes?: AvailableBuddyTime[]) => void;
}

export function AvailableTimeForm({ groupId, onSuccess }: AvailableTimeFormProps) {
  const t = useTranslations();

  const [slots, setSlots] = useState<AvailableTimeSlot[]>([
    { day: "", start_time: "", end_time: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addSlot = () => {
    setSlots((prev) => [...prev, { day: "", start_time: "", end_time: "" }]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: keyof AvailableTimeSlot, value: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const validate = (): string | null => {
    for (const slot of slots) {
      if (!slot.day || !slot.start_time || !slot.end_time) {
        return t("student.myGroups.allFieldsRequired");
      }
      if (slot.start_time >= slot.end_time) {
        return t("student.myGroups.invalidTimeRange");
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      const res = await studentService.submitAvailableTime({
        group_id: groupId,
        slots,
      });
      if (res?.success) {
        toast.success(res?.message || t("student.myGroups.savedSuccessfully"));
        onSuccess?.(res?.data);
      } else {
        toast.error(res?.message || t("common.error"));
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string };
      const responseData = errorObj?.response?.data;
      const validationErrors = responseData?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const firstErr = Object.values(validationErrors).flat()[0];
        toast.error(firstErr);
      } else {
        const apiMessage = responseData?.message || errorObj?.message || t("common.error");
        toast.error(apiMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">
              {t("student.myGroups.addAvailableTime")}
            </h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {t("student.myGroups.addAvailableTimeDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="space-y-4">
          {slots.map((slot, index) => (
            <div
              key={index}
              className="group relative bg-muted/30 border border-border/50 rounded-2xl p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-sm animate-in fade-in zoom-in-95 duration-300"
            >
              {/* Slot Number Badge */}
              <div className="absolute -top-2.5 start-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                {index + 1}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                {/* Day Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor={`day-${index}`}>
                    <Clock className="h-3 w-3" />
                    {t("student.myGroups.day")}
                  </label>
                  <select
                    id={`day-${index}`}
                    value={slot.day}
                    onChange={(e) => updateSlot(index, "day", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    aria-label={t("student.myGroups.selectDay")}
                  >
                    <option value="">{t("student.myGroups.selectDay")}</option>
                    {DAYS.map((day) => (
                      <option key={day} value={day}>
                        {t(`student.myGroups.${day}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground cursor-pointer" htmlFor={`start-${index}`}>
                    {t("student.myGroups.startTime")}
                  </label>
                  <input
                    id={`start-${index}`}
                    type="time"
                    value={slot.start_time}
                    onChange={(e) => updateSlot(index, "start_time", e.target.value)}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:cursor-pointer"
                    aria-label={t("student.myGroups.startTime")}
                  />
                </div>

                {/* End Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground cursor-pointer" htmlFor={`end-${index}`}>
                    {t("student.myGroups.endTime")}
                  </label>
                  <input
                    id={`end-${index}`}
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => updateSlot(index, "end_time", e.target.value)}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:cursor-pointer"
                    aria-label={t("student.myGroups.endTime")}
                  />
                </div>
              </div>

              {/* Remove Button */}
              {slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="absolute top-3 end-3 w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/20 cursor-pointer"
                  aria-label={t("student.myGroups.removeSlot")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={addSlot}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold text-sm hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {t("student.myGroups.addSlot")}
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all duration-300 sm:ms-auto cursor-pointer",
              isSaving && "opacity-60 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("student.myGroups.saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t("student.myGroups.saveAvailableTimes")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
