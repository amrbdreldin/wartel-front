// ============================================================
// Parent Types
// ============================================================

export interface ChildCard {
  id: string;
  name: string;
  age: number;
  group_name: string;
  active_notifications: number;
  avatar?: string;
}

export interface ParentDashboard {
  children: ChildCard[];
}

export interface RegisterChildRequest {
  full_name: string;
  age: number;
  preferred_session_time?: string;
}

/** A session one of the children attends today (parent/children → today_sessions) */
export interface ParentTodaySession {
  session_id: number;
  group_name: string;
  teacher_name: string;
  scheduled_at: string;
  status: string;
  url: string;
  children_names: string[];
}

/** Values of the "add child / student" form (parent and teacher dashboards) */
export interface AddChildFormValues {
  full_name: string;
  age: string;
  phone: string;
  password: string;
  password_confirmation: string;
  user_type: string;
  enrollment_type_id: string;
  selected_track_id: string;
  selected_group_id: string;
  quran_audio: File | null;
  quran_audio_duration: number | undefined;
}
