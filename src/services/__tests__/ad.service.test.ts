import { describe, it, expect, vi, beforeEach } from "vitest";
import { adService } from "../ad.service";
import * as apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { Ad } from "@/types/ad.types";

vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
}));

describe("adService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAds", () => {
    it("should call apiGet without role_id when omitted", async () => {
      vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
        success: true,
        message: "تم جلب الإعلانات بنجاح",
        data: [],
      } satisfies ApiResponse<Ad[]>);

      await adService.getAds();

      expect(apiClient.apiGet).toHaveBeenCalledWith(
        "/ads",
        expect.objectContaining({
          config: expect.objectContaining({
            params: {},
          }),
        })
      );
    });

    it("should call apiGet with role_id param when provided", async () => {
      vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
        success: true,
        message: "تم جلب الإعلانات بنجاح",
        data: [
          {
            id: 2,
            title: "شرح طريقة استخدام نظام التمام والرفيقات",
            content: null,
            placement: "card",
            media_type: "youtube",
            media_url: null,
            youtube_embed_url: null,
            action_url: null,
            action_title: null,
            role_id: 2,
            start_at: "2026-11-01T00:00:00+02:00",
            end_at: null,
            priority: 1,
          },
        ],
      } satisfies ApiResponse<Ad[]>);

      await adService.getAds({ role_id: 2 });

      expect(apiClient.apiGet).toHaveBeenCalledWith(
        "/ads",
        expect.objectContaining({
          config: expect.objectContaining({
            params: { role_id: 2 },
          }),
        })
      );
    });

    it("should pass role_id 1 for students", async () => {
      vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
        success: true,
        message: "تم جلب الإعلانات بنجاح",
        data: [],
      } satisfies ApiResponse<Ad[]>);

      await adService.getAds({ role_id: 1 });

      expect(apiClient.apiGet).toHaveBeenCalledWith(
        "/ads",
        expect.objectContaining({
          config: expect.objectContaining({
            params: { role_id: 1 },
          }),
        })
      );
    });
  });
});

