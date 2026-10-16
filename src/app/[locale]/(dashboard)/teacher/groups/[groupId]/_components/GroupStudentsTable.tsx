import React from "react";
import {
  GraduationCap,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { GroupStudentDetail, StudentSessionNote } from "@/types/teacher.types";
import { DataTable, Column } from "@/components/ui/DataTable";
import type { TranslationValues } from "next-intl";

interface GroupStudentsTableProps {
  students: GroupStudentDetail[];
  trackName: string;
  locale: string;
  isRTL: boolean;
  t: (key: string, values?: TranslationValues) => string;
  expandedStudents: Record<number, boolean>;
  toggleStudentNotes: (studentId: number) => void;
}

export function GroupStudentsTable({
  students,
  trackName,
  locale,
  t,
  expandedStudents,
  toggleStudentNotes,
}: GroupStudentsTableProps) {
  const router = useRouter();

  const columns: Column<GroupStudentDetail>[] = [
    {
      key: "name",
      header: t("studentName"),
      sortable: true,
      render: (student) => {
        const initials = student.name
          ? student.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("")
          : "?";
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-success-500/20 to-success-500/5 border border-success-500/20 flex items-center justify-center text-success-700 font-black text-sm shrink-0">
              {initials}
            </div>
            <h3 className="font-bold text-base text-foreground">
              {student.name}
            </h3>
          </div>
        );
      },
    },
    {
      key: "track_name",
      header: t("track"),
      sortable: true,
      render: (student) => (
        <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
          {student.track_name || trackName}
        </span>
      ),
    },
    {
      key: "notes",
      header: t("sessionNotes"),
      render: (student) => {
        const validNotes = student.session_notes?.filter((note) => note.comment || note.secret_comment) || [];
        const notesCount = validNotes.length;
        const isExpanded = !!expandedStudents[student.id];

        return (
          <div className="flex items-center justify-between gap-2 max-w-[150px]">
            <div className="text-sm font-medium text-muted-foreground truncate">
              {notesCount > 0 ? (
                <span className="inline-flex items-center gap-1 bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-md font-bold text-xs">
                  {t("notesCount", { count: notesCount })}
                </span>
              ) : (
                <span className="text-muted-foreground/60 italic text-sm">
                  {t("noNotes")}
                </span>
              )}
            </div>
            {notesCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStudentNotes(student.id);
                }}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95 shrink-0"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const renderExpandedRow = (student: GroupStudentDetail) => {
    const validNotes = student.session_notes?.filter((note) => note.comment || note.secret_comment) || [];
    const notesCount = validNotes.length;

    if (notesCount === 0) return null;

    return (
      <div className="py-6 px-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300 bg-muted/10">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="w-5 h-5 text-primary" />
            {t("sessionNotes")}
          </h4>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {t("notesCount", { count: notesCount })}
          </span>
        </div>

        <div className="relative ps-6 border-s-2 border-border/80 ms-3 space-y-6">
          {validNotes.map((note: StudentSessionNote, index: number) => (
            <div
              key={note.session_id}
              className="relative bg-card border border-border/50 rounded-2xl p-5 text-sm leading-relaxed space-y-3 hover:shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Dot Indicator on timeline */}
              <div className="absolute top-[22px] -start-[35px] w-4 h-4 rounded-full bg-primary border-4 border-card flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-background" />
              </div>

              <div className="flex items-center justify-between gap-2 text-xs font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
                  <Clock className="w-4 h-4 text-primary" />
                  {new Date(note.scheduled_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-foreground font-medium whitespace-pre-wrap leading-relaxed">
                {note.comment || note.secret_comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="animate-in fade-in duration-500">
      <DataTable
        columns={columns}
        data={students}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-black text-foreground">{t("groupStudentsTitle")}</h2>
          </div>
        }
        searchable
        searchKeys={["name"]}
        pageSize={10}
        getRowId={(row) => row.id}
        expandedRows={expandedStudents}
        renderExpandedRow={renderExpandedRow}
        onRowClick={(row) => {
          router.push(`/${locale}/teacher/student/${row.id}/profile-details`);
        }}
      />
    </section>
  );
}
