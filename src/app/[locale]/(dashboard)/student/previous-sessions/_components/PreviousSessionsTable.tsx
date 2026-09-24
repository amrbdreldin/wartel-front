"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
  Trophy,
  User,
  Users,
  XCircle,
} from "lucide-react";
import type { StudentPreviousSession } from "@/types/student.types";
import { DataTable, Column } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

interface PreviousSessionsTableProps {
  sessions: StudentPreviousSession[];
  isLoading: boolean;
  isError: boolean;
  error?: any;
}

type FilterType = "all" | "attended" | "absent" | "completed";

export function PreviousSessionsTable({
  sessions = [],
  isLoading = false,
  isError = false,
  error,
}: PreviousSessionsTableProps) {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = React.useState<FilterType>("all");

  // Filter data based on selected filter pill
  const filteredData = React.useMemo(() => {
    if (!sessions) return [];

    switch (activeFilter) {
      case "attended":
        return sessions.filter(
          (s) => s.is_attended || s.attendance_status?.id === 1
        );
      case "absent":
        return sessions.filter(
          (s) =>
            s.attendance_status?.id === 2 ||
            (!s.is_attended && s.attendance_status !== null)
        );
      case "completed":
        return sessions.filter(
          (s) =>
            s.session_status?.id === 3 ||
            s.session_status?.name?.toLowerCase().includes("مكتمل")
        );
      case "all":
      default:
        return sessions;
    }
  }, [sessions, activeFilter]);

  const columns: Column<StudentPreviousSession>[] = [
    {
      key: "session_id",
      header: t("student.previousSessions.table.sessionId"),
      className: "w-20 font-bold text-muted-foreground",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-muted text-xs font-mono font-bold">
          #{row.session_id}
        </span>
      ),
    },
    {
      key: "group_name",
      header: t("student.previousSessions.table.groupName"),
      sortable: true,
      className: "min-w-[180px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-foreground text-sm md:text-base leading-snug line-clamp-1">
              {row.group_name}
            </p>
            {row.group_id && (
              <p className="text-xs text-muted-foreground font-medium">
                {t("student.previousSessions.groupPrefix")} {row.group_id}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "teacher_name",
      header: t("student.previousSessions.table.teacher"),
      sortable: true,
      className: "hidden md:table-cell min-w-[140px]",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-foreground truncate">
            {row.teacher_name || t("student.previousSessions.unassigned")}
          </span>
        </div>
      ),
    },
    {
      key: "scheduled_at",
      header: t("student.previousSessions.table.scheduledAt"),
      sortable: true,
      className: "min-w-[150px]",
      render: (row) => (
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-foreground">
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">
            {row.scheduled_at_formatted || row.scheduled_at}
          </span>
        </div>
      ),
    },
    {
      key: "session_status",
      header: t("student.previousSessions.table.sessionStatus"),
      className: "hidden lg:table-cell",
      render: (row) => {
        const status = row.session_status;
        if (!status) return <span className="opacity-40">—</span>;

        const isCompleted =
          status.id === 3 || status.name.includes("مكتمل");
        return (
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
              isCompleted
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
            )}
          >
            {status.name}
          </span>
        );
      },
    },
    {
      key: "attendance_status",
      header: t("student.previousSessions.table.attendance"),
      className: "min-w-[120px]",
      render: (row) => {
        const isAttended =
          row.is_attended || row.attendance_status?.id === 1;
        const isAbsent =
          row.attendance_status?.id === 2 ||
          (!row.is_attended && row.attendance_status !== null);
        const hasStatus = row.attendance_status !== null;

        if (!hasStatus && !row.is_attended) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border/40">
              <Clock className="w-3.5 h-3.5" />
              {t("student.previousSessions.status.notRecorded")}
            </span>
          );
        }

        if (isAttended) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {row.attendance_status?.name ||
                t("student.previousSessions.status.attended")}
            </span>
          );
        }

        if (isAbsent) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              {row.attendance_status?.name ||
                t("student.previousSessions.status.absent")}
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border/40">
            <HelpCircle className="w-3.5 h-3.5" />
            {t("student.previousSessions.status.notRecorded")}
          </span>
        );
      },
    },
    {
      key: "degree",
      header: t("student.previousSessions.table.degree"),
      className: "hidden xl:table-cell",
      render: (row) => {
        if (row.degree_name) {
          return (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground bg-muted/50 px-2.5 py-1 rounded-md">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {row.degree_name}
            </span>
          );
        }
        if (row.degree !== null && row.degree !== undefined) {
          return (
            <span className="font-bold text-sm text-foreground">
              {row.degree}
            </span>
          );
        }
        return <span className="text-muted-foreground/60 text-xs">—</span>;
      },
    },
    {
      key: "points",
      header: t("student.previousSessions.table.points"),
      sortable: true,
      className: "hidden sm:table-cell",
      render: (row) => {
        const pointsVal = row.points;
        const displayVal =
          pointsVal !== null && pointsVal !== undefined
            ? `${pointsVal}`
            : "0.00";
        return (
          <span className="inline-flex items-center gap-1 font-bold text-xs md:text-sm text-primary">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {displayVal}
          </span>
        );
      },
    },
  ];

  const resolvedErrorText =
    error?.response?.data?.message ||
    error?.message ||
    t("common.errorOccurred");

  // Extra controls: filter pills
  const extraControls = (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => setActiveFilter("all")}
        className={cn(
          "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
          activeFilter === "all"
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {t("student.previousSessions.filters.all")} ({sessions.length})
      </button>

      <button
        type="button"
        onClick={() => setActiveFilter("attended")}
        className={cn(
          "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
          activeFilter === "attended"
            ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {t("student.previousSessions.filters.attended")}
      </button>

      <button
        type="button"
        onClick={() => setActiveFilter("absent")}
        className={cn(
          "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
          activeFilter === "absent"
            ? "bg-rose-600 text-white shadow-sm shadow-rose-600/20"
            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {t("student.previousSessions.filters.absent")}
      </button>

      <button
        type="button"
        onClick={() => setActiveFilter("completed")}
        className={cn(
          "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
          activeFilter === "completed"
            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {t("student.previousSessions.filters.completed")}
      </button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      isLoading={isLoading}
      isError={isError}
      errorText={resolvedErrorText}
      noDataText={t("student.previousSessions.noSessions")}
      searchable
      searchPlaceholder={t("student.previousSessions.searchPlaceholder")}
      searchKeys={["group_name", "teacher_name", "scheduled_at_formatted"]}
      pageSize={10}
      extraControls={extraControls}
      className="border-border/60"
    />
  );
}
