import { describe, expect, it } from "vitest";

import { isSameCommunity } from "../revalidation";

describe("isSameCommunity", () => {
  it("is the same community when the id repeats", () => {
    expect(
      isSameCommunity(
        { communityId: "how-to-fish" },
        { communityId: "how-to-fish" }
      )
    ).toBe(true);
  });

  // The regression this guards: the layout route used to compare the first
  // path segment, which is "c" for every community, so moving between two
  // communities kept the first one's loader data.
  it("is a different community when the id changes", () => {
    expect(
      isSameCommunity(
        { communityId: "how-to-fish" },
        { communityId: "how-to-bake" }
      )
    ).toBe(false);
  });

  it("ignores case, which the API also ignores", () => {
    expect(
      isSameCommunity(
        { communityId: "How-To-Fish" },
        { communityId: "how-to-fish" }
      )
    ).toBe(true);
  });

  it("is never the same when the param is missing", () => {
    expect(isSameCommunity({}, {})).toBe(false);
    expect(isSameCommunity({}, { communityId: "how-to-fish" })).toBe(false);
    expect(isSameCommunity({ communityId: "how-to-fish" }, {})).toBe(false);
  });
});
