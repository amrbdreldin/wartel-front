"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { toast } from "sonner";
import { LogIn, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// ============================================================
// AuthJoinSection – Single join button for authenticated users
// ============================================================

interface AuthJoinSectionProps {
  groupId: number;
}

export function AuthJoinSection({ groupId }: AuthJoinSectionProps) {
  const t = useTranslations();
  const { mutate: joinGroup, isPending } = useJoinGroupMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleJoin = async () => {
    setError(null);
    setSuccess(null);

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));

    joinGroup(
      {
        group_id: groupId,
        firebase_token: firebaseToken || undefined,
      },
      {
        onSuccess: (res) => {
          const successMsg = res?.message || t("directJoin.joinSuccess");
          setSuccess(successMsg);
          toast.success(successMsg);
        },
        onError: (err: any) => {
          const responseData = err.response?.data;
          const mainMessage = responseData?.message || err.message || t("directJoin.joinError");
          const validationErrors = responseData?.errors;
          if (validationErrors && typeof validationErrors === "object") {
            const firstErr = Object.values(validationErrors).flat()[0];
            setError(firstErr as string);
          } else {
            setError(mainMessage);
          }
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      {error && (
        <div className="w-full p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span className="font-semibold text-xs leading-normal text-start">{error}</span>
        </div>
      )}
      {success && (
        <div className="w-full p-3.5 rounded-xl bg-success-500/10 border border-success-600/25 text-success-600 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
          <span className="font-semibold text-xs leading-normal text-start">{success}</span>
        </div>
      )}

      <Button
        onClick={handleJoin}
        disabled={isPending || !!success}
        className="w-full h-12 rounded-xl text-base font-semibold gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md shadow-primary/20 gap-2"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("directJoin.joiningInProgress")}
          </span>
        ) : success ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {t("directJoin.alreadyJoined")}
          </span>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            {t("directJoin.joinCourse")}
          </>
        )}
      </Button>
    </div>
  );
}
