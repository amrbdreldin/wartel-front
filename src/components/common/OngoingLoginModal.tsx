"use client";

import { useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { CardContent, CardFooter } from "@/components/ui/card";
import { GradientBar } from "@/components/ui/gradient-bar";
import { SubmitButton } from "@/components/ui/submit-button";
import { Logo } from "@/components/common/Logo";
import { loginWithRecaptchaSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { LogIn, ShieldAlert, LogOut, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/api/useAuthMutations";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/enums";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { loadRecaptchaScript, executeRecaptcha } from "@/utils/recaptcha";

interface OngoingLoginModalProps {
  isOpen: boolean;
  requiredRole: UserRole;
}

export function OngoingLoginModal({ isOpen, requiredRole }: OngoingLoginModalProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) || "ar";
  const isRTL = locale === "ar";

  const { login: handleLoginState, logout, clearSession, user, isAuthenticated } = useAuth();
  const { mutate: login, isPending } = useLoginMutation();

  useEffect(() => {
    if (isOpen) {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
      if (siteKey) {
        loadRecaptchaScript(siteKey);
      }
    }
  }, [isOpen]);

  // A Teacher can access both Student & Teacher pages.
  // A Parent can also access Student pages to view their children's profiles.
  // A Student can ONLY access Student pages.
  const isRoleAllowed = (role: UserRole | undefined): boolean => {
    if (!role) return false;
    if (requiredRole === UserRole.STUDENT) {
      return role === UserRole.STUDENT || role === UserRole.TEACHER || role === UserRole.PARENT;
    }
    return role === requiredRole;
  };

  // Determine if there is a role mismatch
  const hasRoleMismatch = isAuthenticated && user && !isRoleAllowed(user.role as UserRole);

  const handleSubmit = async (
    values: { phone: string; password: string; recaptcha_token: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const token = await executeRecaptcha("ongoing_login");
    login({ ...values, recaptcha_token: token }, {
      onSuccess: (res) => {
        if (res && res.user) {
          // Check role right away
          let userRole = res.user.role as UserRole;
          if (!userRole && res.user.role_id) {
            const roleIdStr = String(res.user.role_id);
            if (roleIdStr === "1" || roleIdStr === "3") userRole = UserRole.STUDENT;
            else if (roleIdStr === "2") userRole = UserRole.TEACHER;
            else if (roleIdStr === "5") userRole = UserRole.PARENT;
          }

          handleLoginState({
            user: res.user,
            accessToken: res.token || res.access_token || "",
            refreshToken: res.refresh_token || "",
          });

          if (isRoleAllowed(userRole)) {
            toast.success(t("auth.loginSuccess") || "تم تسجيل الدخول بنجاح");
          } else {
            toast.warning(t("auth.roleMismatch") || "صفتك في المنصة لا تطابق هذا القسم. يرجى تسجيل الدخول بالحساب الصحيح.");
          }
        }
      },
      onError: (err: any) => {
        // Error toasts are handled globally in axios interceptor
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  const handleSwitchAccount = () => {
    // Clear auth state without navigating — the modal stays open
    // and switches to the login form so the user can sign in as the right role.
    clearSession();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        showCloseButton={false}
        className="p-0 border-none bg-transparent shadow-none max-w-md w-full focus:outline-none"
      >
        <div 
          dir={isRTL ? "rtl" : "ltr"}
          className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="bg-card/90 backdrop-blur-lg border border-border/40 rounded-3xl shadow-2xl overflow-hidden relative">
            <GradientBar variant="primary" />

            {hasRoleMismatch ? (
              // ─── Role Mismatch State ─────────────────────────────────────
              <div className="p-8 text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 border border-warning/20 mb-2 animate-bounce">
                  <ShieldAlert className="h-8 w-8 text-warning" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-foreground">
                    {t("auth.roleMismatchTitle") || "صلاحيات غير كافية"}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {requiredRole === UserRole.STUDENT && (t("auth.roleErrorStudent") || "هذا الحساب غير مصرح له بالدخول كطالب/ــة. يرجى تسجيل الدخول بحساب طالب/ــة.")}
                    {requiredRole === UserRole.TEACHER && (t("auth.roleErrorTeacher") || "هذا الحساب غير مصرح له بالدخول كأستاذ/ة. يرجى تسجيل الدخول بحساب أستاذ/ة.")}
                    {requiredRole === UserRole.PARENT && (t("auth.roleErrorParent") || "هذا الحساب غير مصرح له بالدخول كولي أمر. يرجى تسجيل الدخول بحساب ولي الأمر.")}
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    id="switch-account-btn"
                    onClick={handleSwitchAccount}
                    className="w-full h-11 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("auth.switchAccount") || "تبديل الحساب"}</span>
                  </Button>
                  <Link
                    href={`/${locale}`}
                    className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Home className="h-4 w-4" />
                    <span>{t("common.backToHome") || "العودة للرئيسية"}</span>
                  </Link>
                </div>
              </div>
            ) : (
              // ─── Login Form State ────────────────────────────────────────
              <div className="space-y-5 pt-8">
                {/* Logo + Welcome */}
                <div className="text-center space-y-3 px-6">
                  <div className="flex justify-center">
                    <Logo size="lg" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground font-heading">
                      {t("auth.loginModalTitle") || "تسجيل الدخول مطلوب"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[280px] mx-auto">
                      {requiredRole === UserRole.STUDENT && (t("auth.loginModalDescStudent") || "يرجى تسجيل الدخول للوصول إلى لوحتك/ــكِ القرآنية.")}
                      {requiredRole === UserRole.TEACHER && (t("auth.loginModalDescTeacher") || "يرجى تسجيل الدخول للوصول إلى لوحة الأستاذ/ة الخاصة بك.")}
                      {requiredRole === UserRole.PARENT && (t("auth.loginModalDescParent") || "يرجى تسجيل الدخول للوصول إلى بوابة ولي الأمر.")}
                    </p>
                  </div>
                </div>

                <Formik
                  initialValues={{ phone: "", password: "", recaptcha_token: "" }}
                  validationSchema={loginWithRecaptchaSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, errors, touched }) => (
                    <Form className="focus:outline-none">
                      <CardContent className="space-y-5 px-6 pb-2">
                        <PhoneFormField
                          name="phone"
                          label={t("common.phone") || "رقم الهاتف"}
                          placeholder={t("auth.phonePlaceholder") || "0101234567"}
                        />
                        <FormField
                          name="password"
                          label={t("auth.passwordLabel") || t("common.password")}
                          type="password"
                          placeholder={t("auth.passwordPlaceholder") || "••••••••"}
                        />


                      </CardContent>

                      <CardFooter className="flex-col gap-3 pb-8 px-6 pt-4">
                        <SubmitButton
                          label={t("auth.login") || "تسجيل الدخول"}
                          loadingLabel={t("common.loading") || "جاري التحميل..."}
                          isSubmitting={isPending || isSubmitting}
                          icon={<LogIn className="h-4 w-4" />}
                        />
                        <Link
                          href={`/${locale}`}
                          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                          <Home className="h-4 w-4" />
                          <span>{t("common.backToHome") || "العودة للرئيسية"}</span>
                        </Link>

                        {/* reCAPTCHA Disclaimer
                        <div className="text-[9px] text-muted-foreground/60 text-center leading-relaxed max-w-xs mx-auto mt-2">
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
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
