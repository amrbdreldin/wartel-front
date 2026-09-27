"use client";

import { useState, useMemo } from "react";
import { Users, AlertTriangle, Search, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { StudentDashboardGroup, AvailableBuddyTime } from "@/types/student.types";

// Modals
import { TamamModal } from "@/components/student/TamamModal";

// Components
import { TamamStatsCard } from "../_components/TamamStatsCard";
import { AvailableTimeForm } from "./_components/AvailableTimeForm";
import { BuddyCard } from "./_components/BuddyCard";

// ============================================================
// My Groups Page – Tab per group with peer buddy & available times
// ============================================================

export default function MyGroupsPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { isStudentChild } = useRole();
  const { user } = useAuth();

  // Modals State
  const [showTamamModal, setShowTamamModal] = useState(false);
  const [modalGroup, setModalGroup] = useState<StudentDashboardGroup | null>(null);

  // Fetch student dashboard to get group list and tamam data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => studentService.getDashboard(),
  });

  const groups: StudentDashboardGroup[] = useMemo(
    () => dashboardData?.data?.groups || [],
    [dashboardData]
  );

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Auto-select first group when data loads
  const activeGroupId = selectedGroupId || groups[0]?.id || null;
  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0] || null;

  // Saved available times for each group
  const [savedTimesByGroup, setSavedTimesByGroup] = useState<Record<number, AvailableBuddyTime[]>>({});

  const currentGroupTimes = useMemo(() => {
    if (!activeGroupId) return [];
    if (savedTimesByGroup[activeGroupId]) {
      return savedTimesByGroup[activeGroupId];
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`wartel_student_available_times_${activeGroupId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {}
    }
    if (activeGroup?.available_times && activeGroup.available_times.length > 0) {
      return activeGroup.available_times;
    }
    return [];
  }, [activeGroupId, savedTimesByGroup, activeGroup]);

  // Check if buddy feature is enabled for the active group
  const hasBuddyEnabled = Boolean(
    activeGroup &&
      Boolean(activeGroup.has_buddy) &&
      (activeGroup.has_buddy as any) !== "false" &&
      (activeGroup.has_buddy as any) !== "0"
  );

  // Fetch available buddies for the selected group
  const {
    data: buddiesData,
    isLoading: isBuddiesLoading,
    isError: isBuddiesError,
    refetch: refetchBuddies,
  } = useQuery({
    queryKey: ["available-buddies", activeGroupId],
    queryFn: () => studentService.getAvailableBuddies(activeGroupId!),
    enabled: !!activeGroupId && hasBuddyEnabled,
  });

  const buddies = buddiesData?.data || [];

  const handleTimesChange = (newTimes: AvailableBuddyTime[]) => {
    if (!activeGroupId) return;
    setSavedTimesByGroup((prev) => ({
      ...prev,
      [activeGroupId]: newTimes,
    }));
    try {
      localStorage.setItem(
        `wartel_student_available_times_${activeGroupId}`,
        JSON.stringify(newTimes)
      );
    } catch {}
    refetchBuddies();
  };

  const handleOpenTamamModal = (group?: StudentDashboardGroup) => {
    if (group) setModalGroup(group);
    else if (activeGroup) setModalGroup(activeGroup);
    setShowTamamModal(true);
  };

  const checkIsCompleted = (tamam?: StudentDashboardGroup["tamam_card"]) => {
    if (!tamam || !tamam.status) return false;
    const statusObj: any = tamam.status;
    if (typeof statusObj === "string") {
      const s = statusObj.trim().toLowerCase();
      return s === "completed" || s === "مكتمل" || s === "done";
    }
    const presentStatus = statusObj.presentStatus || statusObj.present_status;
    const pastStatus = statusObj.pastStatus || statusObj.past_status;
    const p1 = String(presentStatus || "").trim().toLowerCase();
    const p2 = String(pastStatus || "").trim().toLowerCase();
    return (
      p1 === "completed" ||
      p1 === "مكتمل" ||
      p1 === "done" ||
      p2 === "completed" ||
      p2 === "مكتمل" ||
      p2 === "done"
    );
  };

  // ── Loading State ────────────────────────────────────────────
  if (isDashboardLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-11 w-36 rounded-2xl" />
          <Skeleton className="h-11 w-36 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border/50 rounded-3xl p-8 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
          <div className="bg-card border border-border/50 rounded-3xl p-8 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────
  if (isDashboardError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground max-w-md">
          {t("common.errorOccurred")}
        </p>
      </div>
    );
  }

  // ── No Groups ────────────────────────────────────────────────
  if (groups.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="pb-6 border-b border-border/50">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
            <Users className="h-7 w-7 text-primary" />
            {t("student.myGroups.pageTitle")}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            {t("student.noGroupsAssigned")}
          </h3>
        </div>
      </div>
    );
  }

  const currentTamamGroup = modalGroup || activeGroup;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Modals */}
      <TamamModal
        isOpen={showTamamModal}
        onClose={() => {
          setShowTamamModal(false);
          setModalGroup(null);
        }}
        groupId={currentTamamGroup?.id}
        studentId={user?.id}
        groupName={currentTamamGroup?.name}
        companionName={currentTamamGroup?.tamam_card?.buddy?.full_name}
        companionPhone={currentTamamGroup?.tamam_card?.buddy?.phone}
        presentStatus={currentTamamGroup?.tamam_card?.status?.presentStatus}
        isStudentChild={isStudentChild}
        hasBuddy={currentTamamGroup?.has_buddy || !!currentTamamGroup?.tamam_card?.buddy?.full_name}
      />

      {/* Page Header */}
      <div className="pb-6 border-b border-border/50">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
          <Users className="h-7 w-7 text-primary" />
          {t("student.myGroups.pageTitle")}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 ms-10">
          {t("student.myGroups.pageSubtitle")}
        </p>
      </div>

      {/* Group Tabs Bar */}
      <div className="space-y-2">
        <div
          role="tablist"
          aria-label={t("student.myGroups.pageTitle")}
          className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-1 px-1"
        >
          {groups.map((group) => {
            const isSelected = group.id === activeGroupId;
            const isCompleted = checkIsCompleted(group.tamam_card);

            return (
              <button
                key={group.id}
                role="tab"
                id={`group-tab-${group.id}`}
                aria-selected={isSelected}
                aria-controls={`group-panel-${group.id}`}
                onClick={() => setSelectedGroupId(group.id)}
                className={cn(
                  "group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 whitespace-nowrap cursor-pointer select-none",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.01]"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:border-border"
                )}
              >
                <Users
                  className={cn(
                    "w-4 h-4 transition-colors shrink-0",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                <span>{group.name}</span>

                {group.has_tamam && (
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0 transition-colors",
                      isSelected
                        ? isCompleted
                          ? "bg-emerald-300"
                          : "bg-warning-300"
                        : isCompleted
                        ? "bg-emerald-500"
                        : "bg-warning-500"
                    )}
                    title={isCompleted ? t("student.statusCompleted") : t("student.statusPending")}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid for Active Group Tab */}
      {activeGroup && (
        <div
          id={`group-panel-${activeGroup.id}`}
          role="tabpanel"
          aria-labelledby={`group-tab-${activeGroup.id}`}
          className={cn(
            "items-start gap-6",
            hasBuddyEnabled
              ? "grid grid-cols-1 xl:grid-cols-2"
              : "max-w-2xl"
          )}
        >
          {/* Left Column – Tamam & Group Details, Available Buddies */}
          <div className="space-y-6 h-fit">
            <TamamStatsCard
              group={activeGroup}
              onShowTamamModal={handleOpenTamamModal}
              isStudentChild={isStudentChild}
            />

            {/* Available Buddies (only if buddy feature is enabled) */}
            {hasBuddyEnabled && (
              <div className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden h-fit">
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/5 via-accent/3 to-transparent border-b border-border/50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">
                        {t("student.myGroups.availableBuddies")}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {t("student.myGroups.availableBuddiesDesc")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buddies Content */}
                <div className="p-6">
                  {isBuddiesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-muted/30 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 rounded-2xl" />
                            <div className="space-y-1.5 flex-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Skeleton className="h-7 w-28 rounded-xl" />
                            <Skeleton className="h-7 w-32 rounded-xl" />
                          </div>
                          <Skeleton className="h-9 w-full rounded-xl" />
                        </div>
                      ))}
                    </div>
                  ) : isBuddiesError ? (
                    <div className="text-center py-8 text-destructive">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-bold">{t("common.errorOccurred")}</p>
                    </div>
                  ) : buddies.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto">
                        <Search className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <h4 className="font-bold text-foreground">
                        {t("student.myGroups.noBuddiesFound")}
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        {t("student.myGroups.noBuddiesFoundDesc")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {buddies.map((buddy) => (
                        <BuddyCard
                          key={buddy.id}
                          buddy={buddy}
                          groupId={activeGroup.id}
                          onRequestSent={() => {
                            queryClient.invalidateQueries({
                              queryKey: ["available-buddies", activeGroup.id],
                            });
                            queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column – Available Times (Saved rows with trash + Add form) */}
          {hasBuddyEnabled && (
            <div className="space-y-6 h-fit">
              <AvailableTimeForm
                key={activeGroup.id}
                groupId={activeGroup.id}
                savedTimes={currentGroupTimes}
                onTimesChange={handleTimesChange}
                onSuccess={refetchBuddies}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
