import { CheckCircle2, Heart, Info, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TamamActionCardProps {
  onConfirm: (pastChecked: boolean, presentChecked: boolean) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  presentStatus?: string;
  isStudentChild?: boolean;
}

export function TamamActionCard({ onConfirm, isSubmitting, isSuccess, presentStatus, isStudentChild }: TamamActionCardProps) {
  const t = useTranslations();
  const [pastChecked, setPastChecked] = useState(false);
  const [presentChecked, setPresentChecked] = useState(false);

  const isPending = !presentStatus || presentStatus.toLowerCase() === "pending";
  const isButtonDisabled = isSubmitting || !isPending || (!pastChecked && !presentChecked);

  return (
    <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm h-full">
      {isSuccess ? (
        <div className="animate-in zoom-in-95 fade-in duration-400 text-center py-8">
          <Heart className="h-16 w-16 text-success-500 mx-auto mb-4 animate-in zoom-in duration-500" />
          <h5 className="text-2xl font-bold text-success-600 mb-2">{t("student.tamamRecordedSuccessfully")}</h5>
          <p className="text-muted-foreground font-medium">{t("student.mayAllahBlessYou")}</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h6 className="font-bold text-lg text-foreground mb-6">{t("student.currentMemorizationProcedures")}</h6>

          <div className="space-y-6">
            <div className="bg-primary/5 border-s-4 border-primary p-4 rounded-xl text-sm text-foreground/80 font-medium leading-relaxed flex items-start rtl:border-s-4 rtl:border-r-0 ltr:border-l-4 ltr:border-r-0">
              <Info className="h-5 w-5 text-primary shrink-0 ms-1 me-2" />
              <span>
                {isStudentChild
                  ? (t("student.tamamInstructionChild") || "الرجاء تأكيد إتمام ورد الحفظ والتسميع لهذا الأسبوع، ثم الضغط على زر التأكيد أدناه لتوثيق التمام في نظامكِ.")
                  : (t("student.tamamInstruction") || "الرجاء تأكيد حضور الرفيقة لهذا الأسبوع وتحديد مستوى الحفظ.")}
              </span>
            </div>

            {/* Companion Confirmation Checkboxes */}
            <div className="space-y-4 bg-muted/20 border border-border/40 rounded-2xl p-4 md:p-5">
              <h6 className="font-bold text-sm text-foreground flex items-center gap-2">
                <span className="w-1.5 h-3 bg-primary rounded-full"></span>
                {isStudentChild
                  ? (t("student.tamamHeaderChild") || "تأكيد تسميع الورد")
                  : (t("student.tamamCompanionHeader") || "تأكيد سماع الرفيقة")}
              </h6>
              
              <p className="text-xs text-muted-foreground">
                {isStudentChild
                  ? (t("student.tamamInstructionCheckChild") || "يرجى تأكيد تسميع ورد الماضي والحاضر لتتمكني من إرسال التمام:")
                  : (t("student.tamamCompanionInstructionCheck") || "يرجى تأكيد سماع الرفيقة لورد الماضي والحاضر لتتمكني من إرسال التمام:")}
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
                    {isStudentChild
                      ? (t("student.tamamPastConfirmationChild") || "أؤكد أنني قمت بتسميع ورد الماضي")
                      : (t("student.tamamPastConfirmation") || "أؤكد أن الرفيقة سمعت ورد الماضي")}
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
                    {isStudentChild
                      ? (t("student.tamamPresentConfirmationChild") || "أؤكد أنني قمت بتسميع ورد الحاضر")
                      : (t("student.tamamPresentConfirmation") || "أؤكد أن الرفيقة سمعت ورد الحاضر")}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => onConfirm(pastChecked, presentChecked)}
                disabled={isButtonDisabled}
                className={cn(
                  "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-sm",
                  isButtonDisabled && "opacity-50 cursor-not-allowed transform-none"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t("student.processing")}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    {t("student.confirmTamam")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
