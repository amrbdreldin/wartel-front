"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { SubmitButton } from "@/components/ui/submit-button";
import { loginSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLoginMutation } from "@/hooks/api/useAuthMutations";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { loadRecaptchaScript, executeRecaptcha } from "@/utils/recaptcha";
import { requestNotificationToken } from "@/utils/firebaseMessaging";

// ============================================================
// DirectJoinLoginModal – In-place Login Modal for Course Page
// ============================================================

interface DirectJoinLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DirectJoinLoginModal({
  open,
  onOpenChange,
}: DirectJoinLoginModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { login: handleLoginState } = useAuth();
  const { mutate: login, isPending } = useLoginMutation();

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    if (!open) {
      setFormError(null);
      setFormSuccess(null);
      return;
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    if (siteKey) {
      loadRecaptchaScript(siteKey);
    }

    const initFCM = async () => {
      const token = await requestNotificationToken(
        t("notifications.blocked_guide")
      );
      if (token) {
        setFcmToken(token);
      }
    };
    initFCM();
  }, [open, t]);

  const handleSubmit = async (
    values: { phone: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setFormError(null);
    setFormSuccess(null);

    const recaptchaToken = await executeRecaptcha("login");

    login(
      {
        phone: values.phone,
        password: values.password,
        recaptcha_token: recaptchaToken || undefined,
        firebase_token: fcmToken || undefined,
      },
      {
        onSuccess: (res: any) => {
          const userObj = res?.user || res?.data?.user;
          const token =
            res?.token ||
            res?.access_token ||
            res?.data?.token ||
            res?.data?.access_token;
          const refreshToken =
            res?.refresh_token || res?.data?.refresh_token || "";

          if (token && userObj) {
            handleLoginState({
              user: userObj,
              accessToken: token,
              refreshToken,
            });
          }

          const successMsg =
            res?.message || t("auth.loginSuccess") || "تم تسجيل الدخول بنجاح";
          toast.success(successMsg);
          setFormSuccess(successMsg);

          // Close modal and refresh current page in place
          onOpenChange(false);
          router.refresh();
        },
        onError: (err: any) => {
          const responseData = err.response?.data;
          const mainMessage =
            responseData?.message || err.message || t("common.errorOccurred");
          const validationErrors = responseData?.errors;
          if (validationErrors && typeof validationErrors === "object") {
            const firstErr = Object.values(validationErrors).flat()[0];
            setFormError(firstErr as string);
          } else {
            setFormError(mainMessage);
          }
        },
        onSettled: () => setSubmitting(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 rounded-2xl">
        <DialogHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-lg font-bold text-foreground">
            {t("auth.login")}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            {t("directJoin.loginModalDesc")}
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="w-full p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive flex items-start gap-2 text-xs font-semibold animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="w-full p-3 rounded-xl bg-success-500/10 border border-success-600/25 text-success-600 flex items-start gap-2 text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formSuccess}</span>
          </div>
        )}

        <Formik
          initialValues={{ phone: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 pt-1">
              <PhoneFormField
                name="phone"
                label={t("auth.phone")}
                placeholder={t("auth.phonePlaceholder")}
              />

              <div className="space-y-1">
                <FormField
                  name="password"
                  label={t("auth.password")}
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                />
                <div className="flex justify-end pt-0.5">
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="text-[11px] font-semibold text-primary hover:underline"
                    tabIndex={-1}
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <SubmitButton
                  label={t("auth.login")}
                  loadingLabel={t("auth.loginProgress")}
                  isSubmitting={isPending || isSubmitting}
                  icon={<LogIn className="h-4 w-4" />}
                />
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
