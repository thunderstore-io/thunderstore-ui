import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  findHiddenChangelogOverride,
  findPreviousReadmeOverride,
} from "../overrideMigration";

const mocks = vi.hoisted(() => ({
  versions: vi.fn(),
  readme: vi.fn(),
  changelog: vi.fn(),
}));

vi.mock("@thunderstore/thunderstore-api", () => ({
  fetchPackageVersions: mocks.versions,
  fetchPackageVersionReadmeOverrideRaw: mocks.readme,
  fetchPackageVersionChangelogOverrideRaw: mocks.changelog,
}));

const config = () => ({ apiHost: "https://api.example.invalid" });

const version = (
  version_number: string,
  datetime_created: string,
  is_readme_edited = false
) => ({ version_number, datetime_created, is_readme_edited });

const overridesOn =
  (...versions: string[]) =>
  ({ params }: { params: { version: string } }) =>
    Promise.resolve(
      versions.includes(params.version) ? `Edit ${params.version}` : null
    );

beforeEach(() => {
  vi.clearAllMocks();
  mocks.versions.mockResolvedValue([
    version("1.0.0", "2026-01-01T00:00:00Z", true),
    version("1.1.0", "2026-02-01T00:00:00Z", true),
    version("1.2.0", "2026-03-01T00:00:00Z"),
  ]);
  mocks.readme.mockImplementation(overridesOn("1.0.0", "1.1.0"));
});

describe("findPreviousReadmeOverride", () => {
  it("returns the most recently uploaded version with a README edit", async () => {
    expect(await findPreviousReadmeOverride(config, "Team", "Mod")).toEqual({
      versionNumber: "1.1.0",
      markdown: "Edit 1.1.0",
    });
    expect(mocks.versions).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { namespace_id: "Team", package_name: "Mod" },
      }),
      "no-store"
    );
  });

  it("skips the excluded version", async () => {
    expect(
      await findPreviousReadmeOverride(config, "Team", "Mod", "1.1.0")
    ).toEqual({ versionNumber: "1.0.0", markdown: "Edit 1.0.0" });
  });

  it("moves on when a listed edit is gone", async () => {
    mocks.readme.mockImplementation(overridesOn("1.0.0"));
    expect(await findPreviousReadmeOverride(config, "Team", "Mod")).toEqual({
      versionNumber: "1.0.0",
      markdown: "Edit 1.0.0",
    });
  });

  it("returns null when no version has a README edit", async () => {
    mocks.versions.mockResolvedValue([
      version("1.0.0", "2026-01-01T00:00:00Z"),
    ]);
    expect(await findPreviousReadmeOverride(config, "Team", "Mod")).toBeNull();
    expect(mocks.readme).not.toHaveBeenCalled();
  });
});

describe("findHiddenChangelogOverride", () => {
  beforeEach(() => {
    mocks.versions.mockResolvedValue([
      version("1.0.0", "2026-01-01T00:00:00Z"),
      version("2.0.0", "2026-02-01T00:00:00Z"),
      version("1.5.0", "2026-03-01T00:00:00Z"),
    ]);
    mocks.changelog.mockImplementation(overridesOn("2.0.0"));
  });

  it("finds the CHANGELOG edit on the version the upload replaced", async () => {
    expect(
      await findHiddenChangelogOverride(config, "Team", "Mod", "2.1.0")
    ).toEqual({ versionNumber: "2.0.0", markdown: "Edit 2.0.0" });
  });

  it("returns null when the upload is not the new latest version", async () => {
    expect(
      await findHiddenChangelogOverride(config, "Team", "Mod", "1.5.0")
    ).toBeNull();
    expect(mocks.changelog).not.toHaveBeenCalled();
  });

  it("returns null when the replaced version has no CHANGELOG edit", async () => {
    mocks.changelog.mockResolvedValue(null);
    expect(
      await findHiddenChangelogOverride(config, "Team", "Mod", "2.1.0")
    ).toBeNull();
  });
});
