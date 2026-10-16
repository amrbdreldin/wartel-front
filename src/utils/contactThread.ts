import type { ContactMessage, ContactThreadStatus } from "@/types/contact.types";

// ============================================================
// Contact Thread Helpers – status checks & attachment rules
// ============================================================

export const THREAD_STATUS = {
  PENDING_ADMIN: "pending_admin",
  PENDING_USER: "pending_user",
  CLOSED: "closed",
} as const;

/** Backend sometimes returns the status in different casing */
export function normalizeThreadStatus(status?: ContactThreadStatus | null): string {
  return String(status ?? "").toLowerCase();
}

export const isThreadPendingAdmin = (status?: ContactThreadStatus | null) =>
  normalizeThreadStatus(status) === THREAD_STATUS.PENDING_ADMIN;

export const isThreadPendingUser = (status?: ContactThreadStatus | null) =>
  normalizeThreadStatus(status) === THREAD_STATUS.PENDING_USER;

export const isThreadClosed = (status?: ContactThreadStatus | null) =>
  normalizeThreadStatus(status) === THREAD_STATUS.CLOSED;

/** Short locale-aware date + time; empty string for missing/invalid dates */
export function formatThreadDate(dateStr: string | null | undefined, locale: string, withYear = false): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(locale, {
    year: withYear ? "numeric" : undefined,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Attachments ─────────────────────────────────────────────

export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const ATTACHMENT_ACCEPT = "image/png,image/jpeg,image/webp";

/** Returns the contactUs translation key of the error, or null when the file is valid */
export function validateAttachment(file: File): "invalidFileType" | "fileTooLarge" | null {
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) return "invalidFileType";
  if (file.size > MAX_ATTACHMENT_SIZE) return "fileTooLarge";
  return null;
}

/** Only absolute http(s) or root-relative URLs can be rendered by next/image */
export function getAttachmentUrl(message: Pick<ContactMessage, "file" | "file_url">): string | null {
  const url = message.file_url || message.file;
  if (!url) return null;
  return /^https?:\/\//i.test(url) || url.startsWith("/") ? url : null;
}
