import { describe, expect, it } from "vitest";

import {
  packageChangelogResponseDataSchema,
  packageReadmeResponseDataSchema,
} from "../responseSchemas";

describe.each([
  ["README", packageReadmeResponseDataSchema],
  ["CHANGELOG", packageChangelogResponseDataSchema],
])("%s response schema", (_, schema) => {
  it("defaults the edit fields when the backend omits them", () => {
    expect(schema.parse({ html: "" })).toEqual({
      html: "",
      is_edited: false,
      edited_at: null,
    });
  });

  it("accepts the backend's datetime format", () => {
    const editedAt = "2026-09-08T00:30:00.123456Z";
    expect(
      schema.parse({ html: "", is_edited: true, edited_at: editedAt })
    ).toEqual({ html: "", is_edited: true, edited_at: editedAt });
  });

  it("drops malformed edit fields instead of failing", () => {
    expect(
      schema.parse({ html: "x", is_edited: "yes", edited_at: "yesterday" })
    ).toEqual({ html: "x", is_edited: false, edited_at: null });
  });
});
