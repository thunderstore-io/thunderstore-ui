import { assert, describe, it } from "vitest";

import {
  compareVersionNumbers,
  sortVersionNumbersDescending,
} from "../semverCompare";

describe("utils.semverCompare", () => {
  it("orders by semantic version, not alphabetically", () => {
    assert.isAbove(compareVersionNumbers("1.10.0", "1.9.0"), 0);
    assert.isBelow(compareVersionNumbers("1.9.0", "1.10.0"), 0);
    assert.equal(compareVersionNumbers("1.2.3", "1.2.3"), 0);
  });

  it("sorts newest first", () => {
    const sorted = sortVersionNumbersDescending([
      "1.2.0",
      "1.10.0",
      "1.9.0",
      "2.0.0",
      "1.9.1",
    ]);

    assert.deepEqual(sorted, ["2.0.0", "1.10.0", "1.9.1", "1.9.0", "1.2.0"]);
  });

  it("does not mutate the input list", () => {
    const versions = ["1.0.0", "1.1.0"];

    sortVersionNumbersDescending(versions);

    assert.deepEqual(versions, ["1.0.0", "1.1.0"]);
  });
});
