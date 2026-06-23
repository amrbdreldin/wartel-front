"use client";

import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { parentRegisterSchema } from "@/utils/validation";
import { useParentRegisterMutation } from "@/hooks/api/useAuthMutations";
import { Form, Formik } from "formik";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, User, Key, Users, Info } from "lucide-react";
import { AdmissionPanel } from "./AdmissionPanel";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { loadRecaptchaScript, executeRecaptcha } from "@/utils/recaptcha";
import { useAuth } from "@/hooks/useAuth";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { ScrollToFieldError } from "./ScrollToFieldError";

// ============================================================
// ParentRegisterForm – registration logic for parent users
// ============================================================

const initialValues = {
  full_name: "",
  mobile: "",
  password: "",
  recaptcha_token: "",
};

export function ParentRegisterForm() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const isRTL = locale === "ar";

  const { login: handleLoginState } = useAuth();
  const { mutate: registerParent, isPending } = useParentRegisterMutation();
  const [fcmToken, setFcmToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    const initFCM = async () => {
      const token = await requestNotificationToken(t("notifications.blocked_guide"));
      if (token) {
        setFcmToken(token);
      }
    };
    initFCM();

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    if (siteKey) {
      loadRecaptchaScript(siteKey);
    }
  }, [t]);

  const handleSubmit = async (values: typeof initialValues) => {
    setFormError(null);
    setFormSuccess(null);
    const recaptchaToken = await executeRecaptcha("register_parent");
    
    const payload = {
      full_name: values.full_name,
      mobile: values.mobile,
      password: values.password,
      recaptcha_token: recaptchaToken,
      firebase_token: fcmToken || undefined,
    };

    registerParent(payload, {
      onSuccess: (res) => {
        const successMsg = (res as any)?.message || t("auth.loginSuccess") || "تم تسجيل الدخول بنجاح";
        setFormSuccess(successMsg);
        toast.success(successMsg);
        
        if (res && (res.token || res.access_token)) {
          handleLoginState({
            user: res.user,
            accessToken: res.token || res.access_token || "",
            refreshToken: res.refresh_token || "",
          });
          
          router.push(`/${locale}/parent`);
        } else {
          setIsSuccess(true);
        }
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
    });
  };

  if (isSuccess) {
    return (
      <div className="bg-card rounded-3xl shadow-2xl p-12 text-center animate-in fade-in zoom-in duration-500 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-success-500/10 text-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4">{t("auth.applicationSuccessTitle") || "تم التسجيل بنجاح"}</h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {t("auth.loginModalDescParent") || "يمكنك الآن تسجيل الدخول لمتابعة حسابات أبنائك."}
        </p>
        <Link 
          href={`/${locale}/login`} 
          className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:-translate-y-1"
        >
          {t("auth.login")}
          {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-border/40 transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
      {/* Left: Admission Criteria */}
      <AdmissionPanel type="parent" />

      {/* Right: Registration Form */}
      <div className="lg:w-3/5 p-6 md:p-10 backdrop-blur-sm bg-card/85">
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 lg:hidden">
            <Logo size="lg" />
          </div>

          {/* UX Role Verification Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-black border border-accent/20 mb-4 shadow-sm select-none animate-pulse-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {t("auth.parentRegistrationRole")}
          </div>

          <h4 className="text-2xl font-bold text-foreground mb-1">{t("auth.createNewAccount")}</h4>
          <p className="text-sm text-muted-foreground">{t("auth.parentRegisterSubtitle")}</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={parentRegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-6">
              <ScrollToFieldError />

              {/* Role is implicitly Parent */}

              {/* Full Name */}
              <FormField 
                name="full_name" 
                label={t("auth.parentFullName")} 
                icon={<User className="w-4 h-4 text-muted-foreground" />}
              />

              {/* Mobile Number */}
              <PhoneFormField 
                name="mobile" 
                label={t("auth.whatsapp") || t("common.phone")} 
                placeholder={t("auth.whatsappPlaceholder") || "0101234567"} 
              />

              {/* Password */}
              <FormField 
                name="password" 
                label={t("common.password")} 
                type="password" 
                placeholder="••••••••" 
                icon={<Key className="w-4 h-4 text-muted-foreground" />}
              />

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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-xl px-5 py-4 text-white font-bold text-base transition-all duration-300",
                  "gradient-primary hover:opacity-90 hover:-translate-y-0.5",
                  "shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("auth.sending")}
                  </span>
                ) : (
                  <>
                    {t("auth.createParentAccount")}
                    {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground">
                  {t("auth.alreadyHaveAccount")}{" "}
                  <Link href={`/${locale}/login`} className="font-black text-accent hover:text-accent/80 hover:underline transition-all duration-200">
                    {t("auth.login")}
                  </Link>
                </span>
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
