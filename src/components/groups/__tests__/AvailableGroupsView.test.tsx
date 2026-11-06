import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { groupService, type AvailableGroup } from "@/services/group.service";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { AvailableGroupsView } from "../AvailableGroupsView";

vi.mock("@/services/group.service", () => ({
  groupService: {
    getAvailableGroups: vi.fn(),
    applyToGroup: vi.fn(),
  },
}));

vi.mock("@/hooks/useVoiceRecorder", () => ({ useVoiceRecorder: vi.fn() }));

type Recorder = ReturnType<typeof useVoiceRecorder>;

function mockRecorder(overrides: Partial<Recorder> = {}) {
  vi.mocked(useVoiceRecorder).mockReturnValue({
    status: "idle",
    elapsedMs: 0,
    recording: null,
    error: null,
    start: vi.fn(),
    stop: vi.fn(),
    pickFile: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  });
}

function recorded(duration: number): Partial<Recorder> {
  return {
    status: "recorded",
    recording: { file: new File(["voice"], "recording.mp3", { type: "audio/mp3" }), url: "blob:voice", duration },
  };
}

const group = {
  id: 7,
  display_name: "مسار 8 سنين - مجموعه براعم الاطفال",
  session_days: [
    { day: "الأحد", time: "05:00 م" },
    { day: "الثلاثاء", time: "05:00 م" },
  ],
} as AvailableGroup;

const otherGroup = {
  id: 8,
  display_name: "مسار 10 سنين - مجموعه النور",
  session_days: [],
} as unknown as AvailableGroup;

function renderView() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AvailableGroupsView />
    </QueryClientProvider>
  );
}

async function clickSubmit() {
  fireEvent.click(await screen.findByRole("button", { name: /submit/ }));
}

