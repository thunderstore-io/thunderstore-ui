import { assert, describe, it } from "vitest";

import { isValueEmpty } from "../utils";

describe("StrongForm.utils.isValueEmpty", () => {
  it("treats undefined/null as empty", () => {
    assert.isTrue(isValueEmpty(undefined));
    assert.isTrue(isValueEmpty(null));
  });

  it("treats empty/whitespace-only strings as empty", () => {
    assert.isTrue(isValueEmpty(""));
    assert.isTrue(isValueEmpty(" "));
    assert.isTrue(isValueEmpty("\n\t  "));
  });

  it("treats non-empty strings as not empty", () => {
    assert.isFalse(isValueEmpty("a"));
    assert.isFalse(isValueEmpty("  a  "));
    assert.isFalse(isValueEmpty("0"));
  });

  it("treats non-string non-null values as not empty", () => {
    assert.isFalse(isValueEmpty(0));
    assert.isFalse(isValueEmpty(false));
    assert.isFalse(isValueEmpty(true));
    assert.isFalse(isValueEmpty({}));
    assert.isFalse(isValueEmpty([]));
  });
});
