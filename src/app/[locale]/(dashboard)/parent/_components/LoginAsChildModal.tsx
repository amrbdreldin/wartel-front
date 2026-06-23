"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GradientBar } from "@/components/ui/gradient-bar";
import { loginSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import {
  LogIn,
  X,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useLoginMutation } from "@/hooks/api/useAuthMutations";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ChildInfo {
  id: number;
  name: string;
  enrollment_type: string;
}

interface LoginAsChildModalProps {
  isOpen: boolean;
  child: ChildInfo | null;
  onClose: () => void;
}

export function LoginAsChildModal({
  isOpen,
  child,
  onClose,
}: LoginAsChildModalProps) {
  const t = useTranslations("parent");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const { login: handleLoginState } = useAuth();
  const { mutate: login, isPending } = useLoginMutation();

  const getEnrollmentLabel = (type: string) => {
    const normalized = type?.toLowerCase();
    if (normalized === "academy" || normalized === "الأكاديمية" || normalized === "الأكاديميه") return t("academy");
    if (normalized === "institute" || normalized === "المعهد") return t("institute");
    return type;
  };

  const handleSubmit = (
    values: { phone: string; password: string },
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    login(values, {
      onSuccess: (res) => {
        if (res?.user) {
          handleLoginState({
            user: res.user,
            accessToken: res.token || res.access_token || "",
            refreshToken: res.refresh_token || "",
          });

          const childName = child?.name || "";
          toast.success(
            t("loginAsChildSuccess", { name: childName })
          );

          onClose();

          // Small delay to let state settle before redirect
          setTimeout(() => {
            router.push(`/${locale}/student`);
          }, 150);
        }
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  if (!child) return null;

  const initial = child.name?.trim().charAt(0) || "ط";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="p-0 border-none bg-transparent shadow-none max-w-sm w-full focus:outline-none"
      >
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="w-full animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="bg-card/95 backdrop-blur-lg border border-border/50 rounded-3xl shadow-2xl overflow-hidden relative">
            <GradientBar variant="primary" />

            {/* Close button */}
            <button
              onClick={() => !isPending && onClose()}
              disabled={isPending}
              className="absolute top-4 end-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
              aria-label={tCommon("close")}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pb-8 pt-6 space-y-6">
              {/* Child Info Header */}
              <div className="flex flex-col items-center gap-3 text-center pt-2">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-4 border-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-lg shadow-primary/10">
                    {initial}
                  </div>
                  <div className="absolute -bottom-1 -end-1 w-7 h-7 bg-primary rounded-full border-2 border-background flex items-center justify-center shadow-md">
                    <KeyRound className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Name & title */}
                <div>
                  <h2 className="text-xl font-black text-foreground">
                    {t("loginAsChildTitle", { name: child.name })}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/8 text-primary border border-primary/15">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {getEnrollmentLabel(child.enrollment_type)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                  {t("loginAsChildDesc")}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/50" />

              {/* Login Form */}
              <Formik
                initialValues={{ phone: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4 focus:outline-none">
                    <CardContent className="p-0 space-y-4">
                      <PhoneFormField
                        name="phone"
                        label={t("childPhone")}
                        placeholder={tAuth("phonePlaceholder") || "010xxxxxxx"}
                      />
                      <FormField
                        name="password"
                        label={t("childPassword")}
                        type="password"
                        placeholder={tAuth("passwordPlaceholder") || "••••••••"}
                      />
                    </CardContent>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => !isPending && onClose()}
                        disabled={isPending}
                        className="w-full sm:flex-1 py-3 rounded-xl border border-border text-muted-foreground font-bold text-sm hover:bg-muted hover:text-foreground transition-all cursor-pointer focus:outline-none disabled:opacity-50"
                      >
                        {tCommon("cancel")}
                      </button>

                      <button
                        type="submit"
                        disabled={isPending || isSubmitting}
                        className={cn(
                          "w-full sm:flex-[2] py-3 rounded-xl bg-gradient-to-r from-primary to-[#005C5C] text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none",
                          "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0",
                          (isPending || isSubmitting) && "opacity-75 cursor-not-allowed hover:translate-y-0 hover:shadow-none"
                        )}
                      >
                        {isPending || isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{tCommon("loading")}</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            <span>{t("loginAsChild")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
