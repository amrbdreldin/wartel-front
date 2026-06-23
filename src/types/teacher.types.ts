import { AttendanceStatus, RequestStatus } from "./enums";

// ============================================================
// Teacher Types
// ============================================================

export interface TeacherGroup {
  id: string;
  name: string;
  student_count: number;
  schedule: string;
  meeting_link?: string;
}

export interface AttendanceEntry {
  student_id: string;
  student_name: string;
  status: AttendanceStatus;
  auto_detected: boolean;
}

export interface GradeEntry {
  student_id: string;
  student_name: string;
  score: number;
  max_score: number;
}

export interface TeacherRequest {
  id: string;
  type: "absence" | "postponement";
  start_date: string;
  end_date: string;
  reason: string;
  status: RequestStatus;
  created_at: string;
}

export interface SubmitAttendancePayload {
  group_id: string;
  session_date: string;
  entries: Array<{
    student_id: string;
    status: AttendanceStatus;
  }>;
}

export interface SubmitGradesPayload {
  group_id: string;
  exam_name: string;
  entries: Array<{
    student_id: string;
    score: number;
  }>;
}

export interface TeacherAbsenceRequest {
  type: "absence" | "postponement";
  start_date: string;
  end_date: string;
  reason: string;
}

export interface TeacherNote {
  id: string;
  student_id: string;
  content: string;
  created_at: string;
}

export interface TeacherDashboardGroup {
  id: number;
  name: string;
  student_count: number;
  session_days: Array<{
    day: string;
    time: string;
  }>;
}

export interface TeacherDashboardData {
  total_groups: number;
  total_students: number;
  today_sessions_count: number;
  today_sessions: any[];
  groups: TeacherDashboardGroup[];
}

export interface TeacherGroupStudent {
  student_id: number;
  full_name: string;
}

export interface TeacherGroupWithStudents {
  group_id: number;
  name: string;
  track_id: string;
  course_id: string;
  track: {
    id: number;
    name: string;
  };
  course: {
    id: number;
    name: string;
  };
  students: TeacherGroupStudent[];
}

export interface StudentSessionNote {
  session_id: string;
  scheduled_at: string;
  comment: string | null;
  secret_comment: string | null;
}

export interface GroupStudentDetail {
  id: number;
  name: string;
  average_score: number;
  track_name: string;
  session_notes: StudentSessionNote[];
}

export interface GroupStudentsDetailResponse {
  group_id: number;
  group_name: string;
  track_name: string;
  students: GroupStudentDetail[];
}

export interface SessionAttendanceStatus {
  id: number;
  name: string;
}

export interface SessionAttendanceStudent {
  id: number;
  full_name: string;
}

export interface SessionAttendanceSession {
  id: number;
  scheduled_at: string;
}

export interface SessionAttendanceRecord {
  attendance_id: number | null;
  session_id: string | number;
  student_id: string | number;
  status_id: string | number | null;
  status: SessionAttendanceStatus | null;
  secret_note: string | null;
  comment: string | null;
  points: string | number;
  recorded_by: string | number | null;
  recorder: { id: number; full_name: string } | null;
  student: SessionAttendanceStudent;
  session: SessionAttendanceSession;
}

export interface SubmitSessionAttendanceItem {
  student_id: number;
  status_id: number;
  comment: string | null;
  secret_note: string | null;
  points: number;
}

export interface SubmitSessionAttendancePayload {
  attendance: SubmitSessionAttendanceItem[];
}
