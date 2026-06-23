"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { studentService } from "@/services/student.service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Video,
  Users,
  ExternalLink,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Tv
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentSessionPage() {
  const t = useTranslations();
  const { id } = useParams() as { id: string };
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const { user } = useAuth();
  const { isStudent } = useRole();
  const [attendanceRegistered, setAttendanceRegistered] = useState(false);
  const [showMeetingFrame, setShowMeetingFrame] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // 1. Fetch Student Dashboard for robust meeting link fallback
  const { data: dashboardRes } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => studentService.getDashboard(),
    staleTime: 60000,
  });

  // 2. Fetch Session Attendance (and session details/URL embedded within)
  const { data: sessionData, isLoading: isAttendanceLoading, refetch } = useQuery({
    queryKey: ["sessionAttendance", id],
    queryFn: () => studentService.getSessionAttendance(id),
    enabled: !!id,
    refetchInterval: 5000, // Real-time polling every 5 seconds!
  });

  // Extract session details with robust fallbacks
  const dashboardSession = dashboardRes?.data?.next_session;
  const groupName = sessionData?.group_name || dashboardSession?.group_name || "";
  const teacherName = sessionData?.teacher_name || dashboardSession?.teacher_name || "";

  // Resolve meeting URL with fallback logic (avoiding the default placeholder if a real one is available)
  const resolveMeetingUrl = () => {
    const urls = [
      sessionData?.url,
      dashboardSession?.meeting_link,
      dashboardSession?.url,
    ];
    // Find the first URL that is not mock placeholder
    const validUrl = urls.find(url => url && !url.includes("abc-defg-hij") && !url.includes("warattel-academy-session-8"));
    return validUrl || "";
  };

  const rawMeetingUrl = resolveMeetingUrl();
  const isGoogleMeetOrZoom = rawMeetingUrl ? (rawMeetingUrl.includes("meet.google.com") || rawMeetingUrl.includes("zoom.us")) : false;

  // 2. Submit Attendance Mutation
  const submitAttendanceMutation = useMutation({
    mutationFn: (payload: any) => studentService.submitSessionAttendance(payload),
    onSuccess: (res) => {
      setAttendanceRegistered(true);
      toast.success(t("student.attendanceRegistered"));
      refetch();
    },
    onError: (err: any) => {
      console.error("Failed to register attendance", err);
      toast.error(t("student.errorRegisteringAttendance"));
    }
  });

  // Handle Join Session Action
  const handleJoinSession = () => {
    // 1. Submit attendance if not already present in the active roster
    const isAlreadyInRoster = sessionData?.attendance?.some((record: any) => {
      const studentName = record.student_name || record.student?.full_name;
      const matchesUser = (user?.id && Number(record.student_id) === Number(user.id)) || (studentName && user?.full_name && studentName === user.full_name);
      const isPresent = record.status_id !== undefined ? (Number(record.status_id) === 1 || record.status?.name === "present") : true;
      return matchesUser && isPresent;
    });

    if (
      user?.id &&
      id &&
      !isAlreadyInRoster &&
      !submitAttendanceMutation.isPending
    ) {
      const payload = {
        session_id: Number(id),
      };

      // Synchronously dispatch the API request immediately before the redirect
      submitAttendanceMutation.mutate(payload);
    }

    // 2. Show the embedded meeting iframe
    setShowMeetingFrame(true);
  };

  // Filter only active (present) users
  const activeRecords = sessionData?.attendance?.filter((record: any) => {
    if (record.status_id !== undefined) {
      return record.status_id === 1 || record.status_id === "1";
    }
    if (record.status?.name !== undefined) {
      return record.status?.name === "present";
    }
    return !!(record.student_name || record.student?.full_name);
  }) || [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground transition-all duration-300"
            aria-label={t("common.back")}
          >
            <ArrowLeft className="w-5 h-5 rtl:-rotate-90" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-2">
              {t("student.sessionMeeting")}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
              {groupName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  <Users className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                  {groupName}
                </span>
              )}
              {teacherName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 font-bold text-xs dark:text-amber-500">
                  {t("student.teacherName")}: {teacherName}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-muted font-medium text-xs">
                {t("common.date")}: {new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Badge status */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          {submitAttendanceMutation.isPending ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {t("student.joiningSession")}
            </span>
          ) : attendanceRegistered || sessionData?.attendance?.some((r: any) => {
              const studentName = r.student_name || r.student?.full_name;
              const matchesUser = (user?.id && Number(r.student_id) === Number(user.id)) || (studentName && user?.full_name && studentName === user.full_name);
              const isPresent = r.status_id !== undefined ? (Number(r.status_id) === 1 || r.status?.name === "present") : true;
              return matchesUser && isPresent;
            }) ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-success-500/10 text-success-600 border border-success-500/20">
              <CheckCircle className="w-3.5 h-3.5" />
              {t("student.attendanceRegistered")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
              <AlertCircle className="w-3.5 h-3.5" />
              {t("student.inactive")}
            </span>
          )}
        </div>
      </div>

      {/* ── 1. The Meeting Window with Nice Aspect Ratio ── */}
      <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
        {showMeetingFrame ? (
          <div className="relative w-full rounded-3xl border border-border/80 shadow-2xl bg-card overflow-hidden flex flex-col">
            {/* Header bar of the frame */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                </span>
                <span className="font-extrabold text-sm text-foreground">
                  {t("student.sessionMeeting")}
                </span>
                {!iframeLoaded && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    {t("student.loadingLiveSession")}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setShowMeetingFrame(false);
                  setIframeLoaded(false);
                }}
                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-black rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-destructive/10 cursor-pointer"
              >
                {t("student.exitClassFrame")}
              </button>
            </div>

            {/* Iframe content */}
            <div className="relative w-full aspect-video min-h-[450px] md:min-h-[600px] bg-black">
              {isGoogleMeetOrZoom ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-gradient-to-br from-card/95 via-card/98 to-muted/95 p-6 text-center z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-destructive/15 rounded-full blur-xl scale-125 animate-pulse" />
                    <div className="relative w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center border-2 border-destructive/20">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-lg font-black text-foreground">
                      {t("student.googleMeetFallbackTitle")}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {t("student.googleMeetFallbackDesc")}
                    </p>
                  </div>
                  <a
                    href={rawMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>{t("student.openInNewTab")}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-background/95 z-20">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                      <p className="text-sm font-bold text-foreground animate-pulse">
                        {t("student.loadingLiveSession")}
                      </p>
                    </div>
                  )}
                  <iframe
                    src={rawMeetingUrl}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    onLoad={() => setIframeLoaded(true)}
                    className="w-full h-full border-0 absolute inset-0 z-10"
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="relative w-full rounded-3xl border border-border/80 shadow-2xl bg-gradient-to-br from-card/85 via-card/95 to-muted/50 p-6 md:p-12 overflow-hidden group">
            {/* Subtle moving glow border/background */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/15 transition-all duration-700" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-700" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto py-6 md:py-8 space-y-6 md:space-y-8">

              {/* Elegant glowing video meeting icon header */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125 animate-pulse" />
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-primary-foreground shadow-lg border-4 border-background">
                  <Video className="w-10 h-10 md:w-12 md:h-12 animate-bounce" />
                </div>
              </div>

              {/* Premium status indicators */}
              <div className="space-y-3">
                {rawMeetingUrl ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
                    {t("student.meetingLinkReady")}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/25">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b]" />
                    {t("student.meetingLinkNotReady")}
                  </div>
                )}
                <h2 className="text-xl md:text-3xl font-black tracking-tight text-foreground">
                  {t("student.sessionMeeting")}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {rawMeetingUrl ? t("student.meetingInstructions") : t("student.meetingInstructionsNotReady")}
                </p>
              </div>

              {/* Glowing Call to Action Button */}
              <div className="w-full sm:w-auto pt-2">
                <button
                  onClick={handleJoinSession}
                  disabled={!rawMeetingUrl}
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-primary-foreground font-black text-sm md:text-base rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 transform focus:ring-4 focus:ring-primary/40 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  <span>{t("student.joinMeetingBtn")}</span>
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>

              {/* Security Alert Badge */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/5 text-amber-600/90 border border-amber-500/10 text-xs text-start max-w-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t("student.meetingSecurityAlert")}</span>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── 2. Under the Meeting: ONLY Table List of Active Users ── */}
      <div className="w-full max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t("student.activeUsersTable")}
            <span className="text-xs bg-primary/10 text-primary font-extrabold px-2 py-0.5 rounded-full">
              {activeRecords.length}
            </span>
          </h2>
        </div>

        {isAttendanceLoading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-border/50">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          </div>
        ) : activeRecords.length > 0 ? (
          <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-6 py-4 text-start text-xs font-black text-muted-foreground uppercase tracking-wider">
                      {t("common.name")}
                    </th>
                    <th className="px-6 py-4 text-start text-xs font-black text-muted-foreground uppercase tracking-wider">
                      {t("common.status")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {activeRecords.map((record: any, index: number) => {
                    const studentName = record.student_name || record.student?.full_name || t("auth.student");
                    const initial = studentName.charAt(0);
                    return (
                      <tr
                        key={record.attendance_id || index}
                        className="hover:bg-muted/10 transition-colors duration-200"
                      >
                        {/* Student Name with Nice Initial Avatar */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {initial}
                            </div>
                            <span className="font-bold text-sm text-foreground">
                              {studentName}
                            </span>
                            {((user?.id && Number(record.student_id) === Number(user?.id)) || (studentName && user?.full_name && studentName === user?.full_name)) && (
                              <span className="text-[10px] font-black bg-success-500/10 text-success-600 px-2 py-0.5 rounded-full">
                                {locale === "ar" ? "أنت/ــي" : "You"}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status with green glowing dot */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success-500/10 text-success-600 border border-success-500/20">
                            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                            {t("student.active")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-border/80 border-dashed text-center text-muted-foreground shadow-sm">
            <Tv className="w-12 h-12 text-muted-foreground/60 mb-3" />
            <p className="text-sm font-medium">{t("student.noActiveSessionUsers")}</p>
          </div>
        )}
      </div>

    </div>
  );
}
