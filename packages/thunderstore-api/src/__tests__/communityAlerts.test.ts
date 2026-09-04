import { describe, expect, it } from "vitest";

import { communityAlertsResponseDataSchema } from "../schemas/responseSchemas";

const alert = {
  id: 1,
  message: "Servers are down. [Status page](https://example.com)",
  variant: "warning",
  datetime_created: "2026-08-20T10:00:00Z",
  datetime_updated: "2026-08-20T10:00:00Z",
};

describe("communityAlertsResponseDataSchema", () => {
  it("handles a valid alert", () => {
    const parsed = communityAlertsResponseDataSchema.parse([alert]);

    expect(parsed).toStrictEqual([alert]);
  });

  it("accepts an empty list", () => {
    expect(communityAlertsResponseDataSchema.parse([])).toStrictEqual([]);
  });

  it.each(["info", "success", "warning", "danger"])(
    "keeps the %s variant",
    (variant) => {
      const parsed = communityAlertsResponseDataSchema.parse([
        { ...alert, variant },
      ]);

      expect(parsed[0].variant).toBe(variant);
    }
  );

  it("defaults to 'info' for a variant that the frontend doesn't support", () => {
    const parsed = communityAlertsResponseDataSchema.parse([
      { ...alert, variant: "chartreuse" },
    ]);

    expect(parsed[0].variant).toBe("info");
  });

  it("rejects an alert missing its message", () => {
    const { message: _message, ...withoutMessage } = alert;

    expect(() =>
      communityAlertsResponseDataSchema.parse([withoutMessage])
    ).toThrow();
  });
});
