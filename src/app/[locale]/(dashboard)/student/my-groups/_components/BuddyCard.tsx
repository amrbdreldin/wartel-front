"use client";

import { useState } from "react";
import { Phone, Clock, UserPlus, Loader2, CheckCircle2, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { studentService } from "@/services/student.service";
import type { AvailableBuddy } from "@/types/student.types";

// ============================================================
// Buddy Card – Shows an available buddy with their times
// ============================================================

interface BuddyCardProps {
  buddy: AvailableBuddy;
  groupId: number;
  onRequestSent?: () => void;
}

export function BuddyCard({ buddy, groupId, onRequestSent }: BuddyCardProps) {
  const t = useTranslations();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getDayLabel = (day: string) => {
    try {
      return t(`student.myGroups.${day}` as Parameters<typeof t>[0]) || day;
    } catch {
      return day;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return name[0] || "—";
  };

  const handleSendRequest = async () => {
    setIsRequesting(true);
    try {
      const res = await studentService.submitPeerBuddy({
        group_id: groupId,
        student_id: buddy.id,
      });
      if (res?.success) {
        setIsRequested(true);
        setShowConfirm(false);
        toast.success(t("student.myGroups.buddyRequestSent"));
        onRequestSent?.();
      } else {
        toast.error(res?.message || t("common.error"));
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const apiMessage = errorObj?.response?.data?.message || errorObj?.message || t("common.error");
      toast.error(apiMessage);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="group bg-card border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-5 space-y-4">
        {/* Student Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm border border-primary/10">
              {getInitials(buddy.name)}
            </div>
            <div className="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-success-500 border-2 border-card" />
          </div>

          {/* Name & Phone */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-foreground text-sm truncate">
              {buddy.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span className="font-medium" dir="ltr">{buddy.phone}</span>
            </div>
          </div>
        </div>

        {/* Available Times */}
        {buddy.available_times && buddy.available_times.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {t("student.myGroups.availableTimes")}
            </div>
            <div className="flex flex-wrap gap-2">
              {buddy.available_times.map((time) => (
                <div
                  key={time.id}
                  className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 rounded-xl px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary/10"
                >
                  <Clock className="h-3 w-3 text-primary shrink-0" />
                  <span className="font-bold">{time.day_name || getDayLabel(time.day)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span dir="ltr">
                    {formatTime(time.start_time)} - {formatTime(time.end_time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1">
          {isRequested ? (
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-success-500/10 text-success-600 font-bold text-sm border border-success-500/20">
              <CheckCircle2 className="h-4 w-4" />
              {t("student.myGroups.buddyRequestSent")}
            </div>
          ) : showConfirm ? (
            <div className="space-y-3 bg-warning-500/5 border border-warning-500/20 rounded-xl p-4 animate-in zoom-in-95 duration-200">
              <p className="text-xs font-bold text-foreground text-center">
                {t("student.myGroups.confirmBuddyRequest", { name: buddy.name })}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSendRequest}
                  disabled={isRequesting}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRequesting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {t("student.myGroups.sendingRequest")}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t("common.confirm")}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-muted-foreground font-bold text-xs hover:bg-muted/80 transition-all cursor-pointer"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              {t("student.myGroups.sendBuddyRequest")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
