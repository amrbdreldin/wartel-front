"use client";

import { Scroll, Eye, CheckCircle, XCircle, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { studentService } from "@/services/student.service";
import { DataTable, Column } from "@/components/ui/DataTable";
import type { WerdRecord } from "@/types/student.types";
import Image from "next/image";

// ============================================================
// Student Werd (الورد) Page
// ============================================================

export default function WerdPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-werds"],
    queryFn: () => studentService.getWerds(),
  });

  const werds: WerdRecord[] = data?.data || [];

  const columns: Column<WerdRecord>[] = [
    {
      key: "id",
      header: t("student.werd.id"),
      className: "text-muted-foreground font-bold w-12",
      render: (_, idx) => (
        <span className="text-muted-foreground font-semibold">{idx + 1}</span>
      ),
    },
    {
      key: "image",
      header: "",
      className: "w-16",
      render: (werd) =>
        werd.image ? (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border/40 shrink-0">
            <Image
              src={werd.image}
              alt={werd.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Scroll className="w-5 h-5 text-primary" />
          </div>
        ),
    },
    {
      key: "title",
      header: t("student.werd.title"),
      sortable: true,
      className: "font-bold text-foreground",
      render: (werd) => (
        <div className="space-y-1">
          <p className="font-bold text-foreground leading-snug">{werd.title}</p>
          <p className="text-xs text-muted-foreground font-medium">
            {werd.track_name}
          </p>
        </div>
      ),
    },
    {
      key: "track_name",
      header: t("student.werd.track"),
      sortable: true,
      className: "hidden md:table-cell max-w-[200px]",
      render: (werd) => (
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold truncate max-w-[180px]">
          <Star className="w-3.5 h-3.5 shrink-0" />
          {werd.track_name}
        </span>
      ),
    },
    {
      key: "have_exams",
      header: t("student.werd.hasExams"),
      className: "hidden lg:table-cell",
      render: (werd) =>
        werd.have_exams ? (
          <span className="inline-flex items-center gap-1.5 bg-warning-100/50 text-warning-700 dark:bg-warning-950/20 dark:text-warning-400 px-3 py-1.5 rounded-lg text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
            {t("student.werd.hasExams")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            {t("student.werd.noExams")}
          </span>
        ),
    },
    {
      key: "created_at",
      header: t("student.werd.createdAt"),
      sortable: true,
      className: "hidden xl:table-cell text-muted-foreground",
      render: (werd) => {
        try {
          return new Date(werd.created_at).toLocaleDateString("ar-EG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        } catch {
          return werd.created_at;
        }
      },
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (werd) => (
        <button
          id={`werd-details-btn-${werd.id}`}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${locale}/student/werd/${werd.id}`);
          }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-md hover:shadow-primary/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={t("student.werd.viewDetails")}
        >
          <Eye className="w-4 h-4 shrink-0" />
          {t("student.werd.viewDetails")}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="pb-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl">
            <Scroll className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("student.werd.pageTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("student.werd.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={werds}
        isLoading={isLoading}
        isError={isError}
        errorText={
          (
            error as {
              response?: { data?: { message?: string } };
            } | null
          )?.response?.data?.message || (error as Error | null)?.message
        }
        noDataText={t("student.werd.noWerds")}
        searchable
        searchKeys={["title", "track_name"]}
        searchPlaceholder={t("common.search")}
        pageSize={10}
        onRowClick={(werd) => router.push(`/${locale}/student/werd/${werd.id}`)}
      />
    </div>
  );
}
