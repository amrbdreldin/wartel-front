"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  CalendarCheck,
 
} from "lucide-react";
import { useStudentPreviousSessions } from "@/hooks/api/useStudentQueries";
import { PreviousSessionsTable } from "./_components/PreviousSessionsTable";
import type { StudentPreviousSession } from "@/types/student.types";

export default function PreviousSessionsPage() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dateFrom, setDateFrom] = React.useState(""); // YYYY-MM-DD
  const [dateTo, setDateTo] = React.useState(""); // YYYY-MM-DD
  const isDateFiltered = Boolean(dateFrom || dateTo);
  const pageSize = 15;
  // While filtering by date, pull a wide window so the filter isn't limited to the current page
  const DATE_FILTER_PAGE_SIZE = 100;

  const { data, isLoading, isFetching, isError, error } = useStudentPreviousSessions(
    isDateFiltered
      ? {
          page: 1,
          per_page: DATE_FILTER_PAGE_SIZE,
          ...(dateFrom && { date_from: dateFrom }),
          ...(dateTo && { date_to: dateTo }),
        }
      : { page: currentPage, per_page: pageSize }
  );

  const handleDateRangeChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    setCurrentPage(1);
  };

  // Extract sessions safely from any response shape (PaginatedResponse, direct array, or Laravel LengthAwarePaginator)
  const allSessions: StudentPreviousSession[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (data.data && typeof data.data === "object" && Array.isArray((data.data as any).data)) {
      return (data.data as any).data;
    }
    if (Array.isArray(data)) return data as any;
    return [];
  }, [data]);

  // scheduled_at / scheduled_at_formatted both start with "YYYY-MM-DD"
  const sessions = React.useMemo(() => {
    if (!isDateFiltered) return allSessions;
    return allSessions.filter((s) => {
      const day = (s.scheduled_at_formatted || s.scheduled_at || "").slice(0, 10);
      if (!day) return false;
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
      return true;
    });
  }, [allSessions, isDateFiltered, dateFrom, dateTo]);

  // Extract pagination meta safely from all common formats
  const paginationMeta = React.useMemo(() => {
    if (!data) return null;
    const d = data as any;

    if (d.meta && typeof d.meta === "object") {
      return {
        currentPage: Number(d.meta.current_page || d.meta.currentPage || currentPage),
        lastPage: Number(d.meta.last_page || d.meta.lastPage || 1),
        perPage: Number(d.meta.per_page || d.meta.perPage || pageSize),
        total: Number(d.meta.total ?? 0),
      };
    }

    if (d.data && typeof d.data === "object" && d.data.current_page !== undefined) {
      return {
        currentPage: Number(d.data.current_page || currentPage),
        lastPage: Number(d.data.last_page || 1),
        perPage: Number(d.data.per_page || pageSize),
        total: Number(d.data.total ?? 0),
      };
    }

    if (d.data?.meta && typeof d.data.meta === "object") {
      return {
        currentPage: Number(d.data.meta.current_page || currentPage),
        lastPage: Number(d.data.meta.last_page || 1),
        perPage: Number(d.data.meta.per_page || pageSize),
        total: Number(d.data.total ?? 0),
      };
    }

    if (d.pagination && typeof d.pagination === "object") {
      return {
        currentPage: Number(d.pagination.current_page || d.pagination.currentPage || currentPage),
        lastPage: Number(d.pagination.last_page || d.pagination.lastPage || 1),
        perPage: Number(d.pagination.per_page || d.pagination.perPage || pageSize),
        total: Number(d.pagination.total ?? 0),
      };
    }

    return null;
  }, [data, currentPage, pageSize]);

  const totalPages = React.useMemo(() => {
    if (isDateFiltered) return 1;
    if (paginationMeta?.lastPage) {
      return paginationMeta.lastPage;
    }
    // Fallback if backend does not return pagination meta:
    // If current batch is full (15 items), next page exists.
    if (sessions.length === pageSize) {
      return currentPage + 1;
    }
    return Math.max(currentPage, 1);
  }, [isDateFiltered, paginationMeta, sessions.length, currentPage, pageSize]);

  const totalItems = React.useMemo(() => {
    if (isDateFiltered) return sessions.length;
    if (paginationMeta?.total !== undefined) {
      return paginationMeta.total;
    }
    return undefined;
  }, [isDateFiltered, sessions.length, paginationMeta]);

  // Compute stats for header cards
  const stats = React.useMemo(() => {
    if (!sessions.length) {
      return {
        total: totalItems ?? 0,
        attended: 0,
        absent: 0,
        rate: "0%",
        totalPoints: "0.00",
      };
    }

    const total = totalItems ?? sessions.length;
    const attended = sessions.filter(
      (s) => s.is_attended || s.attendance_status?.id === 1
    ).length;
    const absent = sessions.filter(
      (s) =>
        s.attendance_status?.id === 2 ||
        (!s.is_attended && s.attendance_status !== null)
    ).length;

    const rateNum = sessions.length > 0 ? Math.round((attended / sessions.length) * 100) : 0;
    const rate = `${rateNum}%`;

    const pointsSum = sessions.reduce((acc, curr) => {
      const p = parseFloat(String(curr.points || "0"));
      return acc + (isNaN(p) ? 0 : p);
    }, 0);

    return {
      total,
      attended,
      absent,
      rate,
      totalPoints: pointsSum.toFixed(2),
    };
  }, [sessions, totalItems]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Page Header */}
      <header className="pb-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                {t("student.previousSessions.pageTitle")}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-0.5 font-medium">
                {t("student.previousSessions.pageSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </header>

    

      {/* Main Table Section */}
      <section aria-label={t("student.previousSessions.pageTitle")}>
        <PreviousSessionsTable
          sessions={sessions}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateRangeChange={handleDateRangeChange}
        />
      </section>
    </div>
  );
}
