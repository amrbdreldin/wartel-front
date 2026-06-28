"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Scroll, Eye, Star } from "lucide-react";
import { DataTable, Column } from "@/components/ui/DataTable";
import type { WerdRecord } from "@/types/student.types";

interface WerdTableProps {
  werds: WerdRecord[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  locale: string;
}

export function WerdTable({ werds, isLoading, isError, error, locale }: WerdTableProps) {
  const t = useTranslations();
  const router = useRouter();

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
      className: "w-20",
      render: (werd) => {
        const imageSrc = werd?.image;
        const title = werd?.title || "";
        return imageSrc ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/40 shrink-0">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Scroll className="w-7 h-7 text-primary" />
          </div>
        );
      },
    },
    {
      key: "title",
      header: t("student.werd.title"),
      sortable: true,
      className: "font-bold text-foreground",
      render: (werd) => {
        const title = werd?.title || "";
        const trackName = werd?.track_name || "";
        return (
          <div className="space-y-1">
            <p className="font-bold text-foreground leading-snug">{title}</p>
            {trackName && (
              <p className="text-xs text-muted-foreground font-medium">
                {trackName}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "track_name",
      header: t("student.werd.track"),
      sortable: true,
      className: "hidden md:table-cell max-w-[200px]",
      render: (werd) => {
        const trackName = werd?.track_name;
        if (!trackName) return <span className="opacity-50">—</span>;
        return (
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold truncate max-w-[180px]">
            <Star className="w-3.5 h-3.5 shrink-0" />
            {trackName}
          </span>
        );
      },
    },
    {
      key: "created_at",
      header: t("student.werd.createdAt"),
      sortable: true,
      className: "hidden xl:table-cell text-muted-foreground",
      render: (werd) => {
        const dateStr = werd?.created_at;
        if (!dateStr) return <span className="opacity-50">—</span>;
        try {
          return new Date(dateStr).toLocaleDateString("ar-EG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        } catch {
          return dateStr;
        }
      },
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (werd) => {
        const id = werd?.id;
        if (!id) return null;
        return (
          <button
            id={`werd-details-btn-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/${locale}/student/werd/${id}`);
            }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-md hover:shadow-primary/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={t("student.werd.viewDetails")}
          >
            <Eye className="w-4 h-4 shrink-0" />
            {t("student.werd.viewDetails")}
          </button>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={werds || []}
      isLoading={isLoading}
      isError={isError}
      errorText={
        (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message ||
        (error as Error | null)?.message ||
        ""
      }
      noDataText={t("student.werd.noWerds")}
      searchable
      searchKeys={["title", "track_name"]}
      searchPlaceholder={t("common.search")}
      pageSize={10}
      onRowClick={(werd) => {
        if (werd?.id) {
          router.push(`/${locale}/student/werd/${werd.id}`);
        }
      }}
    />
  );
}
