"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { SubmitButton } from "@/components/ui/submit-button";
import { guestJoinSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { UserPlus, AlertCircle, CheckCircle2, User, Users, Info } from "lucide-react";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { useParentRegisterMutation } from "@/hooks/api/useAuthMutations";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { loadRecaptchaScript, executeRecaptcha } from "@/utils/recaptcha";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { JoinGroupRequest } from "@/services/group.service";
import { DirectJoinLoginModal } from "./DirectJoinLoginModal";

// ============================================================
// GuestJoinForm – Registration form for unauthenticated users
// ============================================================

type TabKey = "parent" | "student";

interface GuestJoinFormProps {
  groupId: number;
  allowedRoles?: Array<{ id: number; name: string }>;
}

export function GuestJoinForm({ groupId, allowedRoles }: GuestJoinFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { login: handleLoginState } = useAuth();
  const { mutate: joinGroup, isPending: isJoiningGroup } = useJoinGroupMutation();
  const { mutate: registerParent, isPending: isRegisteringParent } = useParentRegisterMutation();

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    if (siteKey) {
      loadRecaptchaScript(siteKey);
    }
  }, []);

  // Check allowed roles
  const hasParentRole = allowedRoles
    ? allowedRoles.some(
        (r) =>
          Number(r.id) === 5 ||
          r.name?.includes("ولي") ||
          r.name?.toLowerCase().includes("parent")
      )
    : false;

  const hasSonRole = allowedRoles
    ? allowedRoles.some(
        (r) =>
          Number(r.id) === 3 ||
          r.name?.includes("ابن") ||
          r.name?.includes("طفل") ||
          r.name?.toLowerCase().includes("son") ||
          r.name?.toLowerCase().includes("child")
      )
    : false;

  const hasParentOrSonRole = hasParentRole || hasSonRole;

  const hasStudentRole = allowedRoles
    ? allowedRoles.some(
        (r) =>
          Number(r.id) === 1 ||
          (r.name?.includes("طالب") && !r.name?.includes("ابن") && !r.name?.includes("طفل")) ||
          (r.name?.toLowerCase().includes("student") &&
            !r.name?.toLowerCase().includes("son") &&
            !r.name?.toLowerCase().includes("child"))
      )
    : !hasParentOrSonRole;

  const studentRoleObj = allowedRoles?.find(
    (r) =>
      Number(r.id) === 1 ||
      (r.name?.includes("طالب") && !r.name?.includes("ابن") && !r.name?.includes("طفل")) ||
      (r.name?.toLowerCase().includes("student") &&
        !r.name?.toLowerCase().includes("son") &&
        !r.name?.toLowerCase().includes("child"))
  );

  const showTabs = hasStudentRole && hasParentOrSonRole;

  // Default active tab: parent if available, otherwise student
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    return hasParentOrSonRole ? "parent" : "student";
  });

  const handlePostJoinSuccess = (res: any, resetForm: () => void) => {
    const token =
      res?.token ||
      res?.access_token ||
      res?.data?.token ||
      res?.data?.access_token;
    const userObj = res?.user || res?.data?.user;

    const successMsg = res?.message || t("directJoin.joinSuccess");
    toast.success(successMsg);

    if (token && userObj) {
      handleLoginState({
        user: userObj,
        accessToken: token,
        refreshToken: res?.refresh_token || res?.data?.refresh_token || "",
      });

      let redirectPath = `/${locale}/dashboard`;
      const roleIdStr = String(userObj.role_id);
      if (roleIdStr === "1" || roleIdStr === "3") {
        redirectPath = `/${locale}/student`;
      } else if (roleIdStr === "2") {
        redirectPath = `/${locale}/teacher`;
      } else if (roleIdStr === "5") {
        redirectPath = `/${locale}/parent`;
      }
      router.push(redirectPath);
    } else {
      setFormSuccess(successMsg);
      resetForm();
    }
  };

  const handleStudentSubmit = async (
    values: { name: string; phone: string; password: string },
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setFormError(null);
    setFormSuccess(null);

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));
    const studentRoleId = studentRoleObj ? Number(studentRoleObj.id) : 1;

    const payload: JoinGroupRequest = {
      group_id: groupId,
      role_id: studentRoleId,
      name: values.name,
      phone: values.phone,
      password: values.password,
      firebase_token: firebaseToken || undefined,
    };

    joinGroup(payload, {
      onSuccess: (res: any) => handlePostJoinSuccess(res, resetForm),
      onError: (err: any) => {
        const responseData = err.response?.data;
        const mainMessage = responseData?.message || err.message || t("directJoin.joinError");
        const validationErrors = responseData?.errors;
        if (validationErrors && typeof validationErrors === "object") {
          const firstErr = Object.values(validationErrors).flat()[0];
          setFormError(firstErr as string);
        } else {
          setFormError(mainMessage);
        }
      },
      onSettled: () => setSubmitting(false),
    });
  };

  const handleParentRegisterSubmit = async (
    values: { name: string; phone: string; password: string },
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setFormError(null);
    setFormSuccess(null);

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));
    const recaptchaToken = await executeRecaptcha("register_parent");

    registerParent(
      {
        full_name: values.name,
        mobile: values.phone,
        password: values.password,
        recaptcha_token: recaptchaToken || undefined,
        firebase_token: firebaseToken || undefined,
      },
      {
        onSuccess: (res: any) => {
          const successMsg =
            res?.message ||
            t("directJoin.registerParentSuccess");
          toast.success(successMsg);

          const token =
            res?.token ||
            res?.access_token ||
            res?.data?.token ||
            res?.data?.access_token;
          const userObj = res?.user || res?.data?.user;

          if (token && userObj) {
            handleLoginState({
              user: userObj,
              accessToken: token,
              refreshToken: res?.refresh_token || res?.data?.refresh_token || "",
            });
            // Stay on the direct join course page to show parent and children section
            router.refresh();
          } else {
            setFormSuccess(successMsg);
            resetForm();
          }
        },
        onError: (err: any) => {
          const responseData = err.response?.data;
          const mainMessage = responseData?.message || err.message || t("directJoin.joinError");
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
    <div className="space-y-5">
      {/* Header */}
      <h2 className="text-lg font-bold text-foreground">
        {activeTab === "parent" && !showTabs
          ? t("directJoin.registerParentToJoin")
          : t("directJoin.registerToJoin")}
      </h2>

      {/* Tabs selection if both Student and Parent roles are allowed */}
      {showTabs && (
        <div className="grid grid-cols-2 p-1.5 bg-muted/60 rounded-xl border border-border/50 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("student");
              setFormError(null);
              setFormSuccess(null);
            }}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200",
              activeTab === "student"
                ? "bg-background text-foreground shadow-sm border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="w-4 h-4" />
            <span>{t("directJoin.registerStudent")}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("parent");
              setFormError(null);
              setFormSuccess(null);
            }}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200",
              activeTab === "parent"
                ? "bg-background text-foreground shadow-sm border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="w-4 h-4" />
            <span>{t("directJoin.registerParent")}</span>
          </button>
        </div>
      )}

      {/* Common Alerts */}
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

      {/* Parent Registration Form */}
      {activeTab === "parent" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-primary text-xs leading-relaxed">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t("directJoin.registerParentDescription")}</span>
          </div>

          <Formik
            initialValues={{ name: "", phone: "", password: "" }}
            validationSchema={guestJoinSchema}
            onSubmit={handleParentRegisterSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <FormField
                  name="name"
                  label={t("directJoin.fullName")}
                  placeholder={t("directJoin.namePlaceholder")}
                />

                <PhoneFormField
                  name="phone"
                  label={t("directJoin.phone")}
                  placeholder={t("directJoin.phonePlaceholder")}
                />

                <FormField
                  name="password"
                  label={t("directJoin.password")}
                  type="password"
                  placeholder={t("directJoin.passwordPlaceholder")}
                />

                <SubmitButton
                  label={t("directJoin.registerParentBtn")}
                  loadingLabel={t("directJoin.joiningInProgress")}
                  isSubmitting={isRegisteringParent || isSubmitting}
                  icon={<UserPlus className="h-4 w-4" />}
                />
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Student Direct Join Form */}
      {activeTab === "student" && (
        <Formik
          initialValues={{ name: "", phone: "", password: "" }}
          validationSchema={guestJoinSchema}
          onSubmit={handleStudentSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 animate-in fade-in duration-200">
              <FormField
                name="name"
                label={t("directJoin.fullName")}
                placeholder={t("directJoin.namePlaceholder")}
              />

              <PhoneFormField
                name="phone"
                label={t("directJoin.phone")}
                placeholder={t("directJoin.phonePlaceholder")}
              />

              <FormField
                name="password"
                label={t("directJoin.password")}
                type="password"
                placeholder={t("directJoin.passwordPlaceholder")}
              />

              <SubmitButton
                label={t("directJoin.joinCourse")}
                loadingLabel={t("directJoin.joiningInProgress")}
                isSubmitting={isJoiningGroup || isSubmitting}
                icon={<UserPlus className="h-4 w-4" />}
              />
            </Form>
          )}
        </Formik>
      )}

      {/* Login link for existing users / teachers */}
      <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/40">
        <span>{t("directJoin.alreadyHaveAccount")} </span>
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(true)}
          className="font-bold text-primary hover:underline transition-colors cursor-pointer inline-block"
        >
          {t("directJoin.login")}
        </button>
      </div>

      {/* Login Modal */}
      <DirectJoinLoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
      />
    </div>
  );
}
