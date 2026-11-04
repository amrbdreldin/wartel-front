"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplyToGroupMutation, useAvailableGroups } from "@/hooks/api/useGroupQueries";
import { cn } from "@/lib/utils";
import type { AvailableGroup, GroupSessionDay } from "@/services/group.service";
import type { ApiError } from "@/types/api.types";
import type { AxiosError } from "axios";
import { AlertCircle, CalendarClock, CheckCircle2, Users } from "lucide-react";
import { useTranslations } from "next-intl";

// ============================================================
// Available Groups – shared by the student, teacher and parent dashboards
// ============================================================

function getApplyErrorMessages(error: unknown): string[] {
  const data = (error as AxiosError<ApiError>)?.response?.data;
  const validationErrors = data?.errors ? Object.values(data.errors).flat() : [];
  if (validationErrors.length > 0) return validationErrors;
  return data?.message ? [data.message] : [];
}

function SessionDays({ days }: { days?: GroupSessionDay[] }) {
  const t = useTranslations("availableGroups");

  if (!days?.length) {
    return <p className="text-sm text-muted-foreground">{t("noSchedule")}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {days.map((session) => (
        <li
          key={`${session.day}-${session.time}`}
          className="rounded-lg bg-muted px-2.5 py-1 text-sm font-medium text-foreground"
        >
          {session.day} <span className="text-muted-foreground">·</span>{" "}
          <span dir="auto">{session.time}</span>
        </li>
      ))}
    </ul>
  );
}

function AvailableGroupCard({ group }: { group: AvailableGroup }) {
  const t = useTranslations("availableGroups");
  const applyMutation = useApplyToGroupMutation();

  const applied = applyMutation.isSuccess && applyMutation.data?.success !== false;
  const rejected = applyMutation.isError || (applyMutation.isSuccess && !applied);
  const errorMessages = applyMutation.isError
    ? getApplyErrorMessages(applyMutation.error)
    : applyMutation.data?.message
      ? [applyMutation.data.message]
      : [];

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-base font-bold text-foreground">{group.display_name}</h2>

      <div className="flex-1 space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <CalendarClock className="h-4 w-4" />
          {t("schedule")}
        </p>
        <SessionDays days={group.session_days} />
      </div>

      {(applied || rejected) && (
        <div
          role={rejected ? "alert" : "status"}
          className={cn(
            "flex items-start gap-2 rounded-xl p-3 text-sm font-medium",
            applied ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
          )}
        >
          {applied ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {applied ? (
            <p>{applyMutation.data?.message || t("applySuccess")}</p>
          ) : (
            <div className="space-y-1">
              {(errorMessages.length > 0 ? errorMessages : [t("applyError")]).map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {!applied && (
        <LoadingButton
          className="w-full"
          isLoading={applyMutation.isPending}
          loadingText={t("submitting")}
          onClick={() => applyMutation.mutate(group.id)}
        >
          {t("submit")}
        </LoadingButton>
      )}
    </article>
  );
}

export function AvailableGroupsView() {
  const t = useTranslations("availableGroups");
  const tCommon = useTranslations("common");
  const { data: groups = [], isLoading, isError, refetch } = useAvailableGroups();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <header className="border-b border-border/50 pb-5">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-md space-y-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t("loadError")}</h2>
          <p className="text-sm text-muted-foreground">{t("loadErrorDesc")}</p>
          <Button onClick={() => refetch()}>{tCommon("retry")}</Button>
        </div>
      ) : groups.length === 0 ? (
        <div className="mx-auto max-w-md space-y-3 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t("emptyTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("emptyDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <AvailableGroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
