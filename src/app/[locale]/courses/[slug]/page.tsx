"use client";

import { use, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useDirectJoinGroup } from "@/hooks/api/useGroupQueries";
import { Card, CardContent } from "@/components/ui/card";
import { GradientBar } from "@/components/ui/gradient-bar";
import { Logo } from "@/components/common/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupInfoCard } from "./_components/GroupInfoCard";
import { GuestJoinForm } from "./_components/GuestJoinForm";
import { AuthJoinSection } from "./_components/AuthJoinSection";
import { ParentChildrenJoinSection } from "./_components/ParentChildrenJoinSection";
import { UserRole } from "@/types/enums";

// ============================================================
// Direct Join Course Page – /[locale]/courses/[slug]
// ============================================================

/** Map UserRole enum to the corresponding allowed_roles id from the API */
const ROLE_ID_MAP: Record<string, number[]> = {
  [UserRole.STUDENT]: [1],
  [UserRole.TEACHER]: [2],
  [UserRole.PARENT]: [5],
};

export default function DirectJoinCoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations();
  const { isAuthenticated, user } = useAuth();
  const { data: group, isLoading, isError, error, refetch } = useDirectJoinGroup(
    decodeURIComponent(slug)
  );

  // Check if the current user's own role is in allowed_roles (student/teacher direct join)
  const canSelfJoin = useMemo(() => {
    if (!user?.role || !group?.allowed_roles) return false;
    const matchIds = ROLE_ID_MAP[user.role] || [];
    return group.allowed_roles.some((r) => matchIds.includes(Number(r.id)));
  }, [user?.role, group?.allowed_roles]);

  // Check if parent/child roles exist in allowed_roles
  const hasParentOrChildRoles = useMemo(() => {
    if (!group?.allowed_roles) return false;
    return group.allowed_roles.some(
      (r) =>
        Number(r.id) === 5 ||
        Number(r.id) === 3 ||
        r.name?.includes("ولي") ||
        r.name?.includes("ابن") ||
        r.name?.includes("طفل") ||
        r.name?.toLowerCase().includes("parent") ||
        r.name?.toLowerCase().includes("son") ||
        r.name?.toLowerCase().includes("child")
    );
  }, [group?.allowed_roles]);

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
      <div className="w-full max-w-lg">
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
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                  </div>
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
                    {(error as any)?.response?.data?.message || t("common.errorOccurred")}
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

            {/* Success State – Group loaded */}
            {group && !isLoading && (
              <>
                <GroupInfoCard group={group} />

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground font-medium">
                      {t("directJoin.joinNow")}
                    </span>
                  </div>
                </div>

                {/* Action Section based on auth state */}
                {!isAuthenticated ? (
                  <GuestJoinForm groupId={group.group_id} allowedRoles={group.allowed_roles} />
                ) : (
                  <div className="space-y-6">
                    {/* Direct join button for student/teacher */}
                    {canSelfJoin && (
                      <AuthJoinSection groupId={group.group_id} />
                    )}

                    {/* Parent/child join section */}
                    {hasParentOrChildRoles && (
                      <ParentChildrenJoinSection groupId={group.group_id} allowedRoles={group.allowed_roles} />
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

