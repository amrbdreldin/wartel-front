"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { useParentChildren } from "@/hooks/api/useParentQueries";
import { useAuth } from "@/hooks/useAuth";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { toast } from "sonner";
import { Users, Loader2, CheckCircle2, AlertCircle, UserPlus, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/forms/FormField";
import { PhoneFormField } from "@/components/forms/PhoneFormField";
import { SubmitButton } from "@/components/ui/submit-button";
import { addSingleSonSchema } from "@/utils/validation";
import { Form, Formik } from "formik";
import { UserRole } from "@/types/enums";

// ============================================================
// ParentChildrenJoinSection – Unified Join list for parent & children
// ============================================================

interface ParentChildrenJoinSectionProps {
  groupId: number;
  allowedRoles?: Array<{ id: number; name: string }>;
}

export function ParentChildrenJoinSection({ groupId, allowedRoles }: ParentChildrenJoinSectionProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const { data: childrenData, isLoading: isLoadingChildren, refetch: refetchChildren } = useParentChildren({ enabled: !!user });
  const { mutate: joinGroup } = useJoinGroupMutation();

  const [showAddSonForm, setShowAddSonForm] = useState(false);
  const [addSonError, setAddSonError] = useState<string | null>(null);
  const [addSonSuccess, setAddSonSuccess] = useState<string | null>(null);

  // Track loading/success/error per item (id can be "parent" or child.id)
  const [states, setStates] = useState<
    Record<string | number, { loading: boolean; success: string | null; error: string | null }>
  >({});

  const isParentOrTeacher = user && (
    user.role === UserRole.PARENT ||
    user.role === UserRole.TEACHER ||
    String(user.role_id) === "5" ||
    String(user.role_id) === "2" ||
    allowedRoles?.some((r) => Number(r.id) === 5 || Number(r.id) === 3 || r.name.includes("ولي"))
  );

  const handleJoin = async (id: "parent" | number) => {
    setStates((prev) => ({
      ...prev,
      [id]: { loading: true, success: null, error: null },
    }));

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));

    const payload: { group_id: number; firebase_token?: string; child_id?: number } = {
      group_id: groupId,
      firebase_token: firebaseToken || undefined,
    };
    if (id !== "parent") {
      payload.child_id = id;
    }

    joinGroup(payload, {
      onSuccess: (res) => {
        const successMsg = res?.message || t("directJoin.joinSuccess");
        toast.success(successMsg);
        setStates((prev) => ({
          ...prev,
          [id]: { loading: false, success: successMsg, error: null },
        }));
      },
      onError: (err: any) => {
        const responseData = err.response?.data;
        const mainMessage = responseData?.message || err.message || t("directJoin.joinError");
        const validationErrors = responseData?.errors;
        let errorMsg = mainMessage;
        if (validationErrors && typeof validationErrors === "object") {
          const firstErr = Object.values(validationErrors).flat()[0];
          errorMsg = firstErr as string;
        }
        setStates((prev) => ({
          ...prev,
          [id]: { loading: false, success: null, error: errorMsg },
        }));
      },
    });
  };

  const handleAddSonSubmit = async (
    values: { name: string; phone: string; password: string },
    { setSubmitting, resetForm }: { setSubmitting: (b: boolean) => void; resetForm: () => void }
  ) => {
    setAddSonError(null);
    setAddSonSuccess(null);

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));

    joinGroup(
      {
        group_id: groupId,
        firebase_token: firebaseToken || undefined,
        sons: [
          {
            name: values.name,
            phone: values.phone,
            password: values.password,
          },
        ],
      },
      {
        onSuccess: (res) => {
          const successMsg = res?.message || t("directJoin.joinSuccess");
          toast.success(successMsg);
          setAddSonSuccess(successMsg);
          resetForm();
          setShowAddSonForm(false);
          refetchChildren();
        },
        onError: (err: any) => {
          const responseData = err.response?.data;
          const mainMessage = responseData?.message || err.message || t("directJoin.joinError");
          const validationErrors = responseData?.errors;
          if (validationErrors && typeof validationErrors === "object") {
            const firstErr = Object.values(validationErrors).flat()[0];
            setAddSonError(firstErr as string);
          } else {
            setAddSonError(mainMessage);
          }
        },
        onSettled: () => setSubmitting(false),
      }
    );
  };

  const children = childrenData?.children || [];

  // Combine parent and children into a unified list
  const listItems = [
    ...(user
      ? [
          {
            id: "parent" as const,
            name: user.full_name,
            role: "parent" as const,
          },
        ]
      : []),
    ...children.map((child) => ({
      id: child.id,
      name: child.name,
      role: "child" as const,
    })),
  ];

  return (
    <div className="space-y-4">
      {isLoadingChildren ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/60">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {listItems.map((item) => {
            const state = states[item.id] || { loading: false, success: null, error: null };

            return (
              <div key={item.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/30 transition-colors hover:bg-muted/50">
                  {/* User Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary shrink-0">
                      <span className="text-sm font-bold">
                        {item.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 items-start flex-1 w-full">
                      <span className="text-sm font-semibold text-foreground truncate w-full text-start">
                        {item.name}
                      </span>
                      {item.role === "parent" ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 mt-0.5">
                          {t("directJoin.parentLabel")}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-600/20 mt-0.5">
                          {t("directJoin.childLabel")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoin(item.id)}
                    disabled={state.loading || !!state.success}
                    className={
                      state.success
                        ? "h-9 px-4 rounded-lg text-xs font-semibold bg-success-500/10 text-success-600 border border-success-600/25 gap-1.5 w-full sm:w-auto shrink-0"
                        : "h-9 px-4 rounded-lg text-xs font-semibold gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-sm shadow-primary/15 gap-1.5 w-full sm:w-auto shrink-0"
                    }
                  >
                    {state.loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {t("directJoin.joiningInProgress")}
                      </>
                    ) : state.success ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t("directJoin.alreadyJoined")}
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        {t("directJoin.joinAs", { name: item.name })}
                      </>
                    )}
                  </Button>
                </div>

                {/* Per-item error */}
                {state.error && (
                  <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                    <span className="font-medium text-xs leading-normal text-start">{state.error}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Button to show Add New Son Form for Parent or Teacher */}
      {isParentOrTeacher && (
        <div className="pt-2 space-y-4">
          {!showAddSonForm ? (
            <button
              type="button"
              onClick={() => {
                setShowAddSonForm(true);
                setAddSonError(null);
                setAddSonSuccess(null);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-all text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>{t("directJoin.addNewChild")}</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-border/60 bg-card/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {t("directJoin.addNewChild")}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddSonForm(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addSonError && (
                <div className="w-full p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive flex items-start gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{addSonError}</span>
                </div>
              )}
              {addSonSuccess && (
                <div className="w-full p-3 rounded-lg bg-success-500/10 border border-success-600/25 text-success-600 flex items-start gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{addSonSuccess}</span>
                </div>
              )}

              <Formik
                initialValues={{ name: "", phone: "", password: "" }}
                validationSchema={addSingleSonSchema}
                onSubmit={handleAddSonSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <FormField
                      name="name"
                      label={t("directJoin.sonName")}
                      placeholder={t("directJoin.namePlaceholder")}
                    />

                    <PhoneFormField
                      name="phone"
                      label={t("directJoin.sonPhone")}
                      placeholder={t("directJoin.phonePlaceholder")}
                    />

                    <FormField
                      name="password"
                      label={t("directJoin.sonPassword")}
                      type="password"
                      placeholder={t("directJoin.passwordPlaceholder")}
                    />

                    <div className="flex gap-2 pt-1">
                      <SubmitButton
                        label={t("directJoin.addNewChild")}
                        loadingLabel={t("directJoin.joiningInProgress")}
                        isSubmitting={isSubmitting}
                        icon={<UserPlus className="h-4 w-4" />}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
