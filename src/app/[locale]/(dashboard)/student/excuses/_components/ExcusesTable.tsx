"use client";

import { CheckCircle2, Hourglass, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import type { LeaveRecord } from "@/types/student.types";
import { DataTable, Column } from "@/components/ui/DataTable";

// ============================================================
// Status Badge Helper
// ============================================================
function StatusBadge({ statusCode }: { statusCode: string }) {
  const t = useTranslations();

  switch (statusCode?.toLowerCase()) {
    case "approved":
    case "accepted":
      return (
        <span className="inline-flex items-center gap-1.5 bg-success-50 text-success-600 dark:bg-success-50/10 px-3.5 py-1.5 font-bold rounded-lg text-sm transition-all duration-200">
          <CheckCircle2 className="w-4 h-4" /> {t("student.statusApproved")}
        </span>
      );
    case "rejected":
    case "declined":
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-100/50 text-red-600 dark:bg-red-950/20 px-3.5 py-1.5 font-bold rounded-lg text-sm transition-all duration-200">
          <XCircle className="w-4 h-4" /> {t("student.statusRejected")}
        </span>
      );
    case "review":
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 bg-warning-100/50 text-warning-600 dark:bg-warning-950/20 px-3.5 py-1.5 font-bold rounded-lg text-sm transition-all duration-200">
          <Hourglass className="w-4 h-4" /> {t("student.statusUnderReview")}
        </span>
      );
  }
}

// ============================================================
// ExcusesTable Component
// ============================================================
export function ExcusesTable() {
  const t = useTranslations();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-leaves"],
    queryFn: () => studentService.getLeaves(),
  });

  const leaves = data?.data?.leaves || [];

  const columns: Column<LeaveRecord>[] = [
    {
      key: "created_at",
      header: t("student.submissionDate"),
      sortable: true,
      render: (leave) => {
        return new Date(leave.created_at).toLocaleString("ar-EG", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      key: "reason",
      header: t("student.excuses"),
      sortable: true,
      className: "font-bold text-foreground text-base md:text-lg",
    },
    {
      key: "duration",
      header: `${t("student.fromDate")} - ${t("student.toDate")}`,
      render: (leave) => {
        const formatDate = (d: string) =>
          new Date(d).toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
        return (
          <span className="font-bold text-muted-foreground">
            {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
          </span>
        );
      },
    },
    {
      key: "status",
      header: t("common.status"),
      render: (leave) => <StatusBadge statusCode={leave.status?.name || "pending"} />,
    },
    {
      key: "admin_notes",
      header: t("student.adminNote"),
      className: "max-w-xs truncate text-muted-foreground/80 font-medium",
      render: (leave) => {
        return leave.admin_notes ? (
          <span title={leave.admin_notes}>{leave.admin_notes}</span>
        ) : (
          <span className="opacity-50">—</span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={leaves}
      isLoading={isLoading}
      isError={isError}
      errorText={(error as { response?: { data?: { message?: string } } | null })?.response?.data?.message || (error as Error | null)?.message}
      title={t("student.previousRequestsHistory")}
      searchable
      searchKeys={["reason", "admin_notes"]}
      searchPlaceholder={t("common.search")}
      pageSize={5}
    />
  );
}

