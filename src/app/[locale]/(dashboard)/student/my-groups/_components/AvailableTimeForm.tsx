"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Clock, Save, Loader2, CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { studentService } from "@/services/student.service";
import type { AvailableTimeSlot, AvailableBuddyTime } from "@/types/student.types";

// ============================================================
// Available Time Form – Direct input rows for availability
// ============================================================

const DAY_MAP: Record<string, string> = {
  "السبت": "sat",
  "الأحد": "sun",
  "الاحد": "sun",
  "الاثنين": "mon",
  "الإثنين": "mon",
  "الثلاثاء": "tue",
  "الأربعاء": "wed",
  "الاربعاء": "wed",
  "الخميس": "thu",
  "الجمعة": "fri",
  "sat": "sat",
  "sun": "sun",
  "mon": "mon",
  "tue": "tue",
  "wed": "wed",
  "thu": "thu",
  "fri": "fri",
  "saturday": "sat",
  "sunday": "sun",
  "monday": "mon",
  "tuesday": "tue",
  "wednesday": "wed",
  "thursday": "thu",
  "friday": "fri",
};

const normalizeDay = (day?: string): string => {
  if (!day) return "";
  const trimmed = day.trim();
  const lower = trimmed.toLowerCase();
  if (DAY_MAP[trimmed]) return DAY_MAP[trimmed];
  if (DAY_MAP[lower]) return DAY_MAP[lower];
  return lower;
};

const normalizeTimeTo24h = (timeStr?: string): string => {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  // Case 1: HH:mm (e.g. "18:26")
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  // Case 2: HH:mm:ss (e.g. "18:26:00")
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }
  // Case 3: 12-hour format with AM/PM (e.g. "06:26 PM" or "6:26 am")
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|am|pm)?$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2];
    const ampm = ampmMatch[3]?.toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }
  return trimmed.slice(0, 5);
};

const mapSavedTimesToSlots = (times?: AvailableBuddyTime[]): AvailableTimeSlot[] => {
  if (!times || times.length === 0) {
    return [{ start_time: "", end_time: "" }];
  }
  return times.map((item) => ({
    ...(item.day ? { day: normalizeDay(item.day || item.day_name) } : {}),
    start_time: normalizeTimeTo24h(item.start_time),
    end_time: normalizeTimeTo24h(item.end_time),
  }));
};

interface AvailableTimeFormProps {
  groupId: number;
  savedTimes: AvailableBuddyTime[];
  onTimesChange: (newTimes: AvailableBuddyTime[]) => void;
  onSuccess?: () => void;
}

