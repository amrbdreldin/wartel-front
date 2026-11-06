import { beforeEach, describe, expect, it, vi } from "vitest";
import * as apiClient from "@/lib/api-client";
import { groupService } from "../group.service";

vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiUpload: vi.fn(),
}));

describe("groupService.applyToGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts only the group id as JSON when there is no voice recording", async () => {
    vi.mocked(apiClient.apiPost).mockResolvedValueOnce({ success: true, message: "ok", data: null });

    await groupService.applyToGroup(7, null, { lang: "ar" });

    expect(apiClient.apiUpload).not.toHaveBeenCalled();
    expect(apiClient.apiPost).toHaveBeenCalledWith(
      "/groups/apply",
      { group_id: 7 },
      expect.objectContaining({ lang: "ar", config: expect.objectContaining({ skipGlobalToast: true }) })
    );
  });

  it("uploads the voice under the requires_audio key with the group id", async () => {
    vi.mocked(apiClient.apiUpload).mockResolvedValueOnce({ success: true, message: "ok", data: null });
    const voice = new File(["voice"], "recording.mp3", { type: "audio/mp3" });

    await groupService.applyToGroup(7, voice, { lang: "en" });

    expect(apiClient.apiPost).not.toHaveBeenCalled();
    const [url, formData, options] = vi.mocked(apiClient.apiUpload).mock.calls[0];
    expect(url).toBe("/groups/apply");
    expect((formData as FormData).get("group_id")).toBe("7");
    expect((formData as FormData).get("requires_audio")).toBeInstanceOf(File);
    expect(((formData as FormData).get("requires_audio") as File).name).toBe("recording.mp3");
    expect(options).toEqual(expect.objectContaining({ config: expect.objectContaining({ skipGlobalToast: true }) }));
  });
});
