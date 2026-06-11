import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { gatedSsr404, hasSessionCookie, isGatedSsrData } from "../gatedSsr";

describe("gatedSsr404", () => {
  it("marks the data with the sentinel flag", () => {
    const result = gatedSsr404({ listing: undefined, team: undefined });
    expect(result.data.__gatedSsr404).toBe(true);
  });

  it("preserves the provided empty data shape", () => {
    const result = gatedSsr404({
      listing: undefined,
      community_identifier: "riskofrain2",
    });
    expect(result.data.listing).toBeUndefined();
    expect(result.data.community_identifier).toBe("riskofrain2");
    expect(Object.keys(result.data)).toEqual([
      "listing",
      "community_identifier",
      "__gatedSsr404",
    ]);
  });

  it("sets a 404 response status", () => {
    const result = gatedSsr404({});
    expect(result.init?.status).toBe(404);
  });
});

describe("isGatedSsrData", () => {
  it("recognizes data produced by gatedSsr404", () => {
    expect(isGatedSsrData(gatedSsr404({ listing: undefined }).data)).toBe(true);
  });

  it("rejects regular loader data", () => {
    expect(isGatedSsrData({ listing: { name: "MyPackage" } })).toBe(false);
  });

  it("rejects non-object values", () => {
    expect(isGatedSsrData(null)).toBe(false);
    expect(isGatedSsrData(undefined)).toBe(false);
    expect(isGatedSsrData("string")).toBe(false);
    expect(isGatedSsrData(404)).toBe(false);
  });

  it("rejects objects where the flag is not strictly true", () => {
    expect(isGatedSsrData({ __gatedSsr404: false })).toBe(false);
    expect(isGatedSsrData({ __gatedSsr404: "true" })).toBe(false);
  });
});

describe("hasSessionCookie", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.NIMBUS_PUBLIC_ENV = {
      VITE_API_URL: "https://api.example.invalid",
      VITE_COOKIE_DOMAIN: ".example.invalid",
    };
  });

  afterEach(() => {
    document.cookie =
      "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure";
    window.localStorage.clear();
  });

  it("returns true when a sessionid cookie is present", () => {
    document.cookie = "sessionid=test-session-id; path=/; Secure";
    expect(hasSessionCookie()).toBe(true);
  });

  it("returns false when no sessionid cookie is present", () => {
    document.cookie =
      "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure";
    expect(hasSessionCookie()).toBe(false);
  });
});
