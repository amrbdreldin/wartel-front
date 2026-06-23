"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GradientBar } from "@/components/ui/gradient-bar";
import { X, Loader2, GraduationCap, ArrowLeftRight, Search, Users } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useTeacherGroupsWithStudents, useTeacherLoginAsStudent } from "@/hooks/api/useTeacherQueries";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { TeacherGroupStudent, TeacherGroupWithStudents } from "@/types/teacher.types";
import { UserRole } from "@/types/enums";
import { cn } from "@/lib/utils";

// ============================================================
// TeacherSwitchToStudentModal
// Lets the teacher pick one of their students and navigate to
// the student dashboard WITH backing up the teacher session.
// ============================================================

export const TEACHER_VIEWING_KEY = "teacher_viewing_student_id";

interface TeacherSwitchToStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherSwitchToStudentModal({
  isOpen,
  onClose,
}: TeacherSwitchToStudentModalProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const { data: groupsData, isLoading: isLoadingGroups } = useTeacherGroupsWithStudents();
  const { mutate: loginAsStudent } = useTeacherLoginAsStudent();
  const { switchToChild } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [navigatingId, setNavigatingId] = useState<number | null>(null);

  // Flatten all students across all groups, de-duplicate by student_id
  const allStudents = useMemo(() => {
    if (!groupsData) return [];
    const seen = new Set<number>();
    const result: (TeacherGroupStudent & { group_name: string })[] = [];
    (groupsData as TeacherGroupWithStudents[]).forEach((group) => {
      group.students?.forEach((student) => {
        if (!seen.has(student.student_id)) {
          seen.add(student.student_id);
          result.push({ ...student, group_name: group.name });
        }
      });
    });
    return result;
  }, [groupsData]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return allStudents;
    const q = searchQuery.toLowerCase();
    return allStudents.filter((s) => s.full_name.toLowerCase().includes(q));
  }, [allStudents, searchQuery]);

  const handleSwitchTo = (student: TeacherGroupStudent) => {
    setNavigatingId(student.student_id);

    loginAsStudent(student.student_id, {
      onSuccess: (res) => {
        const token = res.token || res.access_token || "";
        if (token) {
          // Store the current teacher session in backup cookies and log in as the student
          switchToChild({
            user: res.user || { id: student.student_id, full_name: student.full_name, role: UserRole.STUDENT, phone: "" },
            accessToken: token,
            refreshToken: res.refresh_token || "",
          });

          toast.success(t("switchedToStudentSuccess", { name: student.full_name }));

          if (typeof window !== "undefined") {
            sessionStorage.setItem("switching_to_student", "1");
            sessionStorage.setItem(TEACHER_VIEWING_KEY, String(student.student_id));
          }

          onClose();
          setTimeout(() => {
            router.push(`/${locale}/student`);
          }, 150);
        } else {
          toast.error(tCommon("error") || "Error logging in");
          setNavigatingId(null);
        }
      },
      onError: (error: unknown) => {
        console.error("Failed to login as student:", error);
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        const errorMsg = err.response?.data?.message || err.message || tCommon("error") || "Error logging in";
        toast.error(errorMsg);
        setNavigatingId(null);
      },
    });
  };

  const handleClose = () => {
    setSearchQuery("");
    setNavigatingId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="p-0 border-none bg-transparent shadow-none max-w-md w-full focus:outline-none"
      >
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="w-full animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="bg-card/95 backdrop-blur-lg border border-border/50 rounded-3xl shadow-2xl overflow-hidden relative">
            <GradientBar variant="primary" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 end-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none"
              aria-label={tCommon("close")}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-5 pb-5 pt-6 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pe-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-black text-foreground leading-tight">
                    {t("switchToStudentTitle")}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("switchToStudentDesc")}
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchStudent")}
                  className="w-full h-9 ps-8 pe-3 text-sm rounded-xl border border-border bg-muted/40 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                />
              </div>

              {/* Student List */}
              <div className="max-h-72 overflow-y-auto rounded-2xl border border-border/60 divide-y divide-border/40 bg-background">
                {isLoadingGroups ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-xs">{tCommon("loading")}</span>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                    <Users className="w-7 h-7 opacity-30" />
                    <span className="text-xs">
                      {searchQuery ? tCommon("noData") : t("noStudentsFound")}
                    </span>
                  </div>
                ) : (
                  filtered.map((student) => {
                    const isNavigating = navigatingId === student.student_id;
                    const initials = student.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "ط";

                    return (
                      <button
                        key={student.student_id}
                        onClick={() => handleSwitchTo(student)}
                        disabled={navigatingId !== null}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-start hover:bg-muted/50 transition-colors focus:outline-none focus:bg-muted/50",
                          "disabled:opacity-60 disabled:cursor-not-allowed",
                          isNavigating && "bg-primary/5"
                        )}
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {student.full_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {student.group_name}
                          </p>
                        </div>

                        {/* Icon */}
                        {isNavigating ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                        ) : (
                          <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Cancel */}
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl border border-border text-muted-foreground font-bold text-sm hover:bg-muted hover:text-foreground transition-all cursor-pointer focus:outline-none"
              >
                {tCommon("cancel")}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
