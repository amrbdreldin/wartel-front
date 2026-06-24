"use client";

import { studentService } from "@/services/student.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Users, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Components
import { BuddyInfoCard } from "./_components/BuddyInfoCard";
import { TamamActionCard } from "./_components/TamamActionCard";
import { TamamHistoryTable } from "./_components/TamamHistoryTable";

export default function TamamSystemPage() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isStudentChild } = useRole();
  const params = useParams();
  const locale = params.locale as string;

  // 1. Fetch History
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["student-tamam-history"],
    queryFn: () => studentService.getTamamHistory(),
  });

  // 2. Fetch Dashboard for current Tamam status and Buddy info
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => studentService.getDashboard(),
  });

  const tamamCard = dashboardData?.data?.tamam_card;
  const buddy = tamamCard?.buddy;

  const presentStatus = tamamCard?.status?.presentStatus;
  const pastStatus = tamamCard?.status?.pastStatus;
  const isStatusCompleted = (status: any) => {
    if (!status) return false;
    const s = String(status).trim().toLowerCase();
    return s === "completed" || s === "مكتمل";
  };
  const isCompleted = isStatusCompleted(presentStatus) || isStatusCompleted(pastStatus);

  // 3. Mutation for submitting Tamam
  const submitTamamMutation = useMutation({
    mutationFn: (data: { pair_id: string | null; past_status_id: number; present_status_id: number }) =>
      studentService.submitTamam(data),
    onSuccess: (res: any) => {
      if (res?.success) {
        toast.success(t("student.tamamRecordedSuccessfully") || "تم تسجيل التمام بنجاح");
        queryClient.invalidateQueries({ queryKey: ["student-tamam-history"] });
        queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
      } else {
        if (res?.errors) {
          Object.values(res.errors).flat().forEach((msg: any) => toast.error(msg));
        } else {
          toast.error(res?.message || t("common.error"));
        }
      }
    },
    onError: (err: any) => {
      console.error("Tamam submission error:", err);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleConfirmTamam = (pastChecked: boolean, presentChecked: boolean) => {
    const pairId = isStudentChild ? null : "550e8400-e29b-41d4-a716-446655440000"; // Fallback or from buddy?
    
    setIsSubmitting(true);
    submitTamamMutation.mutate({
      pair_id: pairId,
      past_status_id: pastChecked ? 2 : 3, 
      present_status_id: presentChecked ? 2 : 3,
    });
  };

  if (historyLoading || dashboardLoading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Companion Info Card */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 animate-pulse" />
                  <Skeleton className="h-4 w-24 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-28" /></div>
                <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-20" /></div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-border/50">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-border/30">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const history = historyData?.data?.history || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
          <Users className="h-7 w-7 text-accent" />
          {t("student.tamam") || "نظام التمام الأسبوعي"}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Companion Info Card */}
        {!isStudentChild && (
          <div className="lg:col-span-5">
            <BuddyInfoCard buddy={buddy} tamamCard={tamamCard} />
          </div>
        )}

        {/* Action Card */}
        <div className={cn(isStudentChild ? "lg:col-span-12" : "lg:col-span-7")}>
          {(!buddy?.full_name && !isStudentChild) ? (
            <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm h-full flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[350px]">
              {/* Glowing decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-warning-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Lock icon with pulse */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-warning-500/10 rounded-full blur-md animate-pulse" />
                <div className="relative w-20 h-20 bg-warning-500/10 border border-warning-500/20 rounded-full flex items-center justify-center text-warning-600 shadow-inner">
                  <Lock className="h-10 w-10 animate-in zoom-in duration-500" />
                </div>
              </div>

              <h4 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                {t("student.companionLockHeader") || "التمام معطل"}
              </h4>
              
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
                {t("student.lockActionWarning") || "يرجى تعيين رفيقة تسميع أولاً لتفعيل إمكانية تأكيد التمام."}
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning-500/10 text-warning-700 dark:text-warning-400 rounded-full text-xs font-bold border border-warning-500/20">
                {t("student.statusPending") || "معلق"}
              </div>
            </div>
          ) : isCompleted ? (
            <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm h-full flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[350px]">
              {/* Glowing decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-success-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Checkmark circle with subtle pulse */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-success-500/20 rounded-full blur-md animate-ping duration-1000 opacity-75" style={{ animationDuration: "3s" }} />
                <div className="relative w-20 h-20 bg-success-500/10 border border-success-500/20 rounded-full flex items-center justify-center text-success-600 shadow-inner">
                  <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-500" />
                </div>
              </div>

              <h4 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                {t("student.tamamCompleted") || "تم إكمال التمام لهذا الأسبوع!"}
              </h4>
              
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
                {isStudentChild
                  ? (t("student.tamamCompletedDescChild") || "لقد قمتِ بتأكيد التسميع والتمام بنجاح لهذا الأسبوع. نسأل الله لكِ التوفيق والسداد.")
                  : (t("student.tamamCompletedDesc") || "لقد قمت/ــي أنت/ــي ورفيقتك بتأكيد التسميع والتمام بنجاح لهذا الأسبوع. نسأل الله لكم التوفيق والسداد.")}
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-500/10 text-success-700 dark:text-success-400 rounded-full text-xs font-bold border border-success-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
                </span>
                {t("student.statusCompleted") || "مكتمل"}
              </div>
            </div>
          ) : (
            <TamamActionCard 
              onConfirm={handleConfirmTamam} 
              isSubmitting={isSubmitting} 
              isSuccess={submitTamamMutation.isSuccess} 
              presentStatus={presentStatus}
              isStudentChild={isStudentChild}
            />
          )}
        </div>
      </div>

      {/* History Table */}
      <TamamHistoryTable history={history} />
    </div>
  );
}


