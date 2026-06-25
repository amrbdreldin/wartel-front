"use client";

import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { registerSchema } from "@/utils/validation";
import { useRegisterMutation, useRegisterFormDataQuery } from "@/hooks/api/useAuthMutations";
import { Form, Formik, type FormikProps } from "formik";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, AlertCircle, Info, Users, X, ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setEnrollmentData } from "@/store/slices/enrollmentSlice";
import { loadRecaptchaScript, executeRecaptcha } from "@/utils/recaptcha";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { resolveRoleId } from "@/utils/role";


import { AudioUploadField } from "./AudioUploadField";
import { PathSelectionField } from "./PathSelectionField";
import { ScrollToFieldError } from "./ScrollToFieldError";
import { AdmissionPanel } from "./AdmissionPanel";

// ============================================================
// RegisterForm – full registration logic extracted from page
// ============================================================

const initialValues = {
  full_name: "",
  age: "",
  phone: "",
  password: "",
  password_confirmation: "",
  user_type: "student",
  enrollment_type_id: "",
  selected_track_id: "",
  selected_group_id: "",
  quran_audio: null as File | null,
  quran_audio_duration: undefined as number | undefined,
  recaptcha_token: "",
  accept_instructions: true,
};

export function RegisterForm() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";

  const searchParams = useSearchParams();
  const isStudent = searchParams.get("type") === "student" || searchParams.get("type") === "s" || searchParams.has("student");
  const studentRoleId = isStudent ? 1 : null;

  const { mutate: register, isPending } = useRegisterMutation();
  const { data: formData, isLoading: isFormDataLoading } = useRegisterFormDataQuery(studentRoleId);
  const dispatch = useDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const formikRef = useRef<FormikProps<any>>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"women" | "children">("women");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen, modalTab]);

  const [fcmToken, setFcmToken] = useState("");

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

  // Safely fetch translated arrays with fallbacks
  let womenItems: string[] = [];
  let childrenItems: string[] = [];

  try {
    womenItems = t.raw("instructions.women.items") || [];
  } catch (e) {
    console.error("Failed to load women items", e);
  }

  try {
    childrenItems = t.raw("instructions.children.items") || [];
  } catch (e) {
    console.error("Failed to load children items", e);
  }

  const userRoles = formData?.user_roles ?? [];
  const enrollmentTypes = formData?.enrollment_types ?? [];
  const allTracks = formData?.tracks ?? [];

  const handleSubmit = async (values: typeof initialValues) => {
    setFormError(null);
    setFormSuccess(null);
    const token = await executeRecaptcha("register");
    const fd = new FormData();
    fd.append("full_name", values.full_name);
    fd.append("phone", values.phone);
    
    if (values.enrollment_type_id) fd.append("enrollment_type_id", values.enrollment_type_id);
    
    if (values.selected_track_id) fd.append("track_id", values.selected_track_id);
    if (values.selected_group_id) fd.append("group_id", values.selected_group_id);
    if (values.quran_audio) fd.append("audio_test_path", values.quran_audio);
    
    const roleId = studentRoleId ? String(studentRoleId) : resolveRoleId(values.user_type, userRoles);
    fd.append("user_role_id", roleId);
    fd.append("role_id", roleId);

    fd.append("age", values.age);
    fd.append("password", values.password);
    fd.append("recaptcha_token", token);
    if (fcmToken) fd.append("firebase_token", fcmToken);

    register(fd, {
      onSuccess: (res) => {
        if (res?.data) dispatch(setEnrollmentData(res.data));
        const successMsg = (res as any)?.message || t("auth.applicationSubmitted");
        setFormSuccess(successMsg);
        toast.success(successMsg);
        setIsSuccess(true);
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
      <div className="bg-card rounded-3xl shadow-2xl p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-success-500/10 text-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4">{t("auth.applicationSuccessTitle")}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
          {t("auth.applicationSuccessDesc")}
        </p>
        <Link href={`/${locale}`} className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:-translate-y-1">
          <ArrowRight className="w-5 h-5 rtl:-rotate-90" />
          {t("common.backToHome")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-border/40 transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
      {/* Left: Admission Criteria */}
      <AdmissionPanel type="women" />

      {/* Right: Registration Form */}
      <div className="lg:w-3/5 p-6 md:p-10 backdrop-blur-sm bg-card/85">
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 lg:hidden">
            <Logo size="lg" />
          </div>
          
          {/* UX Role Verification Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black border border-primary/20 mb-4 shadow-sm select-none animate-pulse-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("auth.studentRegistrationRole")}
          </div>

          <h4 className="text-2xl font-bold text-foreground mb-1">{t("auth.createNewAccount")}</h4>
          <p className="text-sm text-muted-foreground">{t("auth.registerSubtitle")}</p>
        </div>

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validate={(values) => {
            const errors: any = {};
            try {
              registerSchema.validateSync(values, {
                abortEarly: false,
                context: { enrollmentTypes }
              });
            } catch (err: any) {
              err.inner.forEach((currentError: any) => {
                errors[currentError.path] = currentError.message;
              });
            }

            // if (!values.accept_instructions) {
            //   errors.accept_instructions = t("instructions.validationError");
            // }

            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="space-y-6">
              <ScrollToFieldError />

              {/* Role is implicitly student (women) */}

              {/* ── Path Selection ── */}
              <PathSelectionField 
                enrollmentTypes={enrollmentTypes} 
                allTracks={allTracks} 
                isLoading={isFormDataLoading} 
              />

              {/* ── Personal Details ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField name="full_name" label={t("auth.fullName")} required />
                <FormField name="age" type="number" label={t("auth.age")} dir={isRTL ? "rtl" : "ltr"} required />
              </div>

              {/* ── Contact ── */}
              <PhoneFormField name="phone" label={t("auth.whatsapp")} placeholder={t("auth.whatsappPlaceholder") || "0101234567"} required />

              {/* ── Password ── */}
              <FormField name="password" label={t("common.password")} type="password" placeholder="••••••••" required />
              <FormField name="password_confirmation" label={t("auth.passwordConfirmation")} type="password" placeholder="••••••••" required />

              {/* ── Audio Upload ── */}
              <AudioUploadField />



              {/* ── Instructions Consent Checkbox ── */}
              {/* <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <div className="relative shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      id="accept_instructions"
                      name="accept_instructions"
                      checked={values.accept_instructions}
                      onChange={(e) => setFieldValue("accept_instructions", e.target.checked)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
                      values.accept_instructions
                        ? "border-primary bg-primary text-white"
                        : "border-muted-foreground group-hover:border-foreground",
                      errors.accept_instructions && touched.accept_instructions && "border-destructive bg-destructive/5"
                    )}>
                      {values.accept_instructions && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                    {t("instructions.agreeTextPart1")}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setModalTab("women");
                        setIsModalOpen(true);
                      }}
                      className="underline text-primary font-black hover:text-primary/80 transition-colors focus:outline-none inline-block p-0 align-baseline cursor-pointer bg-transparent border-none"
                    >
                      {t("instructions.agreeTextLink")}
                    </button>
                    <span className="text-destructive font-bold"> *</span>
                  </span>
                </label>
                {errors.accept_instructions && touched.accept_instructions && (
                  <FieldError error={errors.accept_instructions as string} />
                )}
              </div> */}



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

              {/* ── Submit ── */}
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
                    {values.user_type === "student"
                      ? t("auth.submitRegistration")
                      : values.user_type === "teacher"
                      ? t("auth.createTeacherAccount")
                      : t("auth.createParentAccount")}
                    {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </>
                )}
              </button>

              {/* ── Login Link ── */}
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

    {/* Instructions Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6 overflow-hidden animate-in fade-in duration-300">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        />
        <div className="relative w-full max-w-4xl bg-card rounded-2xl sm:rounded-[2rem] shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh]">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary shrink-0" />

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-3 end-3 sm:top-4 sm:end-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            aria-label={t("common.close")}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="px-4 pt-6 pb-3 sm:px-6 sm:pt-8 sm:pb-4 shrink-0 border-b border-border/40">
            <h3 className="text-lg sm:text-2xl font-black text-foreground text-center">
              {t("instructions.title")}
            </h3>
          </div>

          {/* Scrollable body */}
          <div ref={scrollContainerRef} className="p-4 sm:p-8 overflow-y-auto space-y-4 sm:space-y-6 flex-1 min-h-[250px] sm:min-h-[300px]">
            {/* ── Tabs Navigation ── */}
            <div className="flex p-1 bg-muted/60 dark:bg-muted/30 rounded-xl sm:rounded-2xl max-w-md mx-auto mb-6 border border-border/40 shrink-0">
              <button
                type="button"
                onClick={() => setModalTab("women")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer focus:outline-none",
                  modalTab === "women"
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                {t("instructions.womenTab")}
              </button>
              <button
                type="button"
                onClick={() => setModalTab("children")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer focus:outline-none",
                  modalTab === "children"
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                {t("instructions.childrenTab")}
              </button>
            </div>

            {/* Tab Content */}
            {modalTab === "women" ? (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-xl font-black text-foreground">
                      {t("instructions.women.title")}
                    </h4>
                    <p className="text-[11px] sm:text-sm text-muted-foreground leading-normal">
                      {t("instructions.women.subtitle")}
                    </p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {womenItems.map((text, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3.5 sm:gap-4 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/20 dark:bg-muted/10 border border-border/30 hover:border-primary/20 hover:bg-muted/40 dark:hover:bg-muted/20 transition-all duration-300"
                    >
                      <div className="mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/25 text-primary text-[10px] sm:text-xs font-black">
                        {i + 1}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 flex gap-3 sm:gap-4 items-start">
                  <Info className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-amber-900 dark:text-amber-400 mb-1.5 sm:mb-2 text-sm sm:text-lg">
                      {t("instructions.children.title")}
                    </h4>
                    <p className="text-[11px] sm:text-sm leading-relaxed text-amber-800/90 dark:text-amber-500/90 font-medium whitespace-pre-line">
                      {t("instructions.children.subtitle")}
                    </p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {childrenItems.map((text, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3.5 sm:gap-4 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/20 dark:bg-muted/10 border border-border/30 hover:border-amber-500/20 hover:bg-muted/40 dark:hover:bg-muted/20 transition-all duration-300"
                    >
                      <div className="mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/25 text-amber-600 dark:text-amber-500 text-[10px] sm:text-xs font-black">
                        {i + 1}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                {t("instructions.children.closing") && (
                  <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-primary/5 border border-primary/10 text-center italic text-xs sm:text-sm text-primary font-bold">
                    {t("instructions.children.closing")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-4 py-4 sm:px-6 sm:py-6 border-t border-border/40 shrink-0 bg-muted/20 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border border-border/80 text-muted-foreground font-bold hover:bg-muted transition-colors cursor-pointer text-xs sm:text-sm order-2 sm:order-1"
            >
              {t("instructions.cancelBtn")}
            </button>
            <button
              type="button"
              onClick={() => {
                formikRef.current?.setFieldValue("accept_instructions", true);
                setIsModalOpen(false);
              }}
              className="w-full sm:w-auto px-7 py-2.5 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 text-white font-black hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm order-1 sm:order-2"
            >
              {t("instructions.confirmBtn")}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
