"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { SubmitButton } from "@/components/ui/submit-button";
import { guestJoinSchema, parentWithSonsJoinSchema } from "@/utils/validation";
import { Form, Formik, FieldArray } from "formik";
import { UserPlus, AlertCircle, CheckCircle2, Plus, Trash2, User, Users } from "lucide-react";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { JoinGroupRequest } from "@/services/group.service";

// ============================================================
// GuestJoinForm – Registration form for unauthenticated users
// ============================================================

interface GuestJoinFormProps {
  groupId: number;
  allowedRoles?: Array<{ id: number; name: string }>;
}

export function GuestJoinForm({ groupId, allowedRoles }: GuestJoinFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { login: handleLoginState } = useAuth();
  const { mutate: joinGroup, isPending } = useJoinGroupMutation();

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Check allowed roles
  const hasStudentRole = allowedRoles
    ? allowedRoles.some((r) => Number(r.id) === 1 || r.name.includes("طالب") || r.name.toLowerCase().includes("student"))
    : true;

  const parentRoleObj = allowedRoles?.find(
    (r) => Number(r.id) === 5 || Number(r.id) === 3 || r.name.includes("ولي") || r.name.toLowerCase().includes("parent")
  );
  const hasParentRole = !!parentRoleObj || (allowedRoles ? allowedRoles.some((r) => Number(r.id) === 5 || Number(r.id) === 3) : false);

  const showTabs = hasStudentRole && hasParentRole;

  // Active tab: default to "student" if allowed, else "children"
  const [activeTab, setActiveTab] = useState<"student" | "children">(
    hasStudentRole ? "student" : "children"
  );

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

    const payload: JoinGroupRequest = {
      group_id: groupId,
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

  const handleChildrenSubmit = async (
    values: {
      name: string;
      phone: string;
      password: string;
      sons: Array<{ name: string; phone: string; password: string }>;
    },
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setFormError(null);
    setFormSuccess(null);

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));

    const parentRoleId = parentRoleObj ? parentRoleObj.id : 3;

    const payload: JoinGroupRequest = {
      group_id: groupId,
      role_id: parentRoleId,
      name: values.name,
      phone: values.phone,
      password: values.password,
      firebase_token: firebaseToken || undefined,
      sons: values.sons.map((son) => ({
        name: son.name,
        phone: son.phone,
        password: son.password,
      })),
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <h2 className="text-lg font-bold text-foreground">
        {t("directJoin.registerToJoin")}
      </h2>

      {/* Tabs selection if both roles are allowed */}
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
              setActiveTab("children");
              setFormError(null);
              setFormSuccess(null);
            }}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200",
              activeTab === "children"
                ? "bg-background text-foreground shadow-sm border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="w-4 h-4" />
            <span>{t("directJoin.registerChildren")}</span>
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

      {/* Student Form */}
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
                isSubmitting={isPending || isSubmitting}
                icon={<UserPlus className="h-4 w-4" />}
              />
            </Form>
          )}
        </Formik>
      )}

      {/* Children Form (Parent + Sons) */}
      {activeTab === "children" && (
        <Formik
          initialValues={{
            name: "",
            phone: "",
            password: "",
            sons: [{ name: "", phone: "", password: "" }],
          }}
          validationSchema={parentWithSonsJoinSchema}
          onSubmit={handleChildrenSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-6 animate-in fade-in duration-200">
              {/* Parent Information Section */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{t("directJoin.parentInfo")}</span>
                </h3>

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
              </div>

              {/* Children (Sons) Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span>{t("directJoin.childrenInfo")}</span>
                </h3>

                <FieldArray name="sons">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.sons.map((_, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-4 relative transition-all duration-200 hover:border-primary/30"
                        >
                          <div className="flex items-center justify-between border-b border-border/30 pb-2">
                            <span className="text-xs font-bold text-muted-foreground">
                              {t("directJoin.childNumber", { number: index + 1 })}
                            </span>
                            {values.sons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-destructive/80 hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10"
                                title={t("directJoin.deleteChild")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <FormField
                            name={`sons.${index}.name`}
                            label={t("directJoin.sonName")}
                            placeholder={t("directJoin.namePlaceholder")}
                          />

                          <PhoneFormField
                            name={`sons.${index}.phone`}
                            label={t("directJoin.sonPhone")}
                            placeholder={t("directJoin.phonePlaceholder")}
                          />

                          <FormField
                            name={`sons.${index}.password`}
                            label={t("directJoin.sonPassword")}
                            type="password"
                            placeholder={t("directJoin.passwordPlaceholder")}
                          />
                        </div>
                      ))}

                      {/* Add another child button */}
                      <button
                        type="button"
                        onClick={() => push({ name: "", phone: "", password: "" })}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-all text-xs font-bold"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t("directJoin.addAnotherChild")}</span>
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <SubmitButton
                label={t("directJoin.joinCourse")}
                loadingLabel={t("directJoin.joiningInProgress")}
                isSubmitting={isPending || isSubmitting}
                icon={<UserPlus className="h-4 w-4" />}
              />
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
