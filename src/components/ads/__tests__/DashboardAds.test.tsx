import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdCard } from "../AdCard";
import { AdHeader } from "../AdHeader";
import { AdPopup } from "../AdPopup";
import { AdMedia } from "../AdMedia";
import { normalizeAdsData, getAdsByPlacement } from "@/hooks/api/useAdsQueries";
import type { Ad } from "@/types/ad.types";

const mockAd: Ad = {
  id: 2,
  title: "شرح طريقة استخدام نظام التمام والرفيقات",
  content: "فيديو قصير يوضح خطوات تسجيل التمام اليومي...",
  placement: "card",
  placement_name: "كارد في لوحة التحكم",
  media_type: "youtube",
  media_type_name: "يوتيوب",
  media_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  youtube_embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
  action_url: "https://wartel.app/guide/tamam",
  action_title: "مشاهدة الدليل",
  role_id: 1,
  role_name: "الطلاب",
  start_at: "2026-11-01T00:00:00+02:00",
  end_at: null,
  priority: 5,
  created_at: "2026-11-02T10:15:00+02:00",
};

describe("AdCard Component", () => {
  it("renders ad title, content, and CTA action link", () => {
    render(<AdCard ad={mockAd} />);

    expect(screen.getByText(mockAd.title)).toBeDefined();
    expect(screen.getByText(mockAd.content!)).toBeDefined();

    const ctaLink = screen.getByRole("link", { name: /مشاهدة الدليل/i });
    expect(ctaLink.getAttribute("href")).toBe(mockAd.action_url);
    expect(ctaLink.getAttribute("target")).toBe("_blank");
    expect(ctaLink.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders youtube iframe player when media_type is youtube", () => {
    render(<AdCard ad={mockAd} />);

    const iframe = screen.getByTitle(mockAd.title);
    expect(iframe).toBeDefined();
    expect(iframe.getAttribute("src")).toBe(mockAd.youtube_embed_url);
  });
});

describe("AdHeader Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders header ad and allows dismissal", () => {
    const onDismiss = vi.fn();
    const headerAd: Ad = {
      ...mockAd,
      placement: "header",
      placement_name: "تنويه هام",
    };

    render(<AdHeader ad={headerAd} onDismiss={onDismiss} />);

    expect(screen.getByText(headerAd.title)).toBeDefined();

    // Click dismiss button
    const closeBtn = screen.getByRole("button", { name: /ads\.close/i });
    fireEvent.click(closeBtn);

    expect(onDismiss).toHaveBeenCalledWith(headerAd.id);
    expect(sessionStorage.getItem(`wartel_dismissed_ad_${headerAd.id}`)).toBe("1");
  });
});

describe("AdPopup Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders popup dialog when isOpen is true", () => {
    const onClose = vi.fn();
    const popupAd: Ad = {
      ...mockAd,
      placement: "popup",
    };

    render(<AdPopup ad={popupAd} isOpen={true} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText(popupAd.title)).toBeDefined();

    // Dismiss button
    const dismissBtn = screen.getByRole("button", { name: /ads\.dismiss/i });
    fireEvent.click(dismissBtn);

    expect(onClose).toHaveBeenCalled();
    expect(sessionStorage.getItem(`wartel_dismissed_ad_${popupAd.id}`)).toBe("1");
  });

  it("closes when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<AdPopup ad={mockAd} isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});

describe("AdMedia Component", () => {
  it("renders video element when media_type is video", () => {
    const videoAd: Ad = {
      ...mockAd,
      media_type: "video",
      media_url: "https://example.com/video.mp4",
      youtube_embed_url: null,
    };

    const { container } = render(<AdMedia ad={videoAd} />);
    const video = container.querySelector("video");
    expect(video).toBeDefined();
    expect(video?.getAttribute("src")).toBe("https://example.com/video.mp4");
  });

  it("renders image element when media_type is image", () => {
    const imageAd: Ad = {
      ...mockAd,
      media_type: "image",
      media_url: "https://example.com/image.png",
      youtube_embed_url: null,
    };

    render(<AdMedia ad={imageAd} />);
    const img = screen.getByAltText(imageAd.title);
    expect(img.getAttribute("src")).toBe("https://example.com/image.png");
  });

  it("renders nothing when media_type is none", () => {
    const noneAd: Ad = {
      ...mockAd,
      media_type: "none",
    };

    const { container } = render(<AdMedia ad={noneAd} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("normalizeAdsData", () => {
  it("flattens grouped placement payload from /ads API", () => {
    const popupAd: Ad = {
      ...mockAd,
      id: 1,
      placement: "popup",
      allowed_roles: [{ id: 2, name: "المعلمون" }],
      target_roles_text: "المعلمون",
      start_at: "2020-01-01T00:00:00+02:00",
      end_at: "2099-01-01T00:00:00+02:00",
    };

    const normalized = normalizeAdsData({
      header: [],
      card: [],
      popup: [popupAd],
    });

    expect(normalized).toHaveLength(1);
    expect(getAdsByPlacement(normalized, "popup")).toEqual([popupAd]);
    expect(getAdsByPlacement(normalized, "header")).toEqual([]);
    expect(getAdsByPlacement(normalized, "card")).toEqual([]);
  });
});


