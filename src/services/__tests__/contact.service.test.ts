import { describe, it, expect, vi, beforeEach } from "vitest";
import { contactService } from "../contact.service";
import * as apiClient from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiUpload: vi.fn(),
}));

describe("contactService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getThreads", () => {
    it("should call apiGet with default pagination params", async () => {
      vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
        success: true,
        message: "success",
        data: { data: [], links: {}, meta: {} },
      } as any);

      await contactService.getThreads();

      expect(apiClient.apiGet).toHaveBeenCalledWith(
        "/contact-threads",
        expect.objectContaining({
          config: expect.objectContaining({
            params: { page: 1, per_page: 15 },
          }),
        })
      );
    });

    it("should pass custom page and per_page params", async () => {
      vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
        success: true,
        message: "success",
        data: { data: [], links: {}, meta: {} },
      } as any);

      await contactService.getThreads({ page: 2, per_page: 10 });

      expect(apiClient.apiGet).toHaveBeenCalledWith(
        "/contact-threads",
        expect.objectContaining({
          config: expect.objectContaining({
            params: { page: 2, per_page: 10 },
          }),
        })
      );
    });
  });

  describe("getThread", () => {
    it("should call apiGet with thread id", async () => {
      vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
        success: true,
        message: "success",
        data: { id: 3 },
      } as any);

      await contactService.getThread(3);

      expect(apiClient.apiGet).toHaveBeenCalledWith("/contact-threads/3", undefined);
    });
  });

  describe("createThread", () => {
    it("should call apiPost when no file is attached", async () => {
      vi.mocked(apiClient.apiPost).mockResolvedValueOnce({
        success: true,
        message: "success",
        data: { id: 3 },
      } as any);

      await contactService.createThread({
        subject: "استفسار",
        message: "رسالة تجريبية",
      });

      expect(apiClient.apiPost).toHaveBeenCalledWith(
        "/contact-threads",
        {
          subject: "استفسار",
          message: "رسالة تجريبية",
        },
        undefined
      );
    });

    it("should call apiUpload with FormData when file is attached", async () => {
      vi.mocked(apiClient.apiUpload).mockResolvedValueOnce({
        success: true,
        message: "success",
        data: { id: 3 },
      } as any);

      const fakeFile = new File(["dummy content"], "test.png", { type: "image/png" });

      await contactService.createThread({
        subject: "استفسار",
        message: "رسالة تجريبية",
        file: fakeFile,
      });

      expect(apiClient.apiUpload).toHaveBeenCalledWith(
        "/contact-threads",
        expect.any(FormData),
        undefined
      );
    });
  });

  describe("replyThread", () => {
    it("should call apiPost when replying without file", async () => {
      vi.mocked(apiClient.apiPost).mockResolvedValueOnce({
        success: true,
        message: "success",
        data: { id: 10 },
      } as any);

      await contactService.replyThread({
        threadId: 3,
        message: "رد تجريبي",
      });

      expect(apiClient.apiPost).toHaveBeenCalledWith(
        "/contact-threads/3/reply",
        { message: "رد تجريبي" },
        undefined
      );
    });

    it("should call apiUpload with FormData when replying with file", async () => {
      vi.mocked(apiClient.apiUpload).mockResolvedValueOnce({
        success: true,
        message: "success",
        data: { id: 10 },
      } as any);

      const fakeFile = new File(["dummy content"], "test.png", { type: "image/png" });

      await contactService.replyThread({
        threadId: 3,
        message: "رد تجريبي مع صورة",
        file: fakeFile,
      });

      expect(apiClient.apiUpload).toHaveBeenCalledWith(
        "/contact-threads/3/reply",
        expect.any(FormData),
        undefined
      );
    });
  });
});
