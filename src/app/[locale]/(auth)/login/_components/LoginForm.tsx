"use client";

import { useRef, useState, useEffect } from "react";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GradientBar } from "@/components/ui/gradient-bar";
import { OrDivider } from "@/components/ui/or-divider";
import { SubmitButton } from "@/components/ui/submit-button";
import { Logo } from "@/components/common/Logo";
import { loginWithRecaptchaSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { ArrowLeft, ArrowRight, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLoginMutation } from "@/hooks/api/useAuthMutations";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
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
  const dispatch = useDispatch();
  const { login: handleLoginState } = useAuth();
  const { mutate: login, isPending } = useLoginMutation();

  const [fcmToken, setFcmToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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
        const successMsg = (res as any)?.message || t("auth.loginSuccess") || "تم تسجيل الدخول بنجاح";
        setFormSuccess(successMsg);
        toast.success(successMsg);

        let redirectPath = `/${locale}/dashboard`;
        const roleIdStr = String(res.user?.role_id);
        if (roleIdStr === "1" || roleIdStr === "3") redirectPath = `/${locale}/student`;
        else if (roleIdStr === "2") redirectPath = `/${locale}/teacher`;
        else if (roleIdStr === "5") redirectPath = `/${locale}/parent`;

        router.push(redirectPath);
      },
      onError: (err: any) => {
        const responseData = err.response?.data;
        const mainMessage = responseData?.message || err.message || t("common.errorOccurred");
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
            {({ isSubmitting, setFieldValue, errors, touched }) => (
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

                  {/* Forgot password link */}
                  {/* <div className="flex justify-end">
                    <Link
                      href={`/${locale}/forgot-password`}
                      className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      {t("auth.forgotPassword")}
                    </Link>
                  </div> */}



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
                        href={`/${locale}/instructions?type=women`}
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
                  </div>

                  {/* reCAPTCHA Disclaimer
                  <div className="text-[10px] text-muted-foreground/60 text-center leading-relaxed max-w-xs mx-auto mt-4">
                    {t.rich("auth.recaptchaDisclaimer", {
                      privacyLink: (chunks) => (
                        <a 
                          href="https://policies.google.com/privacy" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="underline hover:text-primary transition-colors"
                        >
                          {chunks}
                        </a>
                      ),
                      termsLink: (chunks) => (
                        <a 
                          href="https://policies.google.com/terms" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="underline hover:text-primary transition-colors"
                        >
                          {chunks}
                        </a>
                      ),
                    })}
                  </div>
                  */}
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
}
