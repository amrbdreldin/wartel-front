"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTeacherGroupStudents } from "@/hooks/api/useTeacherQueries";
import { GroupBanner } from "./_components/GroupBanner";
import { GroupStudentsTable } from "./_components/GroupStudentsTable";

export default function GroupStudentsPage() {
  const t = useTranslations("teacherBoard");
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const groupId = params.groupId as string;

  const [expandedStudents, setExpandedStudents] = useState<Record<number, boolean>>({});

  const { data: response, isLoading, error, refetch } = useTeacherGroupStudents(groupId);
  const groupData = response;

  const toggleStudentNotes = (studentId: number) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  // ─── Loading Skeleton (Adjusted with Real Table Design) ─────────────────────
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-muted rounded" />

        {/* Banner Skeleton */}
        <div className="h-40 bg-muted border border-border rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Students Table Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-muted" />
            <div className="h-6 w-48 bg-muted rounded" />
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse text-start">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 w-[25%]"><div className="h-4 w-24 bg-muted rounded" /></th>
                    <th className="px-6 py-4 w-[20%]"><div className="h-4 w-16 bg-muted rounded" /></th>
                    <th className="px-6 py-4 w-[20%]"><div className="h-4 w-20 bg-muted rounded" /></th>
                    <th className="px-6 py-4 w-[15%]"><div className="h-4 w-16 bg-muted rounded" /></th>
                    <th className="px-6 py-4 w-[20%]"><div className="h-4 w-24 bg-muted rounded" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[1, 2, 3, 4].map((n: number) => (
                    <tr key={n} className="border-b border-border/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-muted shrink-0 animate-pulse" />
                          <div className="h-4 w-28 bg-muted rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 bg-muted rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 max-w-[150px]">
                          <div className="h-3 w-8 bg-muted rounded" />
                          <div className="w-full h-1.5 bg-muted rounded-full" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 bg-muted rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-24 bg-muted rounded-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────
  if (error || !groupData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-3xl shadow-xl max-w-xl mx-auto space-y-6 text-center animate-in fade-in duration-500 mt-10">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
          <AlertTriangle className="w-8 h-8 text-destructive animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-foreground">{t("error")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("errorDesc")}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("retry")}</span>
        </button>
      </div>
    );
  }

  const { group_name, track_name, students = [] } = groupData;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* ── BREADCRUMB ────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/${locale}/teacher`} className="font-bold hover:text-primary transition-colors">
          {t("dashboard")}
        </Link>
        <span className="opacity-40">/</span>
        <span className="font-medium text-foreground">{group_name}</span>
      </nav>

      {/* Back button */}
      <div>
        <Link
          href={`/${locale}/teacher`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-xl"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t("backToDashboard")}
        </Link>
      </div>

      {/* ── GROUP INFO BANNER ─────────────────────────────────────────────── */}
      <GroupBanner
        trackName={track_name}
        groupName={group_name}
        totalStudents={students.length}
        t={t}
      />

      {/* ── STUDENTS TABLE ─────────────────────────────────────────────────── */}
      <GroupStudentsTable
        students={students}
        trackName={track_name}
        locale={locale}
        isRTL={isRTL}
        t={t}
        expandedStudents={expandedStudents}
        toggleStudentNotes={toggleStudentNotes}
      />
    </div>
  );
}
