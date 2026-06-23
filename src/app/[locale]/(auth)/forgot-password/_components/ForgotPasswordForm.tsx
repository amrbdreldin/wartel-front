"use client";

import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GradientBar } from "@/components/ui/gradient-bar";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Logo } from "@/components/common/Logo";
import { Form, Formik } from "formik";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  MessageSquare,
  Phone,
  RefreshCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/hooks/api/useAuthMutations";
import { toast } from "sonner";

// ============================================================
// ForgotPasswordForm – extracted for maintenance ease
// ============================================================

export function ForgotPasswordForm() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phoneValue, setPhoneValue] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const { mutate: initiatePasswordReset, isPending: isInitiating } = useForgotPasswordMutation();
  const { mutate: resetPassword, isPending: isResetting } = useResetPasswordMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const phoneSchema = Yup.object({
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, t("validation.phoneInvalid"))
      .required(t("validation.required")),
  });

  const resetSchema = Yup.object({
    otp: Yup.string()
      .length(6, t("validation.minLength", { min: 6 }))
      .required(t("validation.required")),
    new_password: Yup.string()
      .min(6, t("validation.passwordMinLength"))
      .required(t("validation.required")),
    new_password_confirmation: Yup.string()
      .oneOf([Yup.ref("new_password")], t("validation.passwordMatch"))
      .required(t("validation.required")),
  });

  const handleSendOtp = (
    values: { phone: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    initiatePasswordReset(values.phone, {
      onSuccess: (res: any) => {
        setPhoneValue(values.phone);
        setStep("otp");
        setResendTimer(60);
        if (res?.message) toast.success(res.message);
      },
      onError: () => {},
      onSettled: () => setSubmitting(false),
    });
  };

  const handleResetPassword = (
    values: { otp: string; new_password: string; new_password_confirmation: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    resetPassword(
      { phone: phoneValue, otp: values.otp, new_password: values.new_password, new_password_confirmation: values.new_password_confirmation },
      {
        onSuccess: (res: any) => {
          setStep("success");
          if (res?.message) toast.success(res.message);
        },
        onError: () => {},
        onSettled: () => setSubmitting(false),
      }
    );
  };

  const handleResendOtp = () => {
    if (resendTimer > 0 || isInitiating) return;
    initiatePasswordReset(phoneValue, {
      onSuccess: (res: any) => {
        setResendTimer(60);
        if (res?.message) toast.success(res.message);
      },
      onError: () => {},
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("auth.forgotPasswordTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "otp"
                ? t("auth.otpSentTo") + " " + phoneValue
                : t("auth.forgotPasswordPhoneDesc")}
            </p>
          </div>
        </div>

        {/* Card */}
        <Card className="shadow-2xl border border-border/50 bg-card/85 backdrop-blur-md overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
          <GradientBar variant="primary" />

          {step === "phone" && (
            <Formik
              initialValues={{ phone: "" }}
              validationSchema={phoneSchema}
              onSubmit={handleSendOtp}
            >
              {({ isSubmitting }) => (
                <Form>
                  <CardContent className="space-y-5 pt-8 pb-4">
                    <PhoneFormField
                      name="phone"
                      label={t("auth.whatsapp")}
                      placeholder={t("auth.phonePlaceholder")}
                      icon={<Phone className="h-4 w-4 text-primary/60" />}
                    />
                  </CardContent>
                  <CardFooter className="flex-col gap-4 pb-8">
                    <SubmitButton
                      label={t("auth.sendResetLink")}
                      loadingLabel={t("common.loading")}
                      isSubmitting={isSubmitting || isInitiating}
                      icon={<MessageSquare className="h-4 w-4" />}
                    />
                    <Link
                      href={`/${locale}/login`}
                      className="flex items-center justify-center w-full h-11 rounded-lg border border-border/60 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 gap-2"
                    >
                      {isRTL ? <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /> : <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />}
                      {t("auth.backToLogin")}
                    </Link>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          )}

          {step === "otp" && (
            <Formik
              initialValues={{ otp: "", new_password: "", new_password_confirmation: "" }}
              validationSchema={resetSchema}
              onSubmit={handleResetPassword}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <CardContent className="space-y-6 pt-8 pb-4">
                    {/* Read-only Phone Display */}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t("auth.whatsapp")}</p>
                          <p className="text-sm font-bold text-foreground">{phoneValue}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setStep("phone")} className="text-xs font-bold text-primary hover:underline">
                        {t("common.edit")}
                      </button>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-foreground block text-center">{t("auth.enterOtp")}</label>
                      <div className="flex justify-center" dir="ltr">
                        <InputOTP maxLength={6} value={values.otp} onChange={(v) => setFieldValue("otp", v)}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <FormField name="new_password" label={t("common.newPassword")} type="password" placeholder="********" />
                    <FormField name="new_password_confirmation" label={t("common.confirmNewPassword")} type="password" placeholder="********" />

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0 || isInitiating}
                        className={`text-xs font-bold transition-colors flex items-center justify-center gap-2 mx-auto ${
                          resendTimer > 0 || isInitiating
                            ? "text-muted-foreground/50 cursor-not-allowed"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <RefreshCcw className={`h-3 w-3 ${isInitiating ? "animate-spin" : ""}`} />
                        {t("auth.resendOtp")}
                        {resendTimer > 0 && (
                          <span dir="ltr" className="inline-block mx-1">
                            {String(Math.floor(resendTimer / 60)).padStart(2, "0")}:
                            {String(resendTimer % 60).padStart(2, "0")}
                          </span>
                        )}
                      </button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-4 pb-8">
                    <SubmitButton label={t("common.save")} loadingLabel={t("common.loading")} isSubmitting={isSubmitting || isResetting} />
                  </CardFooter>
                </Form>
              )}
            </Formik>
          )}

          {step === "success" && (
            <div className="px-8 py-10 text-center space-y-5">
              <div className="w-20 h-20 mx-auto rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center animate-in zoom-in-95 duration-500">
                <CheckCircle2 className="w-10 h-10 text-success-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t("auth.resetLinkSent")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("auth.resetLinkSentDesc")}</p>
              <Link
                href={`/${locale}/login`}
                className="flex items-center justify-center w-full h-11 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors gap-2"
              >
                {isRTL ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
                {t("auth.backToLogin")}
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
