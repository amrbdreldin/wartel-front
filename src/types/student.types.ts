import { ExcuseStatus, NotificationType, TamamStatus } from "./enums";

// ============================================================
// Student Types
// ============================================================

export interface SessionCard {
  id: string;
  group_name: string;
  teacher_name: string;
  date: string;
  time: string;
  meeting_link?: string;
  is_joinable: boolean; // true if within 30 min before start
}

export interface TamamCard {
  id: string;
  rafeqa_name: string;
  status: TamamStatus;
  week_start: string;
  week_end: string;
}

export interface GradeRecord {
  id: string;
  exam_name: string;
  subject: string;
  score: number;
  max_score: number;
  percentage: number;
  date: string;
}

export interface ExcuseRecord {
  id: string;
  type: "limited_leave" | "exam_postponement" | "other"; // session_absence removed
  reason: string;
  status: ExcuseStatus;
  created_at: string;
  reviewed_at?: string;
}

export interface WarningRecord {
  id: string;
  violation_type: string;
  remaining_chances: number;
  issued_at: string;
  message: string;
}

export interface StudentDashboard {
  notifications: StudentNotification[];
  next_session: SessionCard | null;
  weekly_tamam: TamamCard | null;
  latest_grade: GradeRecord | null;
  active_warnings: WarningRecord[];
}

export interface StudentNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface LibraryCourse {
  id: number;
  name: string;
}

export interface LibraryTrack {
  id: number;
  name: string;
}

export interface LibraryResource {
  resource_id: number;
  title: string;
  content_type_id: string;
  content_type_name: "pdf" | "video" | string;
  resource_url: string;
  created_at: string;
  course: LibraryCourse;
  track: LibraryTrack;
}

/** resources is a dict keyed by content_type_id ("1" = pdf, "2" = video …) */
export interface LibraryResponseData {
  resources: Record<string, LibraryResource[]>;
}

export interface RafeqaRating {
  quality: "good" | "very_good" | "excellent";
}

export interface TamamSubmission {
  tamam_id: string;
  confirmed: boolean;
  rating?: RafeqaRating;
}

export interface ExcuseSubmission {
  start_date: string;
  end_date: string;
  reason: string;
}

export interface StudentSettings {
  email: string;
  phone: string;
  telegram_username?: string;
  preferred_session_time?: string;
  preferred_rafeqa_time?: string;
}

export type RegistrationPath = "academy" | "institute";
export type StudentLevel = "beginner" | "intermediate" | "advanced" | "excellent";

export interface StudentProfile {
  id: string;
  name: string;
  path: RegistrationPath;
  level: StudentLevel;
  companion_name?: string; // الرفيقة
  enrolled_courses: string[];
  badges: string[];
}

export interface ExamCourseDetails {
  id: number;
  name: string;
}

export interface ExamDetails {
  id: number;
  title: string;
  description: string | null;
  course: ExamCourseDetails;
}

export interface ExamGroupDetails {
  id: number;
  name: string;
}

export interface ExamSessionDetails {
  id: number;
  scheduled_at: string;
  group: ExamGroupDetails;
}

export interface ExamResult {
  exam_result_id: number;
  score: number;
  created_at: string;
  comment: string;
  exam: ExamDetails;
  session: ExamSessionDetails;
}

export interface ExamGradesResponseData {
  exam_results: ExamResult[];
  total_exams: number;
  average_score: number;
}

export interface LeaveStatus {
  id: number;
  name: string;
}

export interface LeaveRecord {
  leave_id: number;
  student_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  admin_notes: string | null;
  status: LeaveStatus;
  status_id: string;
  created_at: string;
}

export interface StudentLeavesResponseData {
  leaves: LeaveRecord[];
}

export interface TamamRecord {
  tamam_id: number;
  pair_id: string | number;
  student_id: string | number;
  buddy_id: string;
  buddy_name: string;
  tamam_date: string;
  past_status_id: string | number;
  past_status_name: string;
  present_status_id: string | number;
  present_status_name: string;
  confirmed_at: string | null;
}

export interface TamamHistoryResponseData {
  history: TamamRecord[];
}

export interface TamamSubmissionRequest {
  pair_id: string | null;
  past_status_id: number;
  present_status_id: number;
}

export interface DashboardAlert {
  id: number;
  student_id: string;
  level_id: string;
  reason_id: string;
  status_id: string;
  issued_at: string;
  deleted_at: string | null;
}

