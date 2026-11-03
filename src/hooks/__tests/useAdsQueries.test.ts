import { describe, it, expect } from "vitest";
import {
  isAdActive,
  sortAdsByPriority,
  getAdsByPlacement,
} from "../api/useAdsQueries";
import { getYoutubeEmbedUrl } from "@/components/ads/AdMedia";
import type { Ad } from "@/types/ad.types";

const mockAdBase: Ad = {
  id: 1,
  title: "Test Ad",
  content: "Content",
  placement: "card",
  media_type: "none",
  media_url: null,
  youtube_embed_url: null,
  action_url: null,
  action_title: null,
  role_id: 1,
  start_at: "2026-01-01T00:00:00Z",
  end_at: null,
  priority: 1,
};

describe("useAdsQueries helpers", () => {
  describe("isAdActive", () => {
    it("returns true when start_at is in the past and end_at is null", () => {
      const ad: Ad = { ...mockAdBase, start_at: "2020-01-01T00:00:00Z", end_at: null };
      expect(isAdActive(ad)).toBe(true);
    });

    it("returns false when start_at is in the future", () => {
      const ad: Ad = { ...mockAdBase, start_at: "2099-01-01T00:00:00Z", end_at: null };
      expect(isAdActive(ad)).toBe(false);
    });

    it("returns false when end_at is in the past", () => {
      const ad: Ad = {
        ...mockAdBase,
        start_at: "2020-01-01T00:00:00Z",
        end_at: "2021-01-01T00:00:00Z",
      };
      expect(isAdActive(ad)).toBe(false);
    });

    it("returns true when current time is between start_at and end_at", () => {
      const ad: Ad = {
        ...mockAdBase,
        start_at: "2020-01-01T00:00:00Z",
        end_at: "2099-01-01T00:00:00Z",
      };
      expect(isAdActive(ad)).toBe(true);
    });
  });

  describe("sortAdsByPriority", () => {
    it("sorts ads descending by priority (higher priority first)", () => {
      const ads: Ad[] = [
        { ...mockAdBase, id: 1, priority: 2 },
        { ...mockAdBase, id: 2, priority: 10 },
        { ...mockAdBase, id: 3, priority: 5 },
      ];

      const sorted = sortAdsByPriority(ads);
      expect(sorted.map((a) => a.id)).toEqual([2, 3, 1]);
    });
  });

  describe("getAdsByPlacement", () => {
    it("filters active ads by placement and sorts by priority", () => {
      const ads: Ad[] = [
        { ...mockAdBase, id: 1, placement: "header", priority: 5, start_at: "2020-01-01T00:00:00Z" },
        { ...mockAdBase, id: 2, placement: "card", priority: 10, start_at: "2020-01-01T00:00:00Z" },
        { ...mockAdBase, id: 3, placement: "card", priority: 20, start_at: "2020-01-01T00:00:00Z" },
        { ...mockAdBase, id: 4, placement: "card", priority: 30, start_at: "2099-01-01T00:00:00Z" }, // future, should be excluded
      ];

      const cardAds = getAdsByPlacement(ads, "card");
      expect(cardAds.map((a) => a.id)).toEqual([3, 2]);
    });
  });

  describe("getYoutubeEmbedUrl", () => {
    it("uses provided valid youtube_embed_url", () => {
      const ad: Ad = {
        ...mockAdBase,
        media_type: "youtube",
        youtube_embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
      };
      expect(getYoutubeEmbedUrl(ad)).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0");
    });

    it("parses youtube watch URL from youtube_url or media_url", () => {
      const ad: Ad = {
        ...mockAdBase,
        media_type: "youtube",
        youtube_embed_url: null,
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      };
      expect(getYoutubeEmbedUrl(ad)).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0");
    });

    it("parses youtu.be short URL", () => {
      const ad: Ad = {
        ...mockAdBase,
        media_type: "youtube",
        youtube_embed_url: null,
        media_url: "https://youtu.be/dQw4w9WgXcQ",
      };
      expect(getYoutubeEmbedUrl(ad)).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0");
    });
  });
});

