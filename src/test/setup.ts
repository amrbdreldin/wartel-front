import { vi, beforeEach } from "vitest";

// Mock global window.matchMedia (used by responsive and theme hooks)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next/navigation router hooks
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next-intl translations
vi.mock("next-intl", () => ({
  useTranslations(namespace?: string) {
    return (key: string) => (namespace ? `${namespace}.${key}` : key);
  },
  useLocale() {
    return "ar";
  },
}));

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