export interface DashboardBuddy {
  id: number;
  full_name: string;
  phone: string;
  role_id: string;
  status_id: string;
  parent_id: string | null;
  enrollment_type_id: string;
  badge_id: string | null;
  timezone: string;
  fcm_token: string | null;
  otp: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DashboardTamamCard {
  buddy: DashboardBuddy;
  status: {
    presentStatus: string;
    pastStatus: string;
  };
}

export interface DashboardExam {
  id: number;
  title: string;
  track_id: string;
  course_id: string;
  is_oral: string;
  total_marks: string;
  created_at: string;
  deleted_at: string | null;
}

export interface DashboardGroup {
  id: number;
  track_id: string;
  course_id: string;
  teacher_id: string;
  name: string;
  session_time: string;
  end_date: string | null;
  is_active: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DashboardSessionStudent {
  id: number;
  session_id: string;
  student_id: string;
  secret_comment: string;
  comment: string;
  created_at: string;
}

export interface DashboardSession {
  id: number;
  group_id: string;
  teacher_id: string;
  scheduled_at: string;
  status_id: string;
  url: string | null;
  created_at: string;
  deleted_at: string | null;
  group: DashboardGroup;
  session_student: DashboardSessionStudent;
}

export interface DashboardLastGrade {
  id: number;
  exam_id: string;
  user_id: string;
  session_id: string;
  score: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  exam: DashboardExam;
  session: DashboardSession;
}

export interface StudentDashboardResponseData {
  next_session: any | null;
  tamam_card: DashboardTamamCard | null;
  last_grade: DashboardLastGrade | null;
  alerts: DashboardAlert[];
  next_exam: DashboardExam | null;
}

export interface ExamQuestionOption {
  id: number;
  option_text: string;
}

export interface ExamQuestion {
  id: number;
  question_text: string;
  media_url: string | null;
  mark: string;
  code: "true&false" | "choose" | "text" | "sound" | string;
  type: string;
  options: ExamQuestionOption[];
}

export interface ExamDetails {
  id: number;
  title: string;
  date_from: string;
  date_to: string;
  degree: string;
  questions: ExamQuestion[];
}

export interface ExamSubmitResponse {
  degree: number;
  total_marks: string;
}

export interface ExamResultQuestion {
  id: number;
  question_text: string;
  media_url: string | null;
  total_mark: string;
  earned_mark: string;
  is_correct: boolean;
  student_selected_option_id: string | null;
  correct_option_id: number | null;
  options: ExamQuestionOption[];
}

export interface ExamResultData {
  exam_title: string;
  total_score: string;
  total_marks: string;
  questions: ExamResultQuestion[];
}

export interface StudentProfileDetail {
  id: number;
  full_name: string;
  phone: string;
  role: string;
  status: string;
  enrollment_type: string;
  badge: string | null;
  timezone: string;
  created_at: string;
  role_id?: string | number;
}

export interface AttendanceRecord {
  session_id: string;
  scheduled_at: string;
  status: "present" | "absent" | "excused" | string;
  points: string;
  comment: string | null;
}

export interface ExamDegreeRecord {
  exam_id: string;
  exam_title: string;
  total_marks: string;
  score: string;
  created_at: string;
}

export interface JoinedGroupRecord {
  group_id: number;
  group_name: string;
  is_active: string;
  enrollment_date: string;
  attendance: AttendanceRecord[];
  exam_degrees: ExamDegreeRecord[];
  certifications: any[];
  leaves_requests: any[];
  buddy_pairs: any[];
  daily_tamam: any[];
  warnings: any[];
}

export interface StudentDetailedProfileResponse {
  profile: StudentProfileDetail;
  joined_groups: JoinedGroupRecord[];
}

export interface WarningListItem {
  id: number;
  student_id: number;
  level_id: number;
  level_name: string;
  reason_id: number;
  reason_name: string;
  status_id: number;
  status_name: string;
  issued_at: string;
  type?: "good" | "bad" | string;
}

export interface WerdMedia {
  id: number;
  title: string;
  type: "sound" | "video" | "youtube" | "url" | "image";
  file: string;
}

export interface WerdRecord {
  id: number;
  title: string;
  track_id: string;
  track_name: string;
  tdbor: string | null;
  description: string;
  image: string | null;
  similar: string;
  have_exams: boolean;
  created_at: string;
  media: WerdMedia[];
}
