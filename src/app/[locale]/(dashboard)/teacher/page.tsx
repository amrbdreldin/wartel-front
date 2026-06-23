"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useTeacherDashboard } from "@/hooks/api/useTeacherQueries";
import { teacherService } from "@/services/teacher.service";
import { useAuth } from "@/hooks/useAuth";
import { TeacherHero } from "./_components/TeacherHero";
import { TodaySessions } from "./_components/TodaySessions";
import { MyGroups } from "./_components/MyGroups";
import { toast } from "sonner";
import { sendMeetingLinkToChat } from "@/utils/chat";

export default function TeacherDashboardPage() {
  const t = useTranslations("teacherBoard");
  const locale = useLocale();
  const { user } = useAuth();

  const { data: dashboardResponse, isLoading, error, refetch } = useTeacherDashboard();
  const dashboardData = dashboardResponse;

  const [meetLinks, setMeetLinks] = useState<Record<string, string>>({});
  const [savedLinks, setSavedLinks] = useState<Record<string, boolean>>({});
  const [savingLinks, setSavingLinks] = useState<Record<string, boolean>>({});

  const handleSaveLink = async (group: any) => {
    const sessionId = group.session_id || group.id;
    const link = meetLinks[group.id];
    if (!link || !link.trim()) return;

    setSavingLinks((prev) => ({ ...prev, [group.id]: true }));
    try {
      await teacherService.updateSessionUrl(sessionId, link);
      setSavedLinks((prev) => ({ ...prev, [group.id]: true }));
      refetch();

      if (user) {
        try {
          // Resolve group ID by matching group name against the groups list
          const dashboardGroups = dashboardData?.groups || [];
          const matchingGroup = dashboardGroups.find(
            (g: any) => g.name === group.group_name || g.name === group.name
          );
          const finalGroupId = matchingGroup ? matchingGroup.id : (group.group_id || group.group?.id || group.id);
          
          const groupName = group.group_name || group.group?.name || group.name || `حلقة رقم ${finalGroupId}`;
          await sendMeetingLinkToChat({
            groupId: finalGroupId,
            groupName,
            meetingUrl: link,
            user: {
              id: user.id,
              full_name: user.full_name,
            },
            messageText: t("meetingLinkShareMessage", { link }),
            notificationTitle: t("meetingLinkShareTitle", { groupName }),
          });
          toast.success(t("meetingLinkSharedInChat"));
        } catch (chatErr) {
          console.error("Failed to send meeting link to chat", chatErr);
        }
      }

      setTimeout(() => {
        setSavedLinks((prev) => ({ ...prev, [group.id]: false }));
      }, 3000);
    } catch (err) {
      console.error("Failed to update session URL", err);
    } finally {
      setSavingLinks((prev) => ({ ...prev, [group.id]: false }));
    }
  };

  // ─── Loading Skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-64 bg-muted border border-border rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Today's Sessions Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted rounded-md" />
          <div className="h-32 bg-muted border border-border rounded-3xl" />
        </div>

        {/* Groups Grid Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-muted border border-border rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────
  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-3xl shadow-xl max-w-xl mx-auto space-y-6 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
          <AlertTriangle className="w-8 h-8 text-destructive animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground">{t("error")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("errorDesc")}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("retry")}</span>
        </button>
      </div>
    );
  }

  const { total_groups = 0, total_students = 0, today_sessions = [], groups = [] } = dashboardData;

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <TeacherHero
        todaySessionsCount={today_sessions.length}
        welcomeTitle={t("welcomeTitle", { name: user?.full_name || "" })}
        welcomeSubtitle={t("welcomeSubtitle")}
        locale={locale}
        totalGroups={total_groups}
        totalStudents={total_students}
        t={t}
      />

      {/* ── TODAY'S SESSIONS ─────────────────────────────────────────────── */}
      <TodaySessions
        sessions={today_sessions}
        meetLinks={meetLinks}
        setMeetLinks={setMeetLinks}
        savedLinks={savedLinks}
        savingLinks={savingLinks}
        handleSaveLink={handleSaveLink}
        locale={locale}
        t={t}
      />

      {/* ── MY GROUPS ────────────────────────────────────────────────────── */}
      <MyGroups
        groups={groups}
        locale={locale}
        t={t}
      />
    </div>
  );
}
