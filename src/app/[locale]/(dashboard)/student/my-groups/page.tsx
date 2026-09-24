"use client";

import { useState, useMemo } from "react";
import { Users, ChevronDown, AlertTriangle, Search, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import type { StudentDashboardGroup, AvailableBuddyTime } from "@/types/student.types";

// Modals
import { TamamModal } from "@/components/student/TamamModal";
import { BuddyAssignModal } from "@/components/student/BuddyAssignModal";

// Components
import { TamamStatsCard } from "../_components/TamamStatsCard";
import { AvailableTimeForm } from "./_components/AvailableTimeForm";
import { BuddyCard } from "./_components/BuddyCard";
import { MySavedTimesList } from "./_components/MySavedTimesList";

// ============================================================
// My Groups Page – Peer buddy & available times management
// ============================================================

export default function MyGroupsPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { isStudentChild } = useRole();

  // Modals State
  const [showTamamModal, setShowTamamModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
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
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  // Auto-select first group when data loads
  const activeGroupId = selectedGroupId || groups[0]?.id || null;
  const activeGroup = groups.find((g) => g.id === activeGroupId) || null;

  // Saved available times for each group (from POST student/available-time response)
  const [savedTimesByGroup, setSavedTimesByGroup] = useState<Record<number, AvailableBuddyTime[]>>({});

  const myTimes = useMemo(() => {
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
    return [];
  }, [activeGroupId, savedTimesByGroup]);

  // Fetch available buddies for the selected group
  const {
    data: buddiesData,
    isLoading: isBuddiesLoading,
    isError: isBuddiesError,
    refetch: refetchBuddies,
  } = useQuery({
    queryKey: ["available-buddies", activeGroupId],
    queryFn: () => studentService.getAvailableBuddies(activeGroupId!),
    enabled: !!activeGroupId,
  });

  const buddies = buddiesData?.data || [];

  const handleTimeSaved = (savedTimes?: AvailableBuddyTime[]) => {
    if (savedTimes && savedTimes.length > 0 && activeGroupId) {
      setSavedTimesByGroup((prev) => ({
        ...prev,
        [activeGroupId]: savedTimes,
      }));
      try {
        localStorage.setItem(
          `wartel_student_available_times_${activeGroupId}`,
          JSON.stringify(savedTimes)
        );
      } catch {}
    }
    refetchBuddies();
  };

  const handleOpenTamamModal = (group?: StudentDashboardGroup) => {
    if (group) setModalGroup(group);
    else if (activeGroup) setModalGroup(activeGroup);
    setShowTamamModal(true);
  };

  const handleOpenAssignModal = (group?: StudentDashboardGroup) => {
    if (group) {
      setSelectedGroupId(group.id);
      setModalGroup(group);
    }
    setShowAssignModal(true);
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
        <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
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
            <Users className="h-7 w-7 text-wartel-primary" />
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
        groupName={currentTamamGroup?.name}
        companionName={currentTamamGroup?.tamam_card?.buddy?.full_name}
        presentStatus={currentTamamGroup?.tamam_card?.status?.presentStatus}
        isStudentChild={isStudentChild}
        hasBuddy={currentTamamGroup?.has_buddy}
      />

      <BuddyAssignModal 
        isOpen={showAssignModal} 
        onClose={() => {
          setShowAssignModal(false);
          setModalGroup(null);
        }} 
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

      {/* Group Selector */}
      {groups.length > 1 && (
        <div className="relative max-w-sm">
          <button
            onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-card border border-border/50 rounded-2xl text-sm font-bold text-foreground hover:border-primary/30 hover:shadow-sm transition-all duration-300 cursor-pointer"
            aria-expanded={isGroupDropdownOpen}
            aria-haspopup="listbox"
            aria-label={t("student.myGroups.selectGroup")}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-4 w-4" />
              </div>
              <span>{activeGroup?.name || t("student.myGroups.selectGroupPlaceholder")}</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isGroupDropdownOpen && "rotate-180"
            )} />
          </button>

          {isGroupDropdownOpen && (
            <div className="absolute z-20 top-full mt-2 w-full bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-2 duration-200">
              <ul role="listbox" className="py-1.5">
                {groups.map((group) => (
                  <li key={group.id}>
                    <button
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setIsGroupDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-start hover:bg-muted/50 transition-colors cursor-pointer",
                        group.id === activeGroupId && "bg-primary/5 text-primary"
                      )}
                      role="option"
                      aria-selected={group.id === activeGroupId}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        group.id === activeGroupId ? "bg-primary" : "bg-muted-foreground/30"
                      )} />
                      <div>
                        <span className="font-bold">{group.name}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("student.teacher")}: {group.teacher_name}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Single group info bar */}
      {groups.length === 1 && activeGroup && (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-2xl">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-foreground">{activeGroup.name}</span>
            <p className="text-xs text-muted-foreground">
              {t("student.teacher")}: {activeGroup.teacher_name}
            </p>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {activeGroupId && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Left Column – Tamam & Group Card, My Saved Times & Add Available Times */}
          <div className="space-y-6 h-fit">
            {/* Relocated Tamam & Groups Card with Original Design */}
            <TamamStatsCard
              groups={groups}
              tamamCard={dashboardData?.data?.tamam_card}
              onShowTamamModal={handleOpenTamamModal}
              onShowAssignModal={handleOpenAssignModal}
              isStudentChild={isStudentChild}
              selectedGroupId={activeGroupId}
              onSelectGroup={(groupId) => setSelectedGroupId(groupId)}
            />

            <AvailableTimeForm
              groupId={activeGroupId}
              onSuccess={handleTimeSaved}
            />

            {myTimes.length > 0 && (
              <MySavedTimesList times={myTimes} />
            )}
          </div>

          {/* Right Column – Available Buddies */}
          <div className="space-y-6 h-fit">
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
                        groupId={activeGroupId}
                        onRequestSent={() => {
                          queryClient.invalidateQueries({ queryKey: ["available-buddies", activeGroupId] });
                          queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
