import { describe, expect, it } from "vitest";
import { extractQrErrorMessage, sanitizeRedirectUrl } from "../qr-utils";

describe("sanitizeRedirectUrl", () => {
  it("allows http and https URLs", () => {
    expect(sanitizeRedirectUrl("https://example.com/summer-course")).toBe(
      "https://example.com/summer-course"
    );
    expect(sanitizeRedirectUrl(" http://example.com/test ")).toBe(
      "http://example.com/test"
    );
  });

  it("allows safe relative paths and rejects protocol-relative or dangerous schemes", () => {
    expect(sanitizeRedirectUrl("/ar/courses/summer")).toBe("/ar/courses/summer");
    expect(sanitizeRedirectUrl("//evil.com/phish")).toBeNull();
    expect(sanitizeRedirectUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeRedirectUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(sanitizeRedirectUrl("")).toBeNull();
    expect(sanitizeRedirectUrl(null)).toBeNull();
  });
});

describe("extractQrErrorMessage", () => {
  it("prefers the API error response message on 404/failure", () => {
    const axiosErr = {
      response: {
        data: {
          success: false,
          message: "الكود غير موجود أو غير صالح",
        },
      },
      message: "Request failed with status code 404",
    };

    expect(extractQrErrorMessage(axiosErr, undefined, "fallback")).toBe(
      "الكود غير موجود أو غير صالح"
    );
  });

  it("extracts API message when 200 payload has success=false or missing target_url", () => {
    expect(
      extractQrErrorMessage(
        null,
        {
          success: false,
          message: "الكود غير مفعل حالياً أو غير صالح",
          data: null,
        },
        "fallback"
      )
    ).toBe("الكود غير مفعل حالياً أو غير صالح");
  });

  it("falls back when no message is available", () => {
    expect(extractQrErrorMessage(null, undefined, "fallback")).toBe("fallback");
  });
});
