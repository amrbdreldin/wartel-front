"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { teacherService } from "@/services/teacher.service";
import { useTeacherSessionAttendance, useTeacherDashboard, useTeacherGroupStudents } from "@/hooks/api/useTeacherQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { SessionHeader } from "./_components/SessionHeader";
import { SessionRosterTable } from "./_components/SessionRosterTable";
import { SecretNoteModal } from "./_components/SecretNoteModal";
import { StudentDetailsSidebar } from "./_components/StudentDetailsSidebar";
import { ConfirmSubmitModal } from "./_components/ConfirmSubmitModal";

// ─── Types & Constants ───────────────────────────────────────────────────────

type AttendanceDecision = "present" | "excused" | "absent";

interface StudentRecord {
  id: string;
  name: string;
  loginTime: string | null;
  decision: AttendanceDecision;
  score: string;
  notes: string;
  secret_note: string;
  group: string;
  subject: string;
}

const MAX_SCORE = 100;
const MEET_LINK = "";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGradeLabel(
  score: string,
  max: number,
  t: (key: string) => string
): { label: string; color: string } {
  if (!score || score.trim() === "") return { label: t("gradeAbsent"), color: "text-destructive" };
  const pct = (parseFloat(score) / max) * 100;
  if (pct >= 90) return { label: t("gradeExcellent"), color: "text-success-600" };
  if (pct >= 75) return { label: t("gradeVeryGood"), color: "text-warning-600" };
  if (pct >= 65) return { label: t("gradeGood"), color: "text-amber-600" };
  if (pct >= 50) return { label: t("gradePass"), color: "text-info-600" };
  return { label: t("gradeFail"), color: "text-destructive" };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TeacherSessionsPage() {
  const t = useTranslations("teacherBoard");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const { data: dashboardData, isLoading: isDashboardLoading } = useTeacherDashboard();

  const rawSessionId = searchParams.get("session") || searchParams.get("sessionId");
  const urlSessionId = (rawSessionId === "undefined" || rawSessionId === "null") ? "" : (rawSessionId || "");

  const rawGroupId = searchParams.get("group") || searchParams.get("groupId");
  const groupId = (rawGroupId === "undefined" || rawGroupId === "null") ? "" : (rawGroupId || "");

  // Resolve session ID
  let resolvedSessionId = urlSessionId || "";
  if (!resolvedSessionId && groupId && dashboardData?.today_sessions) {
    const matchingSession = dashboardData.today_sessions.find((s: any) => {
      const isGroupIdMatch = s.group_id ? String(s.group_id) === String(groupId) : false;
      const isIdMatch = String(s.id) === String(groupId);
      
      // Fallback matching by comparing names
      let isNameMatch = false;
      if (dashboardData.groups) {
        const matchingGroup = dashboardData.groups.find((g: any) => String(g.id) === String(groupId));
        if (matchingGroup) {
          isNameMatch = s.group_name === matchingGroup.name || s.name === matchingGroup.name;
        }
      }
      return isGroupIdMatch || isIdMatch || isNameMatch;
    });

    if (matchingSession) {
      const foundId = matchingSession.session_id || matchingSession.id;
      if (foundId && String(foundId) !== "undefined" && String(foundId) !== "null") {
        resolvedSessionId = String(foundId);
      }
    }
  }

  // Final fallback to "2" only if dashboard has loaded and we still have no session ID
  const sessionId = resolvedSessionId || (isDashboardLoading ? "" : "2");

  const [meetingUrl, setMeetingUrl] = useState(MEET_LINK);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(MEET_LINK);
  const [savingUrl, setSavingUrl] = useState(false);



  const [roster, setRoster] = useState<StudentRecord[]>([]);
  const [locked, setLocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<StudentRecord | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<StudentRecord | null>(null);

  const { data: attendanceRes, isLoading: isAttendanceLoading, refetch: refetchAttendance } = useTeacherSessionAttendance(sessionId, {
    refetchInterval: 30000, // Refetch every 30 seconds to get new student submissions
  });

  // Resolve group ID from dashboard or attendance API if query param is session ID or empty
  let resolvedGroupId = groupId;
  if ((!resolvedGroupId || resolvedGroupId === sessionId) && dashboardData) {
    const matchingSession = (dashboardData.today_sessions || []).find(
      (s: any) => String(s.session_id || s.id) === String(sessionId)
    );
    if (matchingSession) {
      const gId = matchingSession.group_id || matchingSession.group?.id;
      if (gId) {
        resolvedGroupId = String(gId);
      } else {
        // Fallback: match by group name
        const matchingGroup = (dashboardData.groups || []).find(
          (g: any) => g.name === matchingSession.group_name || g.name === matchingSession.name
        );
        if (matchingGroup) {
          resolvedGroupId = String(matchingGroup.id);
        }
      }
    }
  }
  if (!resolvedGroupId || resolvedGroupId === sessionId) {
    const apiGroupId = (attendanceRes?.[0]?.session as any)?.group_id || (attendanceRes?.[0]?.session as any)?.group?.id;
    if (apiGroupId) {
      resolvedGroupId = String(apiGroupId);
    }
  }

  const { data: groupDetailsData } = useTeacherGroupStudents(resolvedGroupId);

  // Resolve group name from dashboard, group details or attendance data
  let resolvedGroupName = "";

  if (dashboardData) {
    // 1. Try to find the matching group in groups list by resolvedGroupId
    if (resolvedGroupId) {
      const matchingGroup = (dashboardData.groups || []).find(
        (g: any) => String(g.id) === String(resolvedGroupId)
      );
      if (matchingGroup) {
        resolvedGroupName = matchingGroup.name;
      }
    }

    // 2. Try to find in today_sessions
    if (!resolvedGroupName) {
      const matchingSession = (dashboardData.today_sessions || []).find(
        (s: any) =>
          String(s.session_id || s.id) === String(sessionId) ||
          String(s.group_id || s.group?.id) === String(resolvedGroupId)
      );
      if (matchingSession) {
        resolvedGroupName = matchingSession.group_name || matchingSession.name || matchingSession.group?.name;
      }
    }
  }

  // 3. Try to get it from the attendance API response
  if (!resolvedGroupName && attendanceRes && attendanceRes.length > 0) {
    const sessionObj = attendanceRes[0].session as any;
    if (sessionObj) {
      resolvedGroupName = sessionObj.group?.name || sessionObj.group_name || sessionObj.name;
    }
  }

  // 4. Try to get it from the group details query
  if (!resolvedGroupName && groupDetailsData) {
    resolvedGroupName = groupDetailsData.group_name;
  }

  const groupName = resolvedGroupName
    ? (resolvedGroupName === "مجموعة النور" || resolvedGroupName === "Al-Noor Group" ? t("groupNoor") : resolvedGroupName)
    : (resolvedGroupId === "24711"
        ? t("groupNoor")
        : (resolvedGroupId
            ? t("groupNo", { id: resolvedGroupId })
            : t("allGroups")
          )
      );
  const trackName = t("trackTajweed");
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const subtitle = t("sessionSubtitle", { date: formattedDate, track: trackName });

  // Reset roster and locked state when session ID changes to avoid leaking states across sessions
  useEffect(() => {
    setRoster([]);
    setLocked(false);
  }, [sessionId]);

  // Auto-lock table if attendance has already been recorded in database
  useEffect(() => {
    if (attendanceRes && attendanceRes.length > 0) {
      const isAlreadyRecorded = attendanceRes.some(
        (record) => record.recorded_by !== null && record.recorded_by !== undefined
      );
      if (isAlreadyRecorded) {
        setLocked(true);
      }
    }
  }, [attendanceRes]);

  // Sync state when attendance API responds
  useEffect(() => {
    if (attendanceRes) {
      const mapped = attendanceRes.map((record) => {
        let decision: AttendanceDecision = "present";
        if (record.status_id === "2" || record.status_id === 2 || record.status?.name === "absent") {
          decision = "absent";
        } else if (record.status_id === "3" || record.status_id === 3 || record.status?.name === "excused") {
          decision = "excused";
        }

        return {
          id: record.student_id.toString(),
          name: record.student.full_name,
          loginTime: (record.status_id === 1 || record.status_id === "1" || record.status?.name === "present") ? "دخلن للرابط" : null,
          decision,
          score: record.points ? parseFloat(record.points.toString()).toString() : "0",
          notes: record.comment || "",
          secret_note: record.secret_note || "",
          group: resolvedGroupName 
            ? (resolvedGroupName === "مجموعة النور" || resolvedGroupName === "Al-Noor Group" ? t("groupNoor") : resolvedGroupName) 
            : (resolvedGroupId === "24711" 
                ? t("groupNoor") 
                : (resolvedGroupId 
                    ? t("groupNo", { id: resolvedGroupId }) 
                    : t("sessionNo", { id: record.session_id })
                  )
              ),
          subject: "التلاوة والتجويد",
        };
      });

      setRoster((prevRoster) => {
        // Initial load or after session reset
        if (!prevRoster || prevRoster.length === 0) {
          return mapped;
        }

        // Merge incoming records to preserve unsaved teacher modifications while capturing new student check-ins
        return mapped.map((newStudent) => {
          const existingStudent = prevRoster.find((s) => s.id === newStudent.id);
          if (!existingStudent) {
            return newStudent;
          }

          // Check if student newly checked in on the backend
          const hasNewLogin = newStudent.loginTime !== null && existingStudent.loginTime === null;

          return {
            ...existingStudent,
            group: newStudent.group,
            loginTime: newStudent.loginTime || existingStudent.loginTime,
            decision: hasNewLogin ? "present" : existingStudent.decision,
          };
        });
      });
    }
  }, [attendanceRes, resolvedGroupId, resolvedGroupName, t]);

  // Sync Meeting URL if present (with fallbacks if roster is empty)
  useEffect(() => {
    // 1. Try to get it from attendance records
    const sessionData = attendanceRes?.[0]?.session as any;
    let resolvedUrl = sessionData?.url || sessionData?.meeting_link;

    // 2. Try to get it from the matching session in dashboard today_sessions
    if (!resolvedUrl && dashboardData?.today_sessions) {
      const matchingSession = dashboardData.today_sessions.find(
        (s: any) => String(s.session_id || s.id) === String(sessionId)
      );
      if (matchingSession) {
        resolvedUrl = matchingSession.url || matchingSession.meeting_link;
      }
    }

    if (resolvedUrl) {
      setMeetingUrl(resolvedUrl);
      setTempUrl(resolvedUrl);
    }
  }, [attendanceRes, dashboardData, sessionId]);

  // Submit Attendance Mutation
  const queryClient = useQueryClient();
  const submitAttendanceMutation = useMutation({
    mutationFn: (payload: any) => teacherService.submitSessionAttendance(sessionId, payload),
    onSuccess: (res) => {
      toast.success(res?.message || t("gradesSaved") || "تم الحفظ بنجاح");
      queryClient.invalidateQueries({ queryKey: ["teacher", "sessionAttendance", sessionId] });
      refetchAttendance();
      setLocked(true);
      setShowConfirmModal(false);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.message || t("attendanceError") || "فشل في حفظ سجل الحضور");
      setShowConfirmModal(false);
    },
  });

  const handleSaveUrl = async () => {
    if (!tempUrl.trim()) return;
    setSavingUrl(true);
    try {
      await teacherService.updateSessionUrl(sessionId, tempUrl);
      setMeetingUrl(tempUrl);

      toast.success(t("sessionUrlUpdated"));

      setIsEditingUrl(false);
    } catch (error) {
      console.error("Failed to update session URL", error);
      toast.error(t("sessionUrlUpdateError"));
    } finally {
      setSavingUrl(false);
    }
  };

  const handleScoreChange = (id: string, value: string) => {
    if (value !== "" && (!/^\d*\.?\d*$/.test(value) || parseFloat(value) > MAX_SCORE)) return;
    setRoster((prev) => prev.map((s) => (s.id === id ? { ...s, score: value } : s)));
  };

  const handleNotesChange = (id: string, value: string) => {
    setRoster((prev) => prev.map((s) => (s.id === id ? { ...s, notes: value } : s)));
  };

  const handleSaveNote = () => {
    if (selectedStudentForNote) {
      setRoster((prev) =>
        prev.map((s) =>
          s.id === selectedStudentForNote.id ? { ...s, secret_note: noteContent } : s
        )
      );
      toast.success(t("savedSuccessfully") || "تم حفظ التعديل بنجاح");
      setShowNoteDialog(false);
      setNoteContent("");
      setSelectedStudentForNote(null);
    }
  };

  const setDecision = (id: string, decision: AttendanceDecision) => {
    if (locked) return;
    setRoster((prev) => prev.map((s) => (s.id === id ? { ...s, decision } : s)));
  };

  const markAllPresent = () => {
    if (locked) return;
    setRoster((prev) => prev.map((s) => ({ ...s, decision: "present" })));
  };

  const handleConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleActualSubmit = () => {
    const statusIdMap = {
      present: 1,
      absent: 2,
      excused: 3,
    };

    const payload = {
      attendance: roster.map((s) => ({
        student_id: Number(s.id),
        status_id: statusIdMap[s.decision],
        comment: s.notes || null,
        secret_note: s.secret_note || null,
        points: parseFloat(s.score) || 0,
      })),
    };

    submitAttendanceMutation.mutate(payload);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isAttendanceLoading) {
    return (
      <div className="space-y-8 w-full pb-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-10 h-10 rounded-2xl" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-72 ms-[52px]" />
          </div>
          <Skeleton className="w-48 h-10 rounded-2xl self-start" />
        </div>


        {/* Table Skeleton */}
        <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6 border-b border-border/50 pb-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="w-32 h-10 rounded-full" />
              <Skeleton className="w-24 h-10 rounded-full" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 pb-2 border-b border-border/50 hidden md:grid">
              <Skeleton className="col-span-3 h-4" />
              <Skeleton className="col-span-3 h-4" />
              <Skeleton className="col-span-2 h-4" />
              <Skeleton className="col-span-3 h-4" />
              <Skeleton className="col-span-1 h-4" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border border-border/40 rounded-2xl">
                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="col-span-1 md:col-span-3 flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
                <div className="col-span-1 md:col-span-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
                <div className="col-span-1 md:col-span-1 flex justify-end">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredRoster = roster;

  const detectedCount = filteredRoster.filter((s) => s.loginTime !== null).length;
  const presentCount = filteredRoster.filter((s) => s.decision === "present").length;

  return (
    <div className="animate-in fade-in duration-500 space-y-8 w-full pb-10">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <SessionHeader
        groupName={groupName}
        subtitle={subtitle}
        isEditingUrl={isEditingUrl}
        meetingUrl={meetingUrl}
        tempUrl={tempUrl}
        setTempUrl={setTempUrl}
        setIsEditingUrl={setIsEditingUrl}
        handleSaveUrl={handleSaveUrl}
        handleCopyLink={handleCopyLink}
        copied={copied}
        savingUrl={savingUrl}
        t={t}
      />

      {/* ── Smart Attendance & Grades Table ─────────────────────────────── */}
      <SessionRosterTable
        filteredRoster={filteredRoster}
        detectedCount={detectedCount}
        presentCount={presentCount}
        locked={locked}
        setLocked={setLocked}
        markAllPresent={markAllPresent}
        setDecision={setDecision}
        handleScoreChange={handleScoreChange}
        handleNotesChange={handleNotesChange}
        setSelectedStudentForNote={setSelectedStudentForNote}
        setNoteContent={setNoteContent}
        setShowNoteDialog={setShowNoteDialog}
        setSelectedStudentDetails={setSelectedStudentDetails}
        handleConfirm={handleConfirm}
        isPending={submitAttendanceMutation.isPending}
        maxScore={MAX_SCORE}
        getGradeLabel={(score, max) => getGradeLabel(score, max, t)}
        t={t}
      />

      {/* Secret Note Dialog */}
      <SecretNoteModal
        showNoteDialog={showNoteDialog}
        studentName={selectedStudentForNote?.name || ""}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        setShowNoteDialog={setShowNoteDialog}
        handleSaveNote={handleSaveNote}
        locked={locked}
      />

      {/* Confirm Submit Dialog */}
      <ConfirmSubmitModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleActualSubmit}
        isPending={submitAttendanceMutation.isPending}
      />

      {/* Student Details Sidebar */}
      <StudentDetailsSidebar
        student={selectedStudentDetails}
        setSelectedStudentDetails={setSelectedStudentDetails}
        maxScore={MAX_SCORE}
        getGradeLabel={(score, max) => getGradeLabel(score, max, t)}
        t={t}
      />
    </div>
  );
}
