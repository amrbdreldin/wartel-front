"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Trophy,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import type { StudentPreviousSession } from "@/types/student.types";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { cn } from "@/lib/utils";

interface SessionDetailsModalProps {
  session: StudentPreviousSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailsModal({
  session,
  open,
  onOpenChange,
}: SessionDetailsModalProps) {
  const t = useTranslations();

  if (!session) return null;

  const isAttended =
    session.is_attended || session.attendance_status?.id === 1;
  const isAbsent =
    session.attendance_status?.id === 2 ||
    (!session.is_attended && session.attendance_status !== null);
  const hasAttendanceStatus = session.attendance_status !== null;

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-w-2xl sm:rounded-3xl border-border/60 bg-card p-0 overflow-hidden shadow-2xl">
        {/* Header with decorative background */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4 border-b border-border/40">
          <ResponsiveDialogHeader className="space-y-2 text-start">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/20">
                <Users className="w-3.5 h-3.5" />
                {t("student.previousSessions.table.sessionId")}: #{session.session_id}
              </span>
              {session.session_status?.name && (
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                    session.session_status.id === 3
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                  )}
                >
                  {session.session_status.name}
                </span>
              )}
            </div>
            <ResponsiveDialogTitle className="text-xl md:text-2xl font-bold text-foreground">
              {session.group_name}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground/80 shrink-0" />
              <span>{session.scheduled_at_formatted || session.scheduled_at}</span>
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Teacher Info */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-xs text-muted-foreground font-medium">
                {t("student.previousSessions.table.teacher")}
              </span>
              <p className="font-bold text-foreground text-base">
                {session.teacher_name || t("student.previousSessions.unassigned")}
              </p>
            </div>

            {/* Attendance Status */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-xs text-muted-foreground font-medium">
                {t("student.previousSessions.table.attendance")}
              </span>
              <div>
                {hasAttendanceStatus ? (
                  isAttended ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      {session.attendance_status?.name ||
                        t("student.previousSessions.status.attended")}
                    </span>
                  ) : isAbsent ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                      <XCircle className="w-4 h-4" />
                      {session.attendance_status?.name ||
                        t("student.previousSessions.status.absent")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-muted text-muted-foreground border border-border/40">
                      <Clock className="w-4 h-4" />
                      {session.attendance_status?.name ||
                        t("student.previousSessions.status.notRecorded")}
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-muted text-muted-foreground border border-border/40">
                    <HelpCircle className="w-4 h-4" />
                    {t("student.previousSessions.status.notRecorded")}
                  </span>
                )}
              </div>
            </div>

            {/* Degree / Grade */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                {t("student.previousSessions.detailsModal.degreeName")}
              </span>
              <p className="font-bold text-foreground text-base">
                {session.degree_name ||
                  (session.degree !== null && session.degree !== undefined
                    ? `${session.degree}`
                    : t("student.previousSessions.detailsModal.notEvaluated"))}
              </p>
            </div>

            {/* Points */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {t("student.previousSessions.table.points")}
              </span>
              <p className="font-bold text-primary text-base">
                {session.points !== null && session.points !== undefined
                  ? `${session.points}`
                  : "0.00"}
              </p>
            </div>
          </div>

          {/* Teacher Comment */}
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              {t("student.previousSessions.detailsModal.teacherNotes")}
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {session.comment || t("student.previousSessions.detailsModal.noNotes")}
            </p>
          </div>

          {/* Administrative / Student Notes */}
          {session.notes && (
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                {t("student.previousSessions.detailsModal.studentNotes")}
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                {session.notes}
              </p>
            </div>
          )}

          {/* Meeting URL */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <Video className="w-4 h-4" />
              {t("student.previousSessions.detailsModal.meetingUrl")}
            </h4>
            {session.url ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-muted-foreground font-mono truncate max-w-sm">
                  {session.url}
                </p>
                <a
                  href={session.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-95"
                  aria-label={t("student.previousSessions.detailsModal.openMeeting")}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t("student.previousSessions.detailsModal.openMeeting")}
                </a>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-medium">
                {t("student.previousSessions.detailsModal.noMeetingUrl")}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <ResponsiveDialogFooter className="p-4 border-t border-border/40 bg-muted/10 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {t("common.close")}
          </button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
