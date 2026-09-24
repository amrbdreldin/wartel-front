"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { UserCheck, Phone, User, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import { useReactivationRequestMutation } from "@/hooks/api/useAuthMutations";
import type { UserReactivationRequest } from "@/types/auth.types";

// ============================================================
// ReactivationRequestDialog – popup for users who have termination
// and wish to submit a request to rejoin the system
// ============================================================

interface ReactivationRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReactivationRequestDialog({
  open,
  onOpenChange,
}: ReactivationRequestDialogProps) {
  const t = useTranslations();
  const [step, setStep] = useState<"form" | "success">("form");
  const { mutate: requestReactivation, isPending } = useReactivationRequestMutation();

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t("validation.minLength", { min: 3 }))
      .required(t("validation.required")),
    phone: Yup.string()
      .matches(/^[0-9]{4,15}$/, t("validation.phoneInvalid"))
      .required(t("validation.required")),
    reason: Yup.string()
      .trim()
      .min(5, t("validation.minLength", { min: 5 }))
      .required(t("validation.required")),
  });

  const handleSubmit = (
    values: UserReactivationRequest,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    requestReactivation(
      {
        name: values.name.trim(),
        phone: values.phone.trim(),
        reason: values.reason.trim(),
      },
      {
        onSuccess: (res: any) => {
          setStep("success");
          resetForm();
          const msg = res?.message || t("auth.reactivationSuccessTitle");
          toast.success(msg);
        },
        onError: (err: any) => {
          const responseData = err.response?.data;
          const mainMessage =
            responseData?.message || err.message || t("common.errorOccurred");
          const validationErrors = responseData?.errors;
          if (validationErrors && typeof validationErrors === "object") {
            const firstErr = Object.values(validationErrors).flat()[0];
            toast.error(firstErr as string);
          } else {
            toast.error(mainMessage);
          }
        },
        onSettled: () => setSubmitting(false),
      }
    );
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => setStep("form"), 300);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "form" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">
                    {t("auth.reactivationRequestTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">
                    {t("auth.reactivationRequestDesc")}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Formik<UserReactivationRequest>
              initialValues={{ name: "", phone: "", reason: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 mt-2">
                  <FormField
                    name="name"
                    label={t("auth.fullName") || t("common.fullName") || "الاسم كاملاً"}
                    placeholder={t("auth.fullNamePlaceholder") || t("common.fullNamePlaceholder") || "أحمد محمد"}
                    icon={<User className="h-4 w-4 text-primary/60" />}
                    required
                  />

                  <PhoneFormField
                    name="phone"
                    label={t("common.phone") || t("auth.phone") || "رقم الهاتف"}
                    placeholder={t("auth.phonePlaceholder") || t("common.phonePlaceholder") || "0501234567"}
                    icon={<Phone className="h-4 w-4 text-primary/60" />}
                    required
                  />

                  <FormTextarea
                    name="reason"
                    label={t("auth.reactivationReasonLabel") || "سبب وتفاصيل طلب العودة"}
                    placeholder={t("auth.reactivationReasonPlaceholder") || "اكتب/ــي سبب الرغبة في إعادة تفعيل الحساب واستئناف الدراسة..."}
                    rows={3}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl text-sm font-bold gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md shadow-primary/20 gap-2 cursor-pointer"
                    disabled={isSubmitting || isPending}
                  >
                    {isSubmitting || isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("common.loading")}
                      </span>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        {t("auth.submitReactivationRequest")}
                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        )}

        {step === "success" && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center animate-in zoom-in-95 duration-500">
              <CheckCircle2 className="w-8 h-8 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {t("auth.reactivationSuccessTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xs mx-auto">
                {t("auth.reactivationSuccessDesc")}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl text-sm font-bold transition-all duration-200 gap-2 cursor-pointer"
              onClick={() => handleClose(false)}
            >
              {t("auth.backToLogin")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
