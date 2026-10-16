// ============================================================
// Exam draft storage – keeps in-progress exam answers in localStorage
// so a refresh, crash or accidental exit doesn't lose them.
// ============================================================

export interface ExamDraft {
  examId: string;
  savedAt: number;
  currentStep: number;
  answers: Record<string, string | number>;
}

const EXAM_DRAFT_PREFIX = "wartel_exam_draft_";
const EXAM_DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const getKey = (examId: string) => `${EXAM_DRAFT_PREFIX}${examId}`;

export function getExamDraft(examId: string): ExamDraft | null {
  if (typeof window === "undefined" || !examId) return null;
  try {
    const raw = localStorage.getItem(getKey(examId));
    if (!raw) return null;
    const draft: ExamDraft = JSON.parse(raw);
    if (!draft || typeof draft.savedAt !== "number" || !draft.answers) {
      localStorage.removeItem(getKey(examId));
      return null;
    }
    if (Date.now() - draft.savedAt > EXAM_DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(getKey(examId));
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function saveExamDraft(examId: string, data: Pick<ExamDraft, "answers" | "currentStep">): void {
  if (typeof window === "undefined" || !examId) return;
  try {
    const draft: ExamDraft = { examId, savedAt: Date.now(), ...data };
    localStorage.setItem(getKey(examId), JSON.stringify(draft));
  } catch {
    // Storage full or blocked – the exam still works, just without a draft
  }
}

export function clearExamDraft(examId: string): void {
  if (typeof window === "undefined" || !examId) return;
  try {
    localStorage.removeItem(getKey(examId));
  } catch {
    // ignore
  }
}
