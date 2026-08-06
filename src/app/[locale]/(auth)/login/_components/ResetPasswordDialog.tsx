"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { KeyRound, Phone, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { Button } from "@/components/ui/button";
import { useResetPasswordRequestMutation } from "@/hooks/api/useAuthMutations";

// ============================================================
// ResetPasswordDialog – popup for submitting a password reset
// request with phone number only
// ============================================================

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordDialog({ open, onOpenChange }: ResetPasswordDialogProps) {
  const t = useTranslations();
  const [step, setStep] = useState<"form" | "success">("form");
  const { mutate: resetPasswordRequest, isPending } = useResetPasswordRequestMutation();

  const phoneSchema = Yup.object({
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, t("validation.phoneInvalid"))
      .required(t("validation.required")),
  });

  const handleSubmit = (
    values: { phone: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    resetPasswordRequest(values.phone, {
      onSuccess: (res: any) => {
        setStep("success");
        const msg = res?.message || t("auth.resetPasswordRequestSuccess");
        toast.success(msg);
      },
      onError: (err: any) => {
        const responseData = err.response?.data;
        const mainMessage = responseData?.message || err.message || t("common.errorOccurred");
        const validationErrors = responseData?.errors;
        if (validationErrors && typeof validationErrors === "object") {
          const firstErr = Object.values(validationErrors).flat()[0];
          toast.error(firstErr as string);
        } else {
          toast.error(mainMessage);
        }
      },
      onSettled: () => setSubmitting(false),
    });
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset to form step when closing
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
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">
                    {t("auth.resetPasswordRequest")}
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">
                    {t("auth.resetPasswordRequestDesc")}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Formik
              initialValues={{ phone: "" }}
              validationSchema={phoneSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5 mt-2">
                  <PhoneFormField
                    name="phone"
                    label={t("common.phone") || "رقم الهاتف"}
                    placeholder={t("auth.phonePlaceholder") || "010xxxxxxx"}
                    icon={<Phone className="h-4 w-4 text-primary/60" />}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl text-sm font-bold gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md shadow-primary/20 gap-2"
                    disabled={isSubmitting || isPending}
                  >
                    {isSubmitting || isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("common.loading")}
                      </span>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        {t("auth.submitResetRequest")}
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
            <h3 className="text-lg font-bold text-foreground">
              {t("auth.resetPasswordRequestSuccess")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("auth.resetPasswordRequestDesc")}
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl text-sm font-bold transition-all duration-200 gap-2"
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
