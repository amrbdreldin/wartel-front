"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { useParentChildren } from "@/hooks/api/useParentQueries";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { toast } from "sonner";
import { Users, Loader2, CheckCircle2, AlertCircle, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================
// ParentChildrenJoinSection – Join buttons for each child
// ============================================================

interface ParentChildrenJoinSectionProps {
  groupId: number;
}

export function ParentChildrenJoinSection({ groupId }: ParentChildrenJoinSectionProps) {
  const t = useTranslations();
  const { data: childrenData, isLoading: isLoadingChildren } = useParentChildren({ enabled: true });
  const { mutate: joinGroup } = useJoinGroupMutation();

  // Track loading/success/error per child
  const [childStates, setChildStates] = useState<
    Record<number, { loading: boolean; success: string | null; error: string | null }>
  >({});

  const handleJoinChild = async (childId: number) => {
    setChildStates((prev) => ({
      ...prev,
      [childId]: { loading: true, success: null, error: null },
    }));

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));

    joinGroup(
      {
        group_id: groupId,
        child_id: childId,
        firebase_token: firebaseToken || undefined,
      },
      {
        onSuccess: (res) => {
          const successMsg = res?.message || t("directJoin.joinSuccess");
          toast.success(successMsg);
          setChildStates((prev) => ({
            ...prev,
            [childId]: { loading: false, success: successMsg, error: null },
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
          setChildStates((prev) => ({
            ...prev,
            [childId]: { loading: false, success: null, error: errorMsg },
          }));
        },
      }
    );
  };

  const children = childrenData?.children || [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        {t("directJoin.yourChildren")}
      </h2>

      {isLoadingChildren ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/60">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : children.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t("common.noData")}
        </p>
      ) : (
        <div className="space-y-3">
          {children.map((child) => {
            const state = childStates[child.id] || { loading: false, success: null, error: null };

            return (
              <div key={child.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border/60 bg-muted/30 transition-colors hover:bg-muted/50">
                  {/* Child Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary shrink-0">
                      <span className="text-sm font-bold">
                        {child.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground truncate">
                      {child.name}
                    </span>
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoinChild(child.id)}
                    disabled={state.loading || !!state.success}
                    className={
                      state.success
                        ? "h-9 px-4 rounded-lg text-xs font-semibold bg-success-500/10 text-success-600 border border-success-600/25 gap-1.5"
                        : "h-9 px-4 rounded-lg text-xs font-semibold gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-sm shadow-primary/15 gap-1.5"
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
                        {t("directJoin.joinAsChild")}
                      </>
                    )}
                  </Button>
                </div>

                {/* Per-child error */}
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
