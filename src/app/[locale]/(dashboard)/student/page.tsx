"use client";

import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { TamamModal } from "@/components/student/TamamModal";
import { ExcuseModal } from "@/components/student/ExcuseModal";
import { BuddyAssignModal } from "@/components/student/BuddyAssignModal";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { useRole } from "@/hooks/useRole";
import Cookies from "js-cookie";

// Components
import { AcademyDecisionModal } from "./_components/AcademyDecisionModal";

import { WarningsCard } from "./_components/WarningsCard";
import { NextSessionCard } from "./_components/NextSessionCard";
import { TamamStatsCard } from "./_components/TamamStatsCard";
import { LatestGradeCard } from "./_components/LatestGradeCard";
import { ActiveExamCard } from "./_components/ActiveExamCard";

import { StudentDashboardGroup } from "@/types/student.types";

export default function StudentDashboardPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const { isStudentChild } = useRole();
  
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudentDashboardGroup | null>(null);

  useEffect(() => {
    const hasSeen = Cookies.get("hasSeenAcademyDecisionModal");
    if (!hasSeen) {
      setTimeout(() => setShowDecisionModal(true), 0);
    }
  }, []);
  const [showTamamModal, setShowTamamModal] = useState(false);
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const { data: dashboardData, isLoading, isError, error } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => studentService.getDashboard(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  if (isLoading) {
    const skeletonCount = 5;
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {Array.from({ length: skeletonCount }).map((_, idx) => {
            const i = idx + 1;
            return (
              <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-10 h-10 rounded-2xl" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                {i === 3 && (
                  <div className="pt-2">
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (isError || !dashboardData?.success) {
    const err = error as { response?: { data?: { message?: string } } };
    const apiErrorMsg = err.response?.data?.message || (error as Error)?.message;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground max-w-md">
          {dashboardData?.message || apiErrorMsg || t("common.errorOccurred") || "Failed to load dashboard data. Please try again later."}
        </p>
      </div>
    );
  }

  const data = dashboardData.data;
  const alerts = data?.alerts || [];
  const hasDecision = alerts.length > 0;

  const activeGroup = selectedGroup || data?.groups?.[0];
  const activeTamamCard = activeGroup?.tamam_card || data?.tamam_card;
  const hasBuddy = activeGroup ? (activeGroup.has_buddy || !!activeTamamCard?.buddy?.full_name) : !!activeTamamCard?.buddy?.full_name;
  const companionName = activeTamamCard?.buddy?.full_name || null;
  const presentStatus = activeTamamCard?.status?.presentStatus;

  const handleOpenTamamModal = (group?: StudentDashboardGroup) => {
    if (group) setSelectedGroup(group);
    setShowTamamModal(true);
  };

  const handleOpenAssignModal = (group?: StudentDashboardGroup) => {
    if (group) setSelectedGroup(group);
    setShowAssignModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Modals */}
      <TamamModal 
        isOpen={showTamamModal} 
        onClose={() => setShowTamamModal(false)} 
        companionName={companionName}
        presentStatus={presentStatus}
        isStudentChild={isStudentChild}
        hasBuddy={hasBuddy}
      />

      <ExcuseModal 
        isOpen={showExcuseModal} 
        onClose={() => setShowExcuseModal(false)} 
      />

      <BuddyAssignModal 
        isOpen={showAssignModal} 
        onClose={() => setShowAssignModal(false)} 
      />

      <AcademyDecisionModal 
        isOpen={hasDecision && showDecisionModal}
        onClose={() => {
          Cookies.set("hasSeenAcademyDecisionModal", "true", { expires: 365, path: "/" });
          setShowDecisionModal(false);
        }}
        trackTitle={data?.last_grade?.exam?.title}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <WarningsCard alerts={alerts} locale={locale} />
        <NextSessionCard 
            nextSession={data?.next_session} 
        />
        <TamamStatsCard 
            groups={data?.groups}
            tamamCard={data?.tamam_card} 
            onShowTamamModal={handleOpenTamamModal} 
            onShowAssignModal={handleOpenAssignModal}
            isStudentChild={isStudentChild}
        />
        <LatestGradeCard lastGrade={data?.last_grade} locale={locale} />
        <ActiveExamCard nextExam={data?.next_exam} locale={locale} />
      </div>
    </div>
  );
}


