"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useJoinGroupMutation } from "@/hooks/api/useGroupQueries";
import { requestNotificationToken } from "@/utils/firebaseMessaging";
import { toast } from "sonner";
import { LogIn, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TelegramBotActivationCard } from "@/components/common/TelegramBotActivationCard";
import { GroupVoiceRecorder, isVoiceValid } from "@/components/groups/GroupVoiceRecorder";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { extractDirectJoinError, type DirectJoinApiError } from "./direct-join-utils";

// ============================================================
// AuthJoinSection – Single join/apply button for authenticated users
// ============================================================

interface AuthJoinSectionProps {
  groupId: number;
  isDirectJoin?: boolean;
  requiresAudio?: boolean;
}

export function AuthJoinSection({
  groupId,
  isDirectJoin = true,
  requiresAudio = false,
}: AuthJoinSectionProps) {
  const t = useTranslations();
  const { mutate: joinGroup, isPending } = useJoinGroupMutation();
  const recorder = useVoiceRecorder();
  const voiceReady = !requiresAudio || isVoiceValid(recorder);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [telegramTrackingUrl, setTelegramTrackingUrl] = useState<string | null>(null);

  const handleJoin = async () => {
    setError(null);
    setSuccess(null);
    setTelegramTrackingUrl(null);

    const firebaseToken = await requestNotificationToken(t("notifications.blocked_guide"));

    joinGroup(
      {
        group_id: groupId,
        firebase_token: firebaseToken || undefined,
        audio: requiresAudio ? recorder.recording?.file : null,
      },
      {
        onSuccess: (res) => {
          const successMsg =
            res?.message ||
            (isDirectJoin ? t("directJoin.joinSuccess") : t("directJoin.applicationSubmitted"));
          const trackingUrl = res?.data?.telegram_tracking_url || (res as { telegram_tracking_url?: string })?.telegram_tracking_url || null;
          setTelegramTrackingUrl(trackingUrl);
          setSuccess(successMsg);
          toast.success(successMsg);
        },
        onError: (err: DirectJoinApiError) => {
          setError(extractDirectJoinError(err, t("directJoin.joinError")));
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {requiresAudio && !success && (
        <GroupVoiceRecorder recorder={recorder} disabled={isPending} />
      )}

      {/* Alerts */}
      {error && (
        <div className="w-full p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span className="font-semibold text-xs leading-normal text-start">{error}</span>
        </div>
      )}
      {success && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-full p-3.5 rounded-xl bg-success-500/10 border border-success-600/25 text-success-600 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
            <span className="font-semibold text-xs leading-normal text-start">{success}</span>
          </div>
          <TelegramBotActivationCard
            telegramTrackingUrl={telegramTrackingUrl}
            description={t("directJoin.telegramRequiredDesc")}
            warning={t("directJoin.telegramWarning")}
          />
        </div>
      )}

      <Button
        onClick={handleJoin}
        disabled={isPending || !!success || !voiceReady}
        className="w-full h-12 rounded-xl text-base font-semibold gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md shadow-primary/20 gap-2"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {isDirectJoin ? t("directJoin.joiningInProgress") : t("directJoin.submittingApplication")}
          </span>
        ) : success ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {isDirectJoin ? t("directJoin.alreadyJoined") : t("directJoin.applicationSubmitted")}
          </span>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            {isDirectJoin ? t("directJoin.joinCourse") : t("directJoin.submitApplication")}
          </>
        )}
      </Button>
    </div>
  );
}
