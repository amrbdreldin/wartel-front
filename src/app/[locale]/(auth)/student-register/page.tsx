"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  UserPlus,
  Send,
  KeyRound,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Phone,
  User,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import type { StudentRegisterResponse } from "@/types/auth.types";

export default function StudentRegisterPage() {
  const t = useTranslations("studentRegister");
  const tCommon = useTranslations("common");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [regData, setRegData] = useState<StudentRegisterResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg(t("passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.studentRegister({
        full_name: fullName.trim(),
        phone: phone.trim(),
        password,
      });

      setRegData(res);
      setStep(2);
      if (res.sent_directly) {
        toast.success(t("sentDirectlyNote"));
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const firstFieldErr = apiErr?.response?.data?.errors
        ? Object.values(apiErr.response.data.errors).flat()[0]
        : null;
      const msg = firstFieldErr || apiErr?.response?.data?.message || tCommon("errorOccurred");
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsVerifying(true);

    try {
      const res = await authService.verifyStudentTelegram({
        phone: regData?.phone || phone.trim(),
        otp: otp.trim(),
      });

      const accessToken = res.token || res.access_token || "";
      if (!accessToken || !res.user) {
        setErrorMsg(tCommon("errorOccurred"));
        return;
      }

      login({
        user: res.user,
        accessToken,
        refreshToken: res.refresh_token || accessToken,
      });

      toast.success(t("successActivated"));
      router.replace(`/${locale}/student`);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const firstFieldErr = apiErr?.response?.data?.errors
        ? Object.values(apiErr.response.data.errors).flat()[0]
        : null;
      const msg = firstFieldErr || apiErr?.response?.data?.message || tCommon("errorOccurred");
      setErrorMsg(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setErrorMsg(null);
    setIsResending(true);
    try {
      const res = await authService.resendStudentTelegramOtp(regData?.phone || phone.trim());
      setRegData(res);
      toast.success(res.sent_directly ? t("sentDirectlyNote") : t("resendSuccess"));
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setErrorMsg(apiErr?.response?.data?.message || tCommon("errorOccurred"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary py-10 px-4 relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[45%] -start-[35%] w-[90%] h-[90%] rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-[45%] -end-[35%] w-[90%] h-[90%] rounded-full bg-secondary/15 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            {step === 1 ? <UserPlus className="h-6 w-6" /> : <Send className="h-6 w-6" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {step === 1 ? t("title") : t("verifyTitle")}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step === 1 ? t("subtitle") : t("verifySubtitle")}
          </p>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t("fullNameLabel")}</Label>
              <div className="relative">
                <User className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t("fullNamePlaceholder")}
                  className="ps-10 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phoneLabel")}</Label>
              <div className="relative">
                <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  className="ps-10 h-11 rounded-xl text-start"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="ps-10 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">{t("confirmPasswordLabel")}</Label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirmPasswordPlaceholder")}
                  className="ps-10 h-11 rounded-xl"
                />
              </div>
            </div>

            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              className="w-full h-11 rounded-xl font-bold text-base mt-2"
            >
              {t("submitStep1")}
            </LoadingButton>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Step 1 box: Telegram bot button */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <h2 className="text-sm font-bold text-foreground">{t("step1Title")}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{t("step1Desc")}</p>

              {regData?.telegram_url ? (
                <a
                  href={regData.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1b8cc2] text-white font-bold text-sm transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  <span>{t("openTelegramBtn")}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {t("botNotConfigured")}
                </p>
              )}

              {regData?.sent_directly && (
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("sentDirectlyNote")}
                </p>
              )}
            </div>

            {/* Step 2 box: OTP form */}
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <h2 className="text-sm font-bold text-foreground">{t("step2Title")}</h2>
                <p className="text-xs text-muted-foreground">{t("step2Desc")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">{t("otpLabel")}</Label>
                <div className="relative">
                  <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    dir="ltr"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder={t("otpPlaceholder")}
                    className="ps-10 h-12 rounded-xl text-center tracking-[0.4em] font-mono text-lg font-bold"
                  />
                </div>
              </div>

              <LoadingButton
                type="submit"
                isLoading={isVerifying}
                disabled={otp.length !== 6}
                className="w-full h-11 rounded-xl font-bold text-base"
              >
                {t("verifyBtn")}
              </LoadingButton>
            </form>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep(1);
                  setErrorMsg(null);
                }}
                className="gap-1.5 text-xs"
              >
                <ArrowRight className="h-3.5 w-3.5 ltr:rotate-180" />
                {t("backToEdit")}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isResending}
                onClick={handleResend}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                {t("resendBtn")}
              </Button>
            </div>
          </div>
        )}

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground pt-2 border-t border-border/40">
          {t("alreadyHaveAccount")}{" "}
          <Link href={`/${locale}/login`} className="font-bold text-primary hover:underline">
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
