import { UserRole } from "./enums";

// ─── /register-data endpoint types ─────────────────────────────
export interface FormDataSessionDay {
  id: number;
  group_id: string | number;
  day: string;
  time: string;
}

export interface FormDataPendingGroup {
  id: number;
  type?: string;
  track_id: string | number;
  course_id: string | number;
  teacher_id: string | number;
  name: string;
  session_time: string | null;
  end_date: string | null;
  is_active: string | number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  session_days: FormDataSessionDay[];
}

export interface FormDataTrack {
  id: number;
  enrollment_type_id: string | number;
  name: string;
  is_active: string | number;
  is_for_teachers: string | number;
  created_at: string;
  deleted_at: string | null;
  pending_groups: FormDataPendingGroup[];
}

export interface FormDataUserRole {
  id: number;
  name: string;
}

export interface FormDataEnrollmentType {
  id: number;
  name: string;
  tracks: FormDataTrack[];
}

export interface RegisterFormData {
  tracks?: FormDataTrack[];
  user_roles: FormDataUserRole[];
  enrollment_types: FormDataEnrollmentType[];
}

// ============================================================
// Auth Types
// ============================================================

export interface User {
  id: string | number;
  full_name: string;
  email?: string;
  phone: string;
  telegram_username?: string;
  role?: UserRole;
  role_id?: string | number;
  status_id?: string | number;
  avatar?: string;
  is_active?: boolean;
  age?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
  recaptcha_token?: string;
  firebase_token?: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
  access_token?: string;
  refresh_token?: string;
}

export interface InitiatePasswordResetResponse {
  phone_exists: boolean;
  account_status: string;
}

export interface RegisterRequest {
  full_name: string;
  age: number;
  phone: string;
  telegram_username?: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: "student" | "parent";
  preferred_session_time?: string;
  preferred_rafeqa_time?: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterDataResponse {
  tracks: FormDataTrack[];
}

