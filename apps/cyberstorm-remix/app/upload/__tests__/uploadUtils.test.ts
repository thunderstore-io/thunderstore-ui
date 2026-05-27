import { describe, expect, it } from "vitest";

import {
  buildCommunityOptions,
  formatBytes,
  getSubmissionErrorMessages,
  getSubmissionErrorsBySection,
  isPackageZipFile,
  isUploadResetDisabled,
  isUploadSubmitDisabled,
  pruneCommunityCategories,
  uploadFormFieldReducer,
} from "../uploadUtils";

describe("isPackageZipFile", () => {
  it("accepts known zip mime types", () => {
    const file = new File(["zip"], "package.bin", {
      type: "application/zip",
    });
    expect(isPackageZipFile(file)).toBe(true);
  });

  it("accepts .zip extension for octet-stream files", () => {
    const file = new File(["zip"], "mod-package.ZIP", {
      type: "application/octet-stream",
    });
    expect(isPackageZipFile(file)).toBe(true);
  });

  it("rejects non-zip file types", () => {
    const file = new File(["text"], "notes.txt", {
      type: "text/plain",
    });
    expect(isPackageZipFile(file)).toBe(false);
  });
});

describe("uploadFormFieldReducer", () => {
  it("updates a single field", () => {
    const initial = {
      author_name: "",
      communities: [],
      has_nsfw_content: false,
      upload_uuid: "",
      categories: undefined,
      community_categories: undefined,
    };

    const next = uploadFormFieldReducer(initial, {
      field: "author_name",
      value: "TeamA",
    });

    expect(next.author_name).toBe("TeamA");
    expect(next.upload_uuid).toBe("");
  });

  it("resets to initial form state", () => {
    const state = {
      author_name: "abc",
      communities: ["c1"],
      has_nsfw_content: true,
      upload_uuid: "uuid",
      categories: ["cat"],
      community_categories: { c1: ["cat"] },
    };

    const next = uploadFormFieldReducer(state, "reset");
    expect(next).toEqual({
      author_name: "",
      communities: [],
      has_nsfw_content: false,
      upload_uuid: "",
      categories: undefined,
      community_categories: undefined,
    });
  });
});

describe("pruneCommunityCategories", () => {
  it("keeps only selected communities", () => {
    const pruned = pruneCommunityCategories({ c1: ["a"], c2: ["b"] }, ["c2"]);
    expect(pruned).toEqual({ c2: ["b"] });
  });

  it("returns undefined when nothing remains", () => {
    const pruned = pruneCommunityCategories({ c1: ["a"] }, ["c2"]);
    expect(pruned).toBeUndefined();
  });
});

describe("buildCommunityOptions", () => {
  it("maps community identifier and name to select options", () => {
    expect(
      buildCommunityOptions([
        { identifier: "risk-of-rain", name: "Risk of Rain" },
        { identifier: "valheim", name: "Valheim" },
      ])
    ).toEqual([
      { value: "risk-of-rain", label: "Risk of Rain" },
      { value: "valheim", label: "Valheim" },
    ]);
  });
});

describe("formatBytes", () => {
  it("formats zero bytes", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  it("formats binary units", () => {
    expect(formatBytes(1024)).toBe("1 KiB");
    expect(formatBytes(1024 * 1024)).toBe("1 MiB");
  });
});

describe("isUploadSubmitDisabled", () => {
  it("is disabled while submitting, pending, missing upload, or no communities", () => {
    expect(
      isUploadSubmitDisabled({
        submitting: true,
        submissionPending: false,
        uploadUuid: "uuid",
        communitiesCount: 1,
      })
    ).toBe(true);

    expect(
      isUploadSubmitDisabled({
        submitting: false,
        submissionPending: true,
        uploadUuid: "uuid",
        communitiesCount: 1,
      })
    ).toBe(true);

    expect(
      isUploadSubmitDisabled({
        submitting: false,
        submissionPending: false,
        uploadUuid: undefined,
        communitiesCount: 1,
      })
    ).toBe(true);

    expect(
      isUploadSubmitDisabled({
        submitting: false,
        submissionPending: false,
        uploadUuid: "uuid",
        communitiesCount: 0,
      })
    ).toBe(true);
  });

  it("is enabled when upload and communities are ready", () => {
    expect(
      isUploadSubmitDisabled({
        submitting: false,
        submissionPending: false,
        uploadUuid: "uuid",
        communitiesCount: 2,
      })
    ).toBe(false);
  });
});

describe("isUploadResetDisabled", () => {
  it("is disabled only while submitting or pending", () => {
    expect(
      isUploadResetDisabled({
        submitting: true,
        submissionPending: false,
      })
    ).toBe(true);

    expect(
      isUploadResetDisabled({
        submitting: false,
        submissionPending: true,
      })
    ).toBe(true);

    expect(
      isUploadResetDisabled({
        submitting: false,
        submissionPending: false,
      })
    ).toBe(false);
  });
});

describe("getSubmissionErrorsBySection", () => {
  it("buckets messages into upload, communities, categories, and submit sections", () => {
    const sections = getSubmissionErrorsBySection([
      "Missing manifest.json in zip",
      "Invalid community selection",
      "Unknown category slug",
      "Server error",
    ]);

    expect(sections.uploadFile).toEqual(["Missing manifest.json in zip"]);
    expect(sections.communities).toEqual(["Invalid community selection"]);
    expect(sections.categories).toEqual(["Unknown category slug"]);
    expect(sections.submit).toEqual(["Server error"]);
  });
});

describe("getSubmissionErrorMessages", () => {
  it("flattens nested errors and deduplicates values", () => {
    const messages = getSubmissionErrorMessages({
      upload: ["Missing README", "Missing README"],
      nested: { categories: ["Invalid category"] },
      plain: "General error",
    });

    expect(messages).toEqual([
      "Missing README",
      "Invalid category",
      "General error",
    ]);
  });
});