describe("AvailableGroupsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRecorder();
    vi.mocked(groupService.getAvailableGroups).mockResolvedValue([group]);
  });

  it("shows the display name, session times and submit button on the card without any click", async () => {
    renderView();

    expect(await screen.findByText(group.display_name)).toBeDefined();
    expect(screen.getByText(/الأحد/)).toBeDefined();
    expect(screen.getByText(/الثلاثاء/)).toBeDefined();
    expect(screen.getByRole("button", { name: /submit/ })).toBeDefined();
  });

  it("shows the empty state when no groups are returned", async () => {
    vi.mocked(groupService.getAvailableGroups).mockResolvedValue([]);
    renderView();

    expect(await screen.findByText(/emptyTitle/)).toBeDefined();
  });

  it("sends only the group id and shows the API's success message", async () => {
    vi.mocked(groupService.applyToGroup).mockResolvedValue({
      success: true,
      message: "تم استلام طلبك",
      data: null,
    });
    renderView();

    await clickSubmit();

    expect(await screen.findByText("تم استلام طلبك")).toBeDefined();
    expect(vi.mocked(groupService.applyToGroup).mock.calls[0][0]).toBe(7);
    expect(vi.mocked(groupService.applyToGroup).mock.calls[0][1]).toBeNull();
    expect(screen.queryByRole("button", { name: /submit/ })).toBeNull();
  });

  it("shows the API's error message and keeps the button for a retry", async () => {
    vi.mocked(groupService.applyToGroup).mockRejectedValue({
      response: { data: { success: false, message: "لقد قدمت طلبًا بالفعل" } },
    });
    renderView();

    await clickSubmit();

    expect(await screen.findByText("لقد قدمت طلبًا بالفعل")).toBeDefined();
    expect(screen.getByRole("button", { name: /submit/ })).toBeDefined();
  });

  it("treats a 200 response with success=false as a failure", async () => {
    vi.mocked(groupService.applyToGroup).mockResolvedValue({
      success: false,
      message: "المجموعة ممتلئة",
      data: null,
    });
    renderView();

    await clickSubmit();

    expect((await screen.findByText("المجموعة ممتلئة")).closest("[role=alert]")).not.toBeNull();
  });

  it("shows the response only on the card that was submitted", async () => {
    vi.mocked(groupService.getAvailableGroups).mockResolvedValue([group, otherGroup]);
    vi.mocked(groupService.applyToGroup).mockResolvedValue({
      success: true,
      message: "تم استلام طلبك",
      data: null,
    });
    renderView();

    const [firstButton] = await screen.findAllByRole("button", { name: /submit/ });
    fireEvent.click(firstButton);

    const message = await screen.findByText("تم استلام طلبك");
    expect(message.closest("article")?.textContent).toContain(group.display_name);
    expect(screen.getAllByRole("button", { name: /submit/ })).toHaveLength(1);
  });

  describe("groups with requires_audio", () => {
    const audioGroup = { ...group, id: 9, requires_audio: 1 } as AvailableGroup;

    it("shows no recorder and keeps submit enabled when requires_audio is 0", async () => {
      vi.mocked(groupService.getAvailableGroups).mockResolvedValue([{ ...group, requires_audio: 0 }]);
      renderView();

      const button = await screen.findByRole("button", { name: /submit/ });
      expect((button as HTMLButtonElement).disabled).toBe(false);
      expect(screen.queryByText(/voice.title/)).toBeNull();
      expect(screen.queryByText(/voice.badge/)).toBeNull();
    });

    it("asks for a recording first and disables submit until there is one", async () => {
      vi.mocked(groupService.getAvailableGroups).mockResolvedValue([audioGroup]);
      renderView();

      const button = await screen.findByRole("button", { name: /submit/ });
      expect((button as HTMLButtonElement).disabled).toBe(true);
      expect(screen.getByText(/voice.badge/)).toBeDefined();
      expect(screen.getAllByText(/voice.title/).length).toBeGreaterThan(0);
      expect(screen.getByText(/voice.submitHint/)).toBeDefined();
      expect(screen.getByRole("button", { name: /voice.start/ })).toBeDefined();
    });

    it("starts recording from the microphone button", async () => {
      const start = vi.fn();
      mockRecorder({ start });
      vi.mocked(groupService.getAvailableGroups).mockResolvedValue([audioGroup]);
      renderView();

      fireEvent.click(await screen.findByRole("button", { name: /voice.start/ }));
      expect(start).toHaveBeenCalled();
    });

    it("keeps submit disabled while recording, showing the countdown to 10 seconds", async () => {
      mockRecorder({ status: "recording", elapsedMs: 4200 });
      vi.mocked(groupService.getAvailableGroups).mockResolvedValue([audioGroup]);
      renderView();

      const button = await screen.findByRole("button", { name: /submit/ });
      expect((button as HTMLButtonElement).disabled).toBe(true);
      expect(screen.getByText(/voice.keepGoing/)).toBeDefined();
      expect(screen.getByRole("button", { name: /voice.stop/ })).toBeDefined();
    });

    it("rejects a recording shorter than 10 seconds", async () => {
      mockRecorder(recorded(6));
      vi.mocked(groupService.getAvailableGroups).mockResolvedValue([audioGroup]);
      renderView();

      const button = await screen.findByRole("button", { name: /submit/ });
      expect((button as HTMLButtonElement).disabled).toBe(true);
      expect(screen.getByText(/voice.tooShort/).closest("[role=alert]")).not.toBeNull();
      fireEvent.click(button);
      expect(groupService.applyToGroup).not.toHaveBeenCalled();
    });

    it("enables submit after a 10+ second recording and sends it with the group id", async () => {
      const state = recorded(12.4);
      mockRecorder(state);
      vi.mocked(groupService.getAvailableGroups).mockResolvedValue([audioGroup]);
      vi.mocked(groupService.applyToGroup).mockResolvedValue({ success: true, message: "تم استلام طلبك", data: null });
      renderView();

      expect(await screen.findByText(/voice.ready/)).toBeDefined();
      const button = screen.getByRole("button", { name: /submit/ });
      expect((button as HTMLButtonElement).disabled).toBe(false);
      fireEvent.click(button);

      expect(await screen.findByText("تم استلام طلبك")).toBeDefined();
      const [groupId, audio] = vi.mocked(groupService.applyToGroup).mock.calls[0];
      expect(groupId).toBe(9);
      expect(audio).toBe(state.recording!.file);
      expect(screen.queryByText(/voice.title/)).toBeNull();
    });
  });
});