export function AvailableTimeForm({
  groupId,
  savedTimes,
  onTimesChange,
  onSuccess,
}: AvailableTimeFormProps) {
  const t = useTranslations();

  // Unified slots list initialized from savedTimes
  const [slots, setSlots] = useState<AvailableTimeSlot[]>(() =>
    mapSavedTimesToSlots(savedTimes)
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync slots when groupId changes or savedTimes updates
  useEffect(() => {
    setSlots(mapSavedTimesToSlots(savedTimes));
  }, [groupId, savedTimes]);

  const addSlot = () => {
    setSlots((prev) => [...prev, { start_time: "", end_time: "" }]);
  };

  const removeSlot = (index: number) => {
    const slotToRemove = slots[index];
    const hasContent =
      slotToRemove &&
      ((slotToRemove.start_time && slotToRemove.start_time.trim() !== "") ||
        (slotToRemove.end_time && slotToRemove.end_time.trim() !== ""));

    if (slots.length <= 1) {
      setSlots([{ start_time: "", end_time: "" }]);
    } else {
      setSlots((prev) => prev.filter((_, i) => i !== index));
    }

    if (hasContent) {
      toast.info(t("student.myGroups.saveToApplyChanges"));
    }
  };

  const updateSlot = (index: number, field: keyof AvailableTimeSlot, value: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const handleApiError = (err: unknown) => {
    const errorObj = err as {
      response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      message?: string;
    };
    const responseData = errorObj?.response?.data;
    const validationErrors = responseData?.errors;
    if (validationErrors && typeof validationErrors === "object") {
      const firstErr = Object.values(validationErrors).flat()[0];
      toast.error(firstErr);
    } else {
      const apiMessage = responseData?.message || errorObj?.message || t("common.error");
      toast.error(apiMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter filled slots
    const filledSlots = slots.filter(
      (slot) =>
        Boolean(slot.start_time && slot.start_time.trim() !== "") ||
        Boolean(slot.end_time && slot.end_time.trim() !== "")
    );

    // If user cleared all slots and wants to delete all availability
    if (filledSlots.length === 0) {
      setIsSaving(true);
      try {
        const res = await studentService.submitAvailableTime({
          group_id: groupId,
          slots: [],
        });
        if (res?.success) {
          toast.success(res?.message || t("student.myGroups.timesClearedSuccess"));
          onTimesChange([]);
          setSlots([{ start_time: "", end_time: "" }]);
          onSuccess?.();
        } else {
          toast.error(res?.message || t("common.error"));
        }
      } catch (err: unknown) {
        handleApiError(err);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // Validate each filled slot
    for (const slot of filledSlots) {
      if (!slot.start_time || !slot.end_time) {
        toast.error(t("student.myGroups.allFieldsRequired"));
        return;
      }
      if (slot.start_time >= slot.end_time) {
        toast.error(t("student.myGroups.invalidTimeRange"));
        return;
      }
    }

    // Check for conflicting overlapping slots
    for (let i = 0; i < filledSlots.length; i++) {
      for (let j = i + 1; j < filledSlots.length; j++) {
        const a = filledSlots[i];
        const b = filledSlots[j];
        if (a.start_time < b.end_time && b.start_time < a.end_time) {
          toast.error(t("student.myGroups.timeConflict"));
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      const res = await studentService.submitAvailableTime({
        group_id: groupId,
        slots: filledSlots.map((s) => ({
          ...(s.day ? { day: s.day } : {}),
          start_time: s.start_time,
          end_time: s.end_time,
        })),
      });

      if (res?.success) {
        toast.success(res?.message || t("student.myGroups.savedSuccessfully"));
        const updatedTimes: AvailableBuddyTime[] =
          res?.data && res.data.length > 0
            ? res.data
            : filledSlots.map((s, idx) => ({
                id: Date.now() + idx,
                day: s.day,
                day_name: "",
                start_time: s.start_time,
                end_time: s.end_time,
              }));
        onTimesChange(updatedTimes);
        onSuccess?.();
      } else {
        toast.error(res?.message || t("common.error"));
      }
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                {t("student.myGroups.addAvailableTime")}
                {savedTimes.length > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                    {t("student.myGroups.savedTimesCount", { count: savedTimes.length })}
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {t("student.myGroups.addAvailableTimeDesc")}
              </p>
            </div>
          </div>

          {/* Add Slot Button (Top Corner / Plus icon only with hover title) */}
          <button
            type="button"
            onClick={addSlot}
            className="w-11 h-11 rounded-2xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 flex items-center justify-center transition-all duration-300 shadow-2xs hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title={t("student.myGroups.addNewTime")}
            aria-label={t("student.myGroups.addNewTime")}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Time Slot Input Rows */}
          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border/70 hover:border-primary/40 rounded-3xl p-5 pt-6 transition-all duration-300 shadow-2xs hover:shadow-xs"
              >
                {/* Circular Slot Number Badge */}
                <div className="absolute -top-3 start-6 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-xs">
                  {index + 1}
                </div>

                {/* Remove Slot Button */}
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="absolute top-3 end-4 w-8 h-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 cursor-pointer"
                  aria-label={t("student.myGroups.removeSlot")}
                  title={t("student.myGroups.removeSlot")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1">
                  {/* Start Time / From */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 cursor-pointer"
                      htmlFor={`start-${index}`}
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{t("student.myGroups.availableTimeFrom")}</span>
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
                      className="w-full bg-background border border-border/80 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:cursor-pointer"
                      aria-label={t("student.myGroups.availableTimeFrom")}
                    />
                  </div>

                  {/* End Time / To */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 cursor-pointer"
                      htmlFor={`end-${index}`}
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{t("student.myGroups.availableTimeTo")}</span>
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
                      className="w-full bg-background border border-border/80 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit]:cursor-pointer"
                      aria-label={t("student.myGroups.availableTimeTo")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer",
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
    </div>
  );
}
