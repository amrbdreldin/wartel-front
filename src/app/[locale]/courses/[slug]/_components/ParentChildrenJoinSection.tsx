"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { useParentChildren } from "@/hooks/api/useParentQueries";
import { useAuth } from "@/hooks/useAuth";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { toast } from "sonner";
import { Users, Loader2, CheckCircle2, AlertCircle, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================
// ParentChildrenJoinSection – Unified Join list for parent & children
// ============================================================

interface ParentChildrenJoinSectionProps {
  groupId: number;
}

export function ParentChildrenJoinSection({ groupId }: ParentChildrenJoinSectionProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const { data: childrenData, isLoading: isLoadingChildren } = useParentChildren({ enabled: true });
  const { mutate: joinGroup } = useJoinGroupMutation();

  // Track loading/success/error per item (id can be "parent" or child.id)
  const [states, setStates] = useState<
    Record<string | number, { loading: boolean; success: string | null; error: string | null }>
  >({});

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

    joinGroup(
      payload,
      {
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
      ) : listItems.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t("common.noData")}
        </p>
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
    </div>
  );
}
