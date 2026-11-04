import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { groupService, type AvailableGroup } from "@/services/group.service";
import { AvailableGroupsView } from "../AvailableGroupsView";

vi.mock("@/services/group.service", () => ({
  groupService: {
    getAvailableGroups: vi.fn(),
    applyToGroup: vi.fn(),
  },
}));

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
});
