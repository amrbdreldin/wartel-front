"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare,
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
  isFetching?: boolean;
  isError: boolean;
  error?: Error | { response?: { data?: { message?: string } }; message?: string } | null;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function PreviousSessionsTable({
  sessions = [],
  isLoading = false,
  isFetching = false,
  isError = false,
  error,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 15,
  onPageChange,
}: PreviousSessionsTableProps) {
  const t = useTranslations();

  const columns: Column<StudentPreviousSession>[] = [
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
    {
      key: "teacher_notes",
      header: t("student.previousSessions.table.teacherNotes"),
      className: "min-w-[180px] max-w-xs",
      render: (row) => {
        const note = row.comment || row.notes;
        if (!note) {
          return <span className="text-muted-foreground/40 text-sm">—</span>;
        }
        return (
          <div className="flex items-start gap-2" title={note}>
            <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-foreground/90 font-medium leading-relaxed line-clamp-2">
              {note}
            </p>
          </div>
        );
      },
    },
  ];

  const resolvedErrorText =
    error && "response" in error && error.response?.data?.message
      ? error.response.data.message
      : error?.message || t("common.errorOccurred");

  return (
    <DataTable
      columns={columns}
      data={sessions}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      errorText={resolvedErrorText}
      noDataText={t("student.previousSessions.noSessions")}
      searchable
      searchPlaceholder={t("student.previousSessions.searchPlaceholder")}
      searchKeys={["group_name", "teacher_name", "scheduled_at_formatted", "comment", "notes"]}
      pageSize={pageSize}
      manualPagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      className="border-border/60"
    />
  );
}
