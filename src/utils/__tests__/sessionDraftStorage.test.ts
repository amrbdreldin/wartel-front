import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSessionDraft,
  saveSessionDraft,
  clearSessionDraft,
  hasValidSessionDraft,
  getSessionDraftKey,
  DRAFT_MAX_AGE_MS,
} from "../sessionDraftStorage";

describe("sessionDraftStorage", () => {
  const sessionId = "123";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return null when no draft exists", () => {
    expect(getSessionDraft(sessionId)).toBeNull();
    expect(hasValidSessionDraft(sessionId)).toBe(false);
  });

  it("should save and retrieve a valid draft", () => {
    const draftData = {
      students: {
        "10": {
          decision: "present" as const,
          score: "95",
          notes: "ممتازة جداً",
          secret_note: "تحتاج متابعة تجويد النون الساكنة",
        },
      },
      isExam: true,
    };

    saveSessionDraft(sessionId, draftData);

    const retrieved = getSessionDraft(sessionId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.sessionId).toBe(sessionId);
    expect(retrieved?.isExam).toBe(true);
    expect(retrieved?.students["10"]).toEqual(draftData.students["10"]);
    expect(hasValidSessionDraft(sessionId)).toBe(true);
  });

  it("should discard and remove draft if older than 24 hours (1 day)", () => {
    const draftData = {
      students: {
        "10": {
          decision: "absent" as const,
          score: "0",
          notes: "غياب بعذر",
          secret_note: "",
        },
      },
      isExam: false,
    };

    // Save initial draft
    saveSessionDraft(sessionId, draftData);

    // Mock Date.now() to be 25 hours later
    const futureTime = Date.now() + DRAFT_MAX_AGE_MS + 3600 * 1000;
    vi.spyOn(Date, "now").mockReturnValue(futureTime);

    // Should return null because it's expired
    expect(getSessionDraft(sessionId)).toBeNull();
    expect(hasValidSessionDraft(sessionId)).toBe(false);

    // Verify localStorage item was deleted
    const key = getSessionDraftKey(sessionId);
    expect(localStorage.getItem(key)).toBeNull();
  });

  it("should clear the draft when clearSessionDraft is called", () => {
    saveSessionDraft(sessionId, {
      students: {
        "1": { decision: "present", score: "100", notes: "test", secret_note: "" },
      },
      isExam: false,
    });

    expect(hasValidSessionDraft(sessionId)).toBe(true);

    clearSessionDraft(sessionId);

    expect(hasValidSessionDraft(sessionId)).toBe(false);
    expect(getSessionDraft(sessionId)).toBeNull();
  });

  it("should handle invalid JSON in localStorage gracefully without throwing", () => {
    const key = getSessionDraftKey(sessionId);
    localStorage.setItem(key, "invalid-json-string{");

    expect(getSessionDraft(sessionId)).toBeNull();
  });
});
