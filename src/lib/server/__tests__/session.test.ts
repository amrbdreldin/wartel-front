import { describe, expect, it } from "vitest";
import { extractAndStripTokens } from "../session";

describe("extractAndStripTokens", () => {
  it("moves tokens out of `data` and marks the session", () => {
    const body: Record<string, unknown> = {
      success: true,
      data: { user: { id: 1 }, token: "acc", refresh_token: "ref" },
    };
    expect(extractAndStripTokens(body)).toEqual({ accessToken: "acc", refreshToken: "ref" });
    expect(body).toEqual({
      success: true,
      session_established: true,
      data: { user: { id: 1 }, session_established: true },
    });
  });

  it("supports access_token at the top level", () => {
    const body: Record<string, unknown> = { access_token: "acc", user: { id: 2 } };
    expect(extractAndStripTokens(body)).toEqual({ accessToken: "acc", refreshToken: undefined });
    expect(body.access_token).toBeUndefined();
    expect(body.session_established).toBe(true);
  });

  it("returns null and leaves bodies without tokens untouched", () => {
    const body = { success: false, message: "Invalid credentials", data: null };
    expect(extractAndStripTokens(body)).toBeNull();
    expect(body).toEqual({ success: false, message: "Invalid credentials", data: null });
    expect(extractAndStripTokens("text")).toBeNull();
    expect(extractAndStripTokens([{ token: "x" }])).toBeNull();
  });

  it("ignores empty token values", () => {
    expect(extractAndStripTokens({ data: { token: "" } })).toBeNull();
  });
});
