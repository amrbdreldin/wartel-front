import React from "react";
import {
  History,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { GroupPreviousSession } from "@/types/teacher.types";
import { DataTable, Column } from "@/components/ui/DataTable";

interface GroupPreviousSessionsTableProps {
  sessions: GroupPreviousSession[];
  groupId: string;
  groupName: string;
  locale: string;
  t: (key: string, values?: any) => string;
  isLoading?: boolean;
}

export function GroupPreviousSessionsTable({
  sessions,
  groupId,
  groupName,
  locale,
  t,
  isLoading = false,
}: GroupPreviousSessionsTableProps) {
  const router = useRouter();

  const navigateToDetails = (sessionId: number) => {
    router.push(`/${locale}/teacher/groups/${groupId}/sessions/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm animate-pulse">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-muted" />
          <div className="h-6 w-44 bg-muted rounded" />
        </div>
        <div className="divide-y divide-border/50">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded-lg" />
              <div className="h-6 w-20 bg-muted rounded-lg" />
              <div className="h-8 w-24 bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const columns: Column<GroupPreviousSession>[] = [
    {
      key: "scheduled_at",
      header: t("sessionDateCol"),
      sortable: true,
      render: (session) => {
        const dateObj = session.scheduled_at ? new Date(session.scheduled_at) : null;
        const formattedDate = dateObj
          ? dateObj.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "-";
        const formattedTime = dateObj
          ? dateObj.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-foreground">
                  {formattedDate}
                </span>
                {session.is_exam === 1 && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-bold">
                    <Award className="w-3 h-3" />
                    {t("examSession")}
                  </span>
                )}
              </div>
              {formattedTime && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedTime}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "group_name",
      header: t("group"),
      render: () => (
        <span className="text-sm font-bold text-foreground bg-muted px-3 py-1.5 rounded-lg inline-block">
          {groupName}
        </span>
      ),
    },
    {
      key: "present_count",
      header: t("presentStudentsCountCol"),
      sortable: true,
      render: (session) => (
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-black text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>{session.present_count}</span>
        </span>
      ),
    },
    {
      key: "absent_count",
      header: t("absentStudentsCountCol"),
      sortable: true,
      render: (session) => (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-xl font-black text-sm">
            <XCircle className="w-4 h-4" />
            <span>{session.absent_count}</span>
          </span>
          {session.excused_count > 0 && (
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl font-bold text-xs">
              {t("excusedCount")}: {session.excused_count}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: t("actionsCol"),
      render: (session) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigateToDetails(session.id);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95"
        >
          <Eye className="w-4 h-4" />
          <span>{t("sessionDetailsBtn")}</span>
        </button>
      ),
    },
  ];

  if (sessions.length === 0) {
    return (
      <section className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm animate-in fade-in duration-500">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <History className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-black text-foreground mb-1">{t("previousSessionsTab")}</h3>
        <p className="text-sm text-muted-foreground font-medium">{t("noPreviousSessions")}</p>
      </section>
    );
  }

  return (
    <section className="animate-in fade-in duration-500">
      <DataTable
        columns={columns}
        data={sessions}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-black text-foreground">{t("previousSessionsTab")}</h2>
          </div>
        }
        pageSize={10}
        getRowId={(row) => row.id}
        onRowClick={(row) => navigateToDetails(row.id)}
      />
    </section>
  );
}
