export interface StudentDraftData {
  decision?: "present" | "excused" | "absent";
  score?: string;
  notes?: string;
  secret_note?: string;
}

export interface SessionAttendanceDraft {
  sessionId: string;
  savedAt: number;
  students: Record<string, StudentDraftData>;
  isExam?: boolean;
}

export const DRAFT_STORAGE_PREFIX = "wartel_session_attendance_draft_";
export const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours (1 day)

/**
 * Returns the storage key for a session's attendance draft.
 */
export function getSessionDraftKey(sessionId: string): string {
  return `${DRAFT_STORAGE_PREFIX}${sessionId}`;
}

/**
 * Retrieves the saved session draft from localStorage.
 * Automatically discards and deletes drafts older than 24 hours (1 day).
 */
export function getSessionDraft(sessionId: string): SessionAttendanceDraft | null {
  if (typeof window === "undefined" || !sessionId) return null;

  try {
    const key = getSessionDraftKey(sessionId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const draft: SessionAttendanceDraft = JSON.parse(raw);

    if (!draft || typeof draft.savedAt !== "number" || !draft.students) {
      localStorage.removeItem(key);
      return null;
    }

    // Check expiration: valid for only 1 day (24 hours)
    const isExpired = Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS;
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return draft;
  } catch (error) {
    console.error("Failed to read session attendance draft from localStorage:", error);
    return null;
  }
}

/**
 * Saves or updates a session attendance draft in localStorage with a timestamp.
 */
export function saveSessionDraft(
  sessionId: string,
  data: {
    students: Record<string, StudentDraftData>;
    isExam?: boolean;
  }
): void {
  if (typeof window === "undefined" || !sessionId) return;

  try {
    const key = getSessionDraftKey(sessionId);
    const draft: SessionAttendanceDraft = {
      sessionId,
      savedAt: Date.now(),
      students: data.students,
      isExam: data.isExam,
    };
    localStorage.setItem(key, JSON.stringify(draft));
  } catch (error) {
    console.error("Failed to save session attendance draft to localStorage:", error);
  }
}

/**
 * Clears the session attendance draft from localStorage.
 * Called when attendance is submitted or manually discarded.
 */
export function clearSessionDraft(sessionId: string): void {
  if (typeof window === "undefined" || !sessionId) return;

  try {
    const key = getSessionDraftKey(sessionId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove session attendance draft from localStorage:", error);
  }
}

/**
 * Checks if a valid, non-expired draft exists for this session.
 */
export function hasValidSessionDraft(sessionId: string): boolean {
  return getSessionDraft(sessionId) !== null;
}
