"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { ReactivationRequestDialog } from "./ReactivationRequestDialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GradientBar } from "@/components/ui/gradient-bar";
import { OrDivider } from "@/components/ui/or-divider";
import { SubmitButton } from "@/components/ui/submit-button";
import { Logo } from "@/components/common/Logo";
import { loginWithRecaptchaSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { ArrowLeft, ArrowRight, LogIn, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLoginMutation } from "@/hooks/api/useAuthMutations";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { loadRecaptchaScript, executeRecaptcha } from "@/utils/recaptcha";
import { requestNotificationToken } from "@/utils/firebaseMessaging";

// ============================================================
// LoginForm – extracted form component for maintenance ease
// ============================================================

export function LoginForm() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";

  const router = useRouter();
  const { login: handleLoginState } = useAuth();
  const { mutate: login, isPending } = useLoginMutation();

  const [fcmToken, setFcmToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [reactivationDialogOpen, setReactivationDialogOpen] = useState(false);

  useEffect(() => {
    // Preload reCAPTCHA v3 script
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    if (siteKey) {
      loadRecaptchaScript(siteKey);
    }

    // Initialize FCM
    const initFCM = async () => {
      const token = await requestNotificationToken(t("notifications.blocked_guide"));
      if (token) {
        setFcmToken(token);
      }
    };
    initFCM();
  }, [t]);

  const handleSubmit = async (
    values: { phone: string; password: string; recaptcha_token: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setFormError(null);
    setFormSuccess(null);
    const token = await executeRecaptcha("login");
    login({ ...values, recaptcha_token: token, firebase_token: fcmToken || undefined }, {
      onSuccess: (res) => {
        if (res) {
          handleLoginState({
            user: res.user,
            accessToken: res.token || res.access_token || "",
            refreshToken: res.refresh_token || "",
          });
        }
        const successMsg = (res as { message?: string })?.message || t("auth.loginSuccess") || "تم تسجيل الدخول بنجاح";
        setFormSuccess(successMsg);
        toast.success(successMsg);

        let redirectPath = `/${locale}/dashboard`;
        const roleIdStr = String(res.user?.role_id);
        if (roleIdStr === "1" || roleIdStr === "3") redirectPath = `/${locale}/student`;
        else if (roleIdStr === "2") redirectPath = `/${locale}/teacher`;
        else if (roleIdStr === "5") redirectPath = `/${locale}/parent`;

        router.push(redirectPath);
      },
      onError: (err: unknown) => {
        const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string };
        const responseData = errorObj.response?.data;
        const mainMessage = responseData?.message || errorObj.message || t("common.errorOccurred");
        const validationErrors = responseData?.errors;
        if (validationErrors && typeof validationErrors === "object") {
          const firstErr = Object.values(validationErrors).flat()[0];
          setFormError(firstErr as string);
        } else {
          setFormError(mainMessage);
        }
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        {/* Logo + Welcome */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("auth.login")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("auth.welcomeBack")}
            </p>

          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border border-border/50 bg-card/85 backdrop-blur-md overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
          <GradientBar variant="primary" />

          <Formik
            initialValues={{ phone: "", password: "", recaptcha_token: "" }}
            validationSchema={loginWithRecaptchaSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <CardContent className="space-y-5 pt-8 pb-4">
                  <PhoneFormField
                    name="phone"
                    label={t("common.phone") || "رقم الهاتف"}
                    placeholder={t("auth.phonePlaceholder") || "0101234567"}
                  />
                  <FormField
                    name="password"
                    label={t("auth.passwordLabel") || t("common.password")}
                    type="password"
                    placeholder={t("auth.passwordPlaceholder")}
                  />

                  {/* Quick links: Reactivation & Reset password */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setReactivationDialogOpen(true)}
                      className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors font-medium text-start cursor-pointer"
                    >
                      {t("auth.terminatedAccountQuestion")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetDialogOpen(true)}
                      className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors font-semibold shrink-0 cursor-pointer"
                    >
                      {t("auth.forgotPassword")}
                    </button>
                  </div>


                </CardContent>

                <CardFooter className="flex-col gap-4 pb-8">
                  {/* Local Form Alerts */}
                  {formError && (
                    <div className="w-full p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span className="font-semibold text-xs leading-normal text-start">{formError}</span>
                    </div>
                  )}
                  {formSuccess && (
                    <div className="w-full p-3.5 rounded-xl bg-success-500/10 border border-success-600/25 text-success-600 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-xs leading-normal text-start">{formSuccess}</span>
                    </div>
                  )}

                  <SubmitButton
                    label={t("auth.login")}
                    loadingLabel={t("common.loading")}
                    isSubmitting={isPending || isSubmitting}
                    icon={<LogIn className="h-4 w-4" />}
                  />

                  <OrDivider text={t("auth.or")} />

                  {/* Register Links */}
                  <div className="w-full space-y-3">
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {t("auth.dontHaveAccount")}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {/* <Link
                        href={`/${locale}/instructions?type=student`}
                        className="flex items-center justify-center h-11 rounded-xl border border-primary/20 text-xs font-black text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 gap-1.5"
                      >
                        {t("auth.registerAsStudent")}
                        {isRTL ? <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
                      </Link> */}
                      <Link
                        href={`/${locale}/instructions?type=parent`}
                        className="flex items-center justify-center h-11 rounded-xl border border-accent/20 text-xs font-black text-accent bg-accent/5 hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 gap-1.5"
                      >
                        {t("auth.registerAsParent")}
                        {isRTL ? <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
                      </Link>
                    </div>

                    {/* Reactivation Request Banner for terminated users */}
                    <div className="w-full pt-1">
                      <button
                        type="button"
                        onClick={() => setReactivationDialogOpen(true)}
                        className="w-full group flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 text-start cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {t("auth.reactivationBannerTitle")}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {t("auth.reactivationBannerSubtitle")}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-primary shrink-0 group-hover:underline">
                          {t("auth.reactivationBannerBtn")}
                        </span>
                      </button>
                    </div>
                  </div>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>

        {/* Reset Password Dialog */}
        <ResetPasswordDialog
          open={resetDialogOpen}
          onOpenChange={setResetDialogOpen}
        />

        {/* Reactivation Request Dialog */}
        <ReactivationRequestDialog
          open={reactivationDialogOpen}
          onOpenChange={setReactivationDialogOpen}
        />
      </div>
    </div>
  );
}
