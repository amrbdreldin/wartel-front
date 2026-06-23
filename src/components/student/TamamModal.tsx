"use client";

import { studentService } from "@/services/student.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle2, Heart, Info, Loader2,
    Users, UserCheck, X
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TamamModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionName: string;
  presentStatus?: string;
  isStudentChild?: boolean;
}

export function TamamModal({ isOpen, onClose, companionName, presentStatus, isStudentChild }: TamamModalProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [pastChecked, setPastChecked] = useState(false);
  const [presentChecked, setPresentChecked] = useState(false);

  const isPending = !presentStatus || presentStatus.toLowerCase() === "pending";
  const isDisabled = isSubmitting || !isPending;
  const isButtonDisabled = isSubmitting || !isPending || (!pastChecked && !presentChecked);

  // Mutation for submitting Tamam
  const submitTamamMutation = useMutation({
    mutationFn: (data: { pair_id: string | null; past_status_id: number; present_status_id: number }) =>
      studentService.submitTamam(data),
    onSuccess: (res: any) => {
      if (res?.success) {
        setShowSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["student-tamam-history"] });
      } else {
        if (res?.errors) {
          Object.values(res.errors).flat().forEach((msg: any) => toast.error(msg));
        } else {
          toast.error(res?.message || t("common.error"));
        }
      }
    },
    onError: (err: any) => {
      // Interceptor already toasts common errors, but we can add specific handling if needed
      console.error("Tamam submission error:", err);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleConfirmTamam = () => {
    // Body: { "pair_id": "...", "past_status_id": 2, "present_status_id": 3 }
    const pairId = isStudentChild ? null : "550e8400-e29b-41d4-a716-446655440000"; // Provided in request example
    
    setIsSubmitting(true);
    submitTamamMutation.mutate({
      pair_id: pairId,
      past_status_id: pastChecked ? 2 : 3,
      present_status_id: presentChecked ? 2 : 3,
    });
  };

  const handleClose = () => {
    onClose();
    // Reset state after a small delay for smooth transition
    setTimeout(() => {
        setShowSuccess(false);
        setIsSubmitting(false);
        setPastChecked(false);
        setPresentChecked(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-lg bg-card rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 z-10">
        {/* Top Header */}
        <div className="bg-primary/5 border-b border-border/50 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-black text-foreground">{t("student.weeklyTamam") || "التمام الأسبوعي"}</h3>
                    <p className="text-xs text-muted-foreground font-bold">{t("student.confirmYourTamam") || "تأكيد تمام ورد هذا الأسبوع"}</p>
                </div>
            </div>
            <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label={t("common.close")}
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-8">
            {showSuccess ? (
                <div className="animate-in zoom-in-95 fade-in duration-400 text-center py-10 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-success-500 blur-3xl opacity-20 animate-pulse" />
                        <Heart className="h-20 w-20 text-success-500 mx-auto relative z-10 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                            <h5 className="text-3xl font-black text-success-600">{t("student.tamamRecordedSuccessfully") || "تم تسجيل التمام بنجاح"}</h5>
                            <p className="text-xl text-muted-foreground font-medium">
                                {isStudentChild
                                    ? (t("student.tamamCompletedDescChild") || "لقد قمتِ بتأكيد التسميع والتمام بنجاح لهذا الأسبوع. نسأل الله لكِ التوفيق والسداد.")
                                    : (t("student.mayAllahBlessYou") || "بارك الله فيك ونفع بك")}
                            </p>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="px-10 py-3 rounded-xl bg-success-600 text-white font-bold hover:bg-success-700 transition-all shadow-lg shadow-success-500/20"
                    >
                        {t("common.close")}
                    </button>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Highlight Section */}
                    {isStudentChild ? (
                        <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-primary/10">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <h4 className="text-xl font-bold text-foreground mb-1">{t("student.tamamHeaderChild") || "تأكيد تسميع الورد"}</h4>
                            <p className="text-primary font-bold text-sm tracking-wide">{t("student.confirmYourTamam") || "تأكيد تمام ورد هذا الأسبوع"}</p>
                        </div>
                    ) : (
                        <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-primary/10">
                                <UserCheck className="h-8 w-8 text-primary" />
                            </div>
                            <h4 className="text-xl font-bold text-foreground mb-1">{t("student.rafeqaName")}: {companionName}</h4>
                            <p className="text-primary font-bold text-sm tracking-wide">{t("student.confirmAttendance") || "تأكيد حضور الرفيقة"}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-sm text-muted-foreground font-medium leading-relaxed flex items-start gap-4">
                            <Info className="h-6 w-6 text-primary shrink-0" />
                            <span>
                                {isStudentChild
                                    ? (t("student.tamamInstructionChild") || "الرجاء تأكيد إتمام ورد الحفظ والتسميع لهذا الأسبوع، ثم الضغط على زر التأكيد أدناه لتوثيق التمام في نظامكِ.")
                                    : (t("student.tamamInstruction") || "الرجاء تأكيد حضور الرفيقة لهذا الأسبوع وتوثيق إتمام ورد المراجعة.")}
                            </span>
                        </div>

                        {/* Confirmation Checkboxes */}
                        <div className="space-y-4 bg-muted/20 border border-border/40 rounded-2xl p-4 md:p-5">
                            <h6 className="font-bold text-sm text-foreground flex items-center gap-2">
                                <span className="w-1.5 h-3 bg-primary rounded-full"></span>
                                {isStudentChild ? (t("student.tamamHeaderChild") || "تأكيد تسميع الورد") : (t("student.tamamCompanionHeader") || "تأكيد سماع الرفيقة")}
                            </h6>
                            
                            <p className="text-xs text-muted-foreground">
                                {isStudentChild ? (t("student.tamamInstructionCheckChild") || "يرجى تأكيد تسميع ورد الماضي والحاضر لتتمكني من إرسال التمام:") : (t("student.tamamCompanionInstructionCheck") || "يرجى تأكيد سماع الرفيقة لورد الماضي والحاضر لتتمكني من إرسال التمام:")}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Past Checkbox Card */}
                                <button
                                    type="button"
                                    disabled={!isPending}
                                    onClick={() => setPastChecked(prev => !prev)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border text-start transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 select-none",
                                        pastChecked
                                            ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                            : "border-border/60 bg-card hover:bg-muted/10 text-muted-foreground",
                                        !isPending && "opacity-60 cursor-not-allowed"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                        pastChecked
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground/40 bg-transparent"
                                    )}>
                                        {pastChecked && (
                                            <svg className="w-3 h-3 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-foreground">
                                        {isStudentChild ? (t("student.tamamPastConfirmationChild") || "أؤكد أنني قمت بتسميع ورد الماضي") : (t("student.tamamPastConfirmation") || "أؤكد أن الرفيقة سمعت ورد الماضي")}
                                    </span>
                                </button>

                                {/* Present Checkbox Card */}
                                <button
                                    type="button"
                                    disabled={!isPending}
                                    onClick={() => setPresentChecked(prev => !prev)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border text-start transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 select-none",
                                        presentChecked
                                            ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                            : "border-border/60 bg-card hover:bg-muted/10 text-muted-foreground",
                                        !isPending && "opacity-60 cursor-not-allowed"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                        presentChecked
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground/40 bg-transparent"
                                    )}>
                                        {presentChecked && (
                                            <svg className="w-3 h-3 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-foreground">
                                        {isStudentChild ? (t("student.tamamPresentConfirmationChild") || "أؤكد أنني قمت بتسميع ورد الحاضر") : (t("student.tamamPresentConfirmation") || "أؤكد أن الرفيقة سمعت ورد الحاضر")}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmTamam}
                            disabled={isButtonDisabled}
                            className={cn(
                                "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-5 px-6 rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 shadow-xl shadow-primary/20",
                                isButtonDisabled && "opacity-50 cursor-not-allowed transform-none"
                            )}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-6 w-6 animate-spin" /> {t("student.processing")}</>
                            ) : (
                                <><CheckCircle2 className="h-6 w-6" /> {t("student.confirmTamam")}</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
