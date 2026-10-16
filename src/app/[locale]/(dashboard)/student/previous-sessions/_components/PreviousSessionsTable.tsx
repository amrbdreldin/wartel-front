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
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type { StudentPreviousSession } from "@/types/student.types";
import { DataTable, Column } from "@/components/ui/DataTable";
import { DatePicker } from "@/components/ui/DatePicker";
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
  dateFrom?: string;
  dateTo?: string;
  onDateRangeChange?: (from: string, to: string) => void;
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
  dateFrom = "",
  dateTo = "",
  onDateRangeChange,
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
      className: "min-w-[120px]",
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
                ? "bg-success-500/10 text-success-700 dark:text-success-400 border-success-500/20"
                : "bg-info-500/10 text-info-700 dark:text-info-400 border-info-500/20"
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-success-500/15 text-success-700 dark:text-success-400 border border-success-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {row.attendance_status?.name ||
                t("student.previousSessions.status.attended")}
            </span>
          );
        }

        if (isAbsent) {
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-danger-500/15 text-danger-700 dark:text-danger-400 border border-danger-500/20">
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
      key: "points",
      header: t("student.previousSessions.table.points"),
      sortable: true,
      className: "min-w-[90px]",
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
      extraControls={
        onDateRangeChange && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
            <DatePicker
              value={dateFrom}
              onChange={(from) => onDateRangeChange(from, dateTo)}
              maxDate={dateTo}
              placeholder={t("student.previousSessions.dateFrom")}
              className="w-full sm:w-52"
            />
            <DatePicker
              value={dateTo}
              onChange={(to) => onDateRangeChange(dateFrom, to)}
              minDate={dateFrom}
              placeholder={t("student.previousSessions.dateTo")}
              className="w-full sm:w-52"
            />
            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={() => onDateRangeChange("", "")}
                aria-label={t("student.previousSessions.clearDateFilter")}
                className="p-2.5 rounded-xl border border-border/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )
      }
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
