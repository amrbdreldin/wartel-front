"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DataTable, Column } from "@/components/ui/DataTable";

interface TamamHistoryTableProps {
  history: any[];
}

const isStatusAbsent = (status: any) => {
  if (!status) return false;
  const s = String(status).trim().toLowerCase();
  return s === "absent" || s === "غياب" || s === "غائب";
};

export function TamamHistoryTable({ history }: TamamHistoryTableProps) {
  const t = useTranslations();

  const columns: Column<any>[] = [
    {
      key: "tamam_id",
      header: "#",
      sortable: true,
      className: "font-black text-foreground text-base",
    },
    {
      key: "tamam_date",
      header: t("common.date"),
      sortable: true,
      className: "font-medium text-base",
    },
    {
      key: "buddy_name",
      header: t("student.companion"),
      sortable: true,
      className: "font-bold text-primary text-base",
    },
    {
      key: "past_status_name",
      header: t("student.pastStatus"),
      render: (row) => (
        <span className="px-3.5 py-1.5 font-bold rounded-lg text-sm bg-muted text-muted-foreground transition-all duration-200">
          {row.past_status_name}
        </span>
      ),
    },
    {
      key: "present_status_name",
      header: t("student.presentStatus"),
      render: (row) => (
        <span
          className={cn(
            "px-3.5 py-1.5 font-bold rounded-lg text-sm transition-all duration-200",
            isStatusAbsent(row.present_status_name)
              ? "bg-destructive/10 text-destructive dark:bg-destructive/20"
              : "bg-success-500/10 text-success-600 dark:bg-success-500/20"
          )}
        >
          {row.present_status_name}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={history}
      title={t("student.previousWeeklyTamamRecord")}
      pageSize={5}
    />
  );
}

