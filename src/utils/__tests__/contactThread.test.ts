import { describe, expect, it } from "vitest";
import {
  MAX_ATTACHMENT_SIZE,
  getAttachmentUrl,
  isThreadClosed,
  isThreadPendingAdmin,
  isThreadPendingUser,
  normalizeThreadStatus,
  validateAttachment,
} from "../contactThread";

const makeFile = (type: string, size: number) => {
  const file = new File(["x"], "f", { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("contactThread status helpers", () => {
  it("normalizes casing and empty values", () => {
    expect(normalizeThreadStatus("PENDING_ADMIN")).toBe("pending_admin");
    expect(normalizeThreadStatus(undefined)).toBe("");
    expect(normalizeThreadStatus(null)).toBe("");
  });

  it("detects each status regardless of casing", () => {
    expect(isThreadPendingAdmin("Pending_Admin")).toBe(true);
    expect(isThreadPendingUser("pending_user")).toBe(true);
    expect(isThreadClosed("CLOSED")).toBe(true);
    expect(isThreadClosed("pending_user")).toBe(false);
    expect(isThreadClosed(undefined)).toBe(false);
  });
});

describe("validateAttachment", () => {
  it("accepts allowed images under the limit", () => {
    expect(validateAttachment(makeFile("image/png", 1024))).toBeNull();
  });

  it("rejects other types", () => {
    expect(validateAttachment(makeFile("application/pdf", 1024))).toBe("invalidFileType");
  });

  it("rejects files over the limit", () => {
    expect(validateAttachment(makeFile("image/jpeg", MAX_ATTACHMENT_SIZE + 1))).toBe("fileTooLarge");
  });
});

describe("getAttachmentUrl", () => {
  it("prefers file_url and accepts absolute or root-relative urls", () => {
    expect(getAttachmentUrl({ file: "/a.png", file_url: "https://cdn.x/a.png" })).toBe("https://cdn.x/a.png");
    expect(getAttachmentUrl({ file: "/storage/a.png", file_url: null })).toBe("/storage/a.png");
  });

  it("returns null for missing or unrenderable paths", () => {
    expect(getAttachmentUrl({ file: null, file_url: null })).toBeNull();
    expect(getAttachmentUrl({ file: "storage/a.png" })).toBeNull();
  });
});
