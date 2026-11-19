"use client";

import { use, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useDirectJoinGroup } from "@/hooks/api/useGroupQueries";
import { Card, CardContent } from "@/components/ui/card";
import { GradientBar } from "@/components/ui/gradient-bar";
import { Logo } from "@/components/common/Logo";
import { TelegramBotActivationCard } from "@/components/common/TelegramBotActivationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, CheckCircle2, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupInfoCard } from "./_components/GroupInfoCard";
import { GuestJoinForm, type GuestJoinSuccessResult } from "./_components/GuestJoinForm";
import { AuthJoinSection } from "./_components/AuthJoinSection";
import { ParentChildrenJoinSection } from "./_components/ParentChildrenJoinSection";
import {
  extractDirectJoinError,
  resolveGroupRoles,
  ROLE_ID_MAP,
  type DirectJoinApiError,
} from "./_components/direct-join-utils";

// ============================================================
// Direct Join Course Page – /[locale]/courses/[slug]
// ============================================================

export default function DirectJoinCoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ContinueArrow = isRTL ? ArrowLeft : ArrowRight;
  const { isAuthenticated, user } = useAuth();
  const [guestJoinSuccess, setGuestJoinSuccess] = useState<GuestJoinSuccessResult | null>(null);

  const decodedSlug = useMemo(() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  }, [slug]);

  const { data: groups, isLoading, isError, error, refetch } = useDirectJoinGroup(decodedSlug);

  const [userSelectedGroupId, setUserSelectedGroupId] = useState<number | null>(null);

  const selectedGroup = useMemo(() => {
    if (!groups || groups.length === 0) return null;
    if (userSelectedGroupId !== null) {
      const found = groups.find((g) => g.group_id === userSelectedGroupId);
      if (found) return found;
    }
    return groups[0];
  }, [groups, userSelectedGroupId]);

  // Check if the current user's own role is in allowed_roles (student/teacher direct join)
  const canSelfJoin = useMemo(() => {
    if (!user?.role || !selectedGroup?.allowed_roles) return false;
    const matchIds = ROLE_ID_MAP[user.role] || [];
    return selectedGroup.allowed_roles.some((r) => matchIds.includes(Number(r.id)));
  }, [user, selectedGroup]);

  // Check if parent/child roles exist in allowed_roles
  const hasParentOrChildRoles = useMemo(
    () => resolveGroupRoles(selectedGroup?.allowed_roles).hasParentOrSonRole,
    [selectedGroup]
  );

  const isDirectJoin = selectedGroup
    ? selectedGroup.direct_join !== "no" &&
      selectedGroup.direct_join !== 0 &&
      selectedGroup.direct_join !== false
    : true;

  const requiresAudio =
    !isDirectJoin && Number(selectedGroup?.requires_audio ?? 1) === 1;

  const errorMessage = extractDirectJoinError(
    error as DirectJoinApiError | null,
    t("common.errorOccurred")
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[40%] -start-[30%] w-[80%] h-[80%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[130px] animate-pulse-slow" />
        <div className="absolute -bottom-[40%] -end-[30%] w-[80%] h-[80%] rounded-full bg-accent/10 dark:bg-accent/15 blur-[130px] animate-pulse-slow delay-2000" />
        <div className="absolute top-[20%] start-[60%] w-[40%] h-[40%] rounded-full bg-wartel-primary-light/5 dark:bg-wartel-primary-light/10 blur-[95px] animate-pulse-slow delay-1000" />
      </div>
      <div
        className="absolute top-0 end-0 bottom-0 start-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/pattern.png')", backgroundRepeat: "repeat", backgroundSize: "120px" }}
      />

      {/* Logo */}
      <div className="mb-6">
        <Logo size="lg" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-xl lg:max-w-2xl">
        <Card className="shadow-2xl border border-border/50 bg-card/85 backdrop-blur-md overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
          <GradientBar variant="primary" />

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <Skeleton className="h-7 w-48" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 text-destructive">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">
                    {t("directJoin.groupNotFound")}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {errorMessage}
                  </p>
                </div>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="gap-2 mt-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("common.retry")}
                </Button>
              </div>
            )}

            {/* Empty State (no groups returned) */}
            {!isLoading && !isError && groups && groups.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted text-muted-foreground">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">
                    {t("directJoin.noGroupsAvailable")}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {t("directJoin.noGroupsAvailableDesc")}
                  </p>
                </div>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="gap-2 mt-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("common.retry")}
                </Button>
              </div>
            )}

            {/* Guest Direct Join Success + Telegram Bot Activation */}
            {guestJoinSuccess && !isLoading && (
              <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-500 py-2">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-14 h-14 bg-success-500/10 text-success-600 dark:text-success-400 rounded-full flex items-center justify-center ring-4 ring-success-500/5">
                    <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-1 -end-1 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {guestJoinSuccess.message || t("directJoin.joinSuccess")}
                </h2>

                <TelegramBotActivationCard
                  telegramTrackingUrl={guestJoinSuccess.telegramTrackingUrl}
                  description={t("directJoin.telegramRequiredDesc")}
                  warning={t("directJoin.telegramWarning")}
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
                  {guestJoinSuccess.redirectPath ? (
                    <Link
                      href={guestJoinSuccess.redirectPath}
                      className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 gradient-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-90 transition-all"
                    >
                      <span>{t("directJoin.goToDashboard")}</span>
                      <ContinueArrow className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  ) : null}
                  <Link
                    href={`/${locale}`}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-bold text-sm transition-colors"
                  >
                    <span>{t("common.backToHome")}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Success State – Group(s) loaded */}
            {selectedGroup && !isLoading && !guestJoinSuccess && (
              <>
                <GroupInfoCard
                  groups={groups || []}
                  selectedGroupId={selectedGroup.group_id}
                  onSelectGroup={setUserSelectedGroupId}
                />

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground font-medium text-center">
                      {groups && groups.length > 1
                        ? t("directJoin.joinSelectedGroup", { name: selectedGroup.group_name })
                        : t("directJoin.joinNow")}
                    </span>
                  </div>
                </div>

                {/* Application Notice when direct_join = no */}
                {!isDirectJoin && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300 text-start">
                    {t("directJoin.applicationNotice")}
                  </div>
                )}

                {/* Action Section based on auth state */}
                {!isAuthenticated ? (
                  <GuestJoinForm
                    key={selectedGroup.group_id}
                    groupId={selectedGroup.group_id}
                    allowedRoles={selectedGroup.allowed_roles}
                    isDirectJoin={isDirectJoin}
                    requiresAudio={requiresAudio}
                    onStudentJoinSuccess={setGuestJoinSuccess}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Direct join / apply button for student/teacher */}
                    {canSelfJoin && (
                      <AuthJoinSection
                        key={`self-${selectedGroup.group_id}`}
                        groupId={selectedGroup.group_id}
                        isDirectJoin={isDirectJoin}
                        requiresAudio={requiresAudio}
                      />
                    )}

                    {/* Parent/child join section */}
                    {hasParentOrChildRoles && (
                      <ParentChildrenJoinSection
                        key={`parent-${selectedGroup.group_id}`}
                        groupId={selectedGroup.group_id}
                        allowedRoles={selectedGroup.allowed_roles}
                        isDirectJoin={isDirectJoin}
                        requiresAudio={requiresAudio}
                      />
                    )}

                    {/* If authenticated user has no eligible role for this group */}
                    {!canSelfJoin && !hasParentOrChildRoles && (
                      <div className="p-4 rounded-xl bg-muted/60 border border-border/60 text-center space-y-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {t("directJoin.cannotJoinRole")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-xs text-muted-foreground text-center">
          {t("auth.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
}
