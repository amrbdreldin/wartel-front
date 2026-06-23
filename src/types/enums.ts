// ============================================================
// Shared Enums
// ============================================================

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  PARENT = "parent",
}

export enum ExcuseStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  EXCUSED = "excused",
}

export enum TamamStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  ABSENT = "absent",
}

export enum WarningLevel {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FINAL = 4,
}

export enum ExamDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success",
  DANGER = "danger",
}

export enum RequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ActionType {
  FREEZE = "freeze",
  EXCLUDE = "exclude",
  RETURN = "return",
  DELETE = "delete",
}
