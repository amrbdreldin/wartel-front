"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { SubmitButton } from "@/components/ui/submit-button";
import { guestJoinSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { toast } from "sonner";

// ============================================================
// GuestJoinForm – Registration form for unauthenticated users
// ============================================================

interface GuestJoinFormProps {
  groupId: number;
}

export function GuestJoinForm({ groupId }: GuestJoinFormProps) {
  const t = useTranslations();
  const { mutate: joinGroup, isPending } = useJoinGroupMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (
    values: { name: string; phone: string; password: string },
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    setFormError(null);
    setFormSuccess(null);

    // Get firebase token
    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));

    joinGroup(
      {
        group_id: groupId,
        name: values.name,
        phone: values.phone,
        password: values.password,
        firebase_token: firebaseToken || undefined,
      },
      {
        onSuccess: (res) => {
          const successMsg = res?.message || t("directJoin.joinSuccess");
          setFormSuccess(successMsg);
          toast.success(successMsg);
          resetForm();
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
        onSettled: () => {
          setSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">
        {t("directJoin.registerToJoin")}
      </h2>

      <Formik
        initialValues={{ name: "", phone: "", password: "" }}
        validationSchema={guestJoinSchema}
        onSubmit={handleSubmit}
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

            {/* Form Alerts */}
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
              label={t("directJoin.joinCourse")}
              loadingLabel={t("directJoin.joiningInProgress")}
              isSubmitting={isPending || isSubmitting}
              icon={<UserPlus className="h-4 w-4" />}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
