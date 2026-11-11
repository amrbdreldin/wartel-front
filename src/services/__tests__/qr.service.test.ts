import { beforeEach, describe, expect, it, vi } from "vitest";
import * as apiClient from "@/lib/api-client";
import { qrService } from "../qr.service";

vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
}));

describe("qrService.getQrCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests /qr-codes/{code} with skipGlobalToast enabled", async () => {
    const mockResponse = {
      success: true,
      message: "تم جلب رابط التوجيه بنجاح",
      data: {
        code: "aB3x9K",
        title: "رابط التسجيل في الدورة الصيفية",
        target_url: "https://example.com/summer-course",
      },
    };
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce(mockResponse);

    const result = await qrService.getQrCode("aB3x9K", { lang: "ar" });

    expect(result).toEqual(mockResponse);
    expect(apiClient.apiGet).toHaveBeenCalledWith(
      "/qr-codes/aB3x9K",
      expect.objectContaining({
        lang: "ar",
        config: expect.objectContaining({ skipGlobalToast: true }),
      })
    );
  });

  it("URI-encodes special characters in the QR code parameter", async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: null,
    });

    await qrService.getQrCode("aB/3?x=9", { lang: "en" });

    expect(apiClient.apiGet).toHaveBeenCalledWith(
      "/qr-codes/aB%2F3%3Fx%3D9",
      expect.objectContaining({
        lang: "en",
        config: expect.objectContaining({ skipGlobalToast: true }),
      })
    );
  });
});
