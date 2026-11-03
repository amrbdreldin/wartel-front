import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EnrollmentSuccessView } from "../EnrollmentSuccessView";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("EnrollmentSuccessView", () => {
  it("renders with telegram tracking url and displays the link correctly", () => {
    const testUrl = "https://t.me/wartelacademy_bot?start=app_39";

    render(<EnrollmentSuccessView telegramTrackingUrl={testUrl} locale="ar" />);

    // Primary CTA link
    const telegramLink = screen.getByRole("link", { name: /auth\.telegramOpenButton/i });
    expect(telegramLink).toBeDefined();
    expect(telegramLink.getAttribute("href")).toBe(testUrl);
    expect(telegramLink.getAttribute("target")).toBe("_blank");
    expect(telegramLink.getAttribute("rel")).toBe("noopener noreferrer");

    // Check step 2 (tapping Start/ابدأ) is rendered
    expect(screen.getByText("auth.telegramStep2Title")).toBeDefined();
    expect(screen.getByText("auth.telegramStep2Desc")).toBeDefined();
  });

  it("falls back to default bot link when url is missing or empty", () => {
    render(<EnrollmentSuccessView telegramTrackingUrl={null} locale="ar" />);

    const telegramLink = screen.getByRole("link", { name: /auth\.telegramOpenButton/i });
    expect(telegramLink.getAttribute("href")).toBe("https://t.me/wartelacademy_bot");
  });

  it("sanitizes unsafe non-telegram urls", () => {
    render(
      <EnrollmentSuccessView
        telegramTrackingUrl="javascript:alert(1)"
        locale="ar"
      />
    );

    const telegramLink = screen.getByRole("link", { name: /auth\.telegramOpenButton/i });
    expect(telegramLink.getAttribute("href")).toBe("https://t.me/wartelacademy_bot");
  });

  it("handles copy link button interaction", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const testUrl = "https://t.me/wartelacademy_bot?start=app_39";
    render(<EnrollmentSuccessView telegramTrackingUrl={testUrl} locale="ar" />);

    const copyBtn = screen.getByRole("button", { name: /auth\.telegramCopyLink/i });
    expect(copyBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(writeTextMock).toHaveBeenCalledWith(testUrl);
  });
});
