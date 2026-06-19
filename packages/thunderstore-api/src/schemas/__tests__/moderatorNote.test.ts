import { describe, expect, it } from "vitest";

import { moderatorNoteSchema } from "../objectSchemas";
import {
  communityModeratorNoteCreateRequestParamsSchema,
  listingModeratorNoteCreateRequestParamsSchema,
  moderatorNoteDetailRequestParamsSchema,
  moderatorNoteUpdateRequestDataSchema,
  moderatorNoteWriteRequestDataSchema,
  versionModeratorNoteCreateRequestParamsSchema,
} from "../requestSchemas";
import {
  communityPermissionsResponseDataSchema,
  moderatorNoteListResponseDataSchema,
} from "../responseSchemas";

const baseNote = {
  id: 1,
  target_type: "listing" as const,
  content: "Heads up",
  version_number: null,
  is_active: true,
  datetime_created: "2026-06-19T15:16:00Z",
  datetime_updated: "2026-06-19T15:16:00Z",
};

describe("moderatorNoteSchema", () => {
  it.each(["community", "listing", "version"])(
    "accepts a %s note",
    (target_type) => {
      const note = {
        ...baseNote,
        target_type,
        version_number: target_type === "version" ? "1.2.3" : null,
      };
      expect(moderatorNoteSchema.safeParse(note).success).toBe(true);
    }
  );

  it("rejects an unknown target_type", () => {
    expect(
      moderatorNoteSchema.safeParse({ ...baseNote, target_type: "package" })
        .success
    ).toBe(false);
  });

  it("requires an integer id", () => {
    expect(
      moderatorNoteSchema.safeParse({ ...baseNote, id: 1.5 }).success
    ).toBe(false);
  });

  it("requires ISO datetimes", () => {
    expect(
      moderatorNoteSchema.safeParse({
        ...baseNote,
        datetime_created: "yesterday",
      }).success
    ).toBe(false);
  });

  it("rejects a missing required field", () => {
    const { is_active, ...withoutActive } = baseNote;
    expect(moderatorNoteSchema.safeParse(withoutActive).success).toBe(false);
  });
});

describe("moderatorNoteWriteRequestDataSchema", () => {
  it("requires non-blank content", () => {
    expect(
      moderatorNoteWriteRequestDataSchema.safeParse({ content: "A note" })
        .success
    ).toBe(true);
    expect(
      moderatorNoteWriteRequestDataSchema.safeParse({ content: "" }).success
    ).toBe(false);
    expect(moderatorNoteWriteRequestDataSchema.safeParse({}).success).toBe(
      false
    );
  });
});

describe("moderatorNoteUpdateRequestDataSchema", () => {
  it("allows an empty partial update", () => {
    expect(moderatorNoteUpdateRequestDataSchema.safeParse({}).success).toBe(
      true
    );
  });

  it("accepts content and/or is_active", () => {
    expect(
      moderatorNoteUpdateRequestDataSchema.safeParse({ is_active: false })
        .success
    ).toBe(true);
    expect(
      moderatorNoteUpdateRequestDataSchema.safeParse({ content: "Edited" })
        .success
    ).toBe(true);
  });

  it("rejects blank content when provided", () => {
    expect(
      moderatorNoteUpdateRequestDataSchema.safeParse({ content: "" }).success
    ).toBe(false);
  });
});

describe("moderator note request param schemas", () => {
  it("validates community/listing/version create params", () => {
    expect(
      communityModeratorNoteCreateRequestParamsSchema.safeParse({
        community: "riskofrain2",
      }).success
    ).toBe(true);
    expect(
      listingModeratorNoteCreateRequestParamsSchema.safeParse({
        community: "riskofrain2",
        namespace: "Team",
        package: "Mod",
      }).success
    ).toBe(true);
    expect(
      versionModeratorNoteCreateRequestParamsSchema.safeParse({
        community: "riskofrain2",
        namespace: "Team",
        package: "Mod",
        version_number: "1.0.0",
      }).success
    ).toBe(true);
  });

  it("requires an integer note_id on the detail params", () => {
    expect(
      moderatorNoteDetailRequestParamsSchema.safeParse({ note_id: 5 }).success
    ).toBe(true);
    expect(
      moderatorNoteDetailRequestParamsSchema.safeParse({ note_id: "5" }).success
    ).toBe(false);
  });
});

describe("moderatorNoteListResponseDataSchema", () => {
  it("accepts a wrapped list of notes (or an empty list)", () => {
    expect(
      moderatorNoteListResponseDataSchema.safeParse({
        moderator_notes: [baseNote],
      }).success
    ).toBe(true);
    expect(
      moderatorNoteListResponseDataSchema.safeParse({ moderator_notes: [] })
        .success
    ).toBe(true);
  });

  it("rejects a singular/bare payload (the read response is always a list)", () => {
    expect(
      moderatorNoteListResponseDataSchema.safeParse(baseNote).success
    ).toBe(false);
    expect(
      moderatorNoteListResponseDataSchema.safeParse({
        moderator_note: baseNote,
      }).success
    ).toBe(false);
  });
});

describe("communityPermissionsResponseDataSchema", () => {
  it("accepts a permissions wrapper with can_moderate", () => {
    expect(
      communityPermissionsResponseDataSchema.safeParse({
        permissions: { can_moderate: true },
      }).success
    ).toBe(true);
  });

  it("rejects an unwrapped or malformed payload", () => {
    expect(
      communityPermissionsResponseDataSchema.safeParse({ can_moderate: true })
        .success
    ).toBe(false);
  });
});
