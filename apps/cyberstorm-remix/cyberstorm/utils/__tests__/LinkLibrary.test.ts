import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as publicEnvVariables from "../../security/publicEnvVariables";
import { shouldReloadDocument } from "../LinkLibrary";

vi.mock("../../security/publicEnvVariables", () => ({
  getPublicEnvVariables: vi.fn(),
}));

const mockGetPublicEnvVariables = vi.mocked(
  publicEnvVariables.getPublicEnvVariables
);

describe("shouldReloadDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when VITE_BETA_SITE_URL is not set", () => {
    mockGetPublicEnvVariables.mockReturnValue({
      VITE_BETA_SITE_URL: undefined,
    });
    expect(shouldReloadDocument("thunderstore.io")).toBe(false);
  });

  it("returns false when VITE_BETA_SITE_URL is an empty string", () => {
    mockGetPublicEnvVariables.mockReturnValue({ VITE_BETA_SITE_URL: "" });
    expect(shouldReloadDocument("thunderstore.io")).toBe(false);
  });

  it("returns false when hostname matches VITE_BETA_SITE_URL (same host)", () => {
    mockGetPublicEnvVariables.mockReturnValue({
      VITE_BETA_SITE_URL: "https://new.thunderstore.io",
    });
    expect(shouldReloadDocument("new.thunderstore.io")).toBe(false);
  });

  it("returns true when hostname differs from VITE_BETA_SITE_URL (different host)", () => {
    mockGetPublicEnvVariables.mockReturnValue({
      VITE_BETA_SITE_URL: "https://new.thunderstore.io",
    });
    expect(shouldReloadDocument("thunderstore.io")).toBe(true);
  });

  it("returns true when served from a completely different domain", () => {
    mockGetPublicEnvVariables.mockReturnValue({
      VITE_BETA_SITE_URL: "https://new.thunderstore.io",
    });
    expect(shouldReloadDocument("thunderstore.dev")).toBe(true);
  });

  it("returns false when VITE_BETA_SITE_URL is an invalid URL", () => {
    mockGetPublicEnvVariables.mockReturnValue({
      VITE_BETA_SITE_URL: "not-a-valid-url",
    });
    expect(shouldReloadDocument("thunderstore.io")).toBe(false);
  });
});
