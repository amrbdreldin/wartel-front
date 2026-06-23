"use client";

import { useState } from "react";
import { Video, Calendar, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";

interface NextSessionCardProps {
  nextSession: any;
}

export function NextSessionCard({ nextSession }: NextSessionCardProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const meetingUrl = nextSession?.url;

  const handleJoinSession = async () => {
    const sessionId = nextSession?.id;

    if (!sessionId) {
      toast.error(t("student.errorRegisteringAttendance"));
      return;
    }

    if (!meetingUrl) {
      toast.error(t("student.meetingInstructionsNotReady") || "No meeting link available.");
      return;
    }

    setIsJoining(true);
    try {
      const payload = {
        session_id: Number(sessionId),
      };
      await studentService.submitSessionAttendance(payload);
      toast.success(t("student.attendanceRegistered") || "Attendance recorded successfully!");
      // Open the URL in a blank page
      window.open(meetingUrl, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      console.error("Failed to register attendance", error);
      toast.error(t("student.errorRegisteringAttendance") || "Failed to record attendance.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.25)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">

      {/* Premium glow effects */}
      <div className="absolute -right-20 -top-20 w-44 h-44 bg-success-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-success-500/10 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Icon Container */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-success-500/20 to-success-500/5 text-success-600 flex items-center justify-center text-2xl mb-4 group-hover:rotate-12 group-hover:scale-115 transition-all duration-500 border border-success-500/15 shadow-[0_8px_20px_rgba(16,185,129,0.05)]">
        <Video className="h-6 w-6" />
      </div>

      {/* Titles */}
      <h3 className="font-extrabold text-lg text-foreground mb-1 tracking-tight">{t("student.nextSession")}</h3>

      {/* Session Details Layout */}
      {nextSession ? (
        <div className="bg-muted/40 border border-border/20 rounded-2xl p-4 my-3 space-y-3 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2.5 text-xs font-bold text-foreground">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{nextSession.scheduled_at}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-extrabold text-success-600 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-ping shrink-0" />
            <span className="w-2 h-2 rounded-full bg-success-500 absolute shrink-0" />
            <span>{t("student.availableNow") || "متاح الآن"}</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between my-3 min-h-[160px]">
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/80 rounded-2xl bg-muted/20 flex-grow transition-all duration-300 hover:bg-muted/30">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-success-500/20 to-success-500/5 text-success-600 flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(16,185,129,0.05)] border border-success-500/10 group-hover:scale-105 transition-transform duration-300">
              <Video className="w-5 h-5" />
            </div>
            <p className="text-xs font-extrabold text-foreground leading-relaxed">
              {t("student.noUpcomingSession")}
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[200px] leading-relaxed">
              {t("student.noUpcomingSessionDesc")}
            </p>
          </div>
        </div>
      )}

      {/* Join Class Button */}
      <div className="mt-auto pt-2">
        {nextSession ? (
          <button
            onClick={handleJoinSession}
            disabled={isJoining || !meetingUrl}
            className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-success-600 to-[#047857] hover:from-[#047857] hover:to-success-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 text-white text-center font-extrabold transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:translate-y-0"
          >
            {isJoining ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Video className={`w-4 h-4 shrink-0 ${meetingUrl ? "animate-pulse" : ""}`} />
            )}
            <span className={isJoining ? "text-xs font-bold leading-normal px-1" : ""}>
              {isJoining 
                ? t("student.joiningSession") || "Joining..." 
                : t("student.joinSession")}
            </span>
          </button>
        ) : (
          <Link
            href={`/${locale}/student/excuses`}
            className="text-xs font-extrabold text-[#007070] dark:text-[#00b3b3] hover:text-primary-dark inline-flex items-center justify-center gap-2 group/link border border-primary/20 hover:border-primary/40 px-4 py-3.5 rounded-xl bg-primary/5 hover:bg-primary/10 w-full transition-all duration-300 shadow-sm"
          >
            <span>{t("student.submitExcuse")}</span>
            {locale === "ar" ? (
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-x-1" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
            )}
          </Link>
        )}
      </div>
    </div>
  );
}
