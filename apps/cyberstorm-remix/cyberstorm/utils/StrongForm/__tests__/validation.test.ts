import { assert, describe, it } from "vitest";

import type { Validator } from "../validation";
import { isRawInvalid } from "../validation";

describe("StrongForm.validation.isRawInvalid", () => {
  it("returns false when no validator is provided", () => {
    assert.isFalse(isRawInvalid(undefined, "anything"));
  });

  it("marks required empty values invalid", () => {
    const v: Validator = { required: true };
    assert.isTrue(isRawInvalid(v, ""));
    assert.isTrue(isRawInvalid(v, "   "));
    assert.isTrue(isRawInvalid(v, null));
    assert.isTrue(isRawInvalid(v, undefined));
  });

  it("does not mark optional URL empty values invalid", () => {
    const v: Validator = { url: true };
    assert.isFalse(isRawInvalid(v, ""));
    assert.isFalse(isRawInvalid(v, "   "));
    assert.isFalse(isRawInvalid(v, null));
    assert.isFalse(isRawInvalid(v, undefined));
  });

  it("marks non-string URL values invalid", () => {
    const v: Validator = { url: true };
    assert.isTrue(isRawInvalid(v, 123));
    assert.isTrue(isRawInvalid(v, {}));
    assert.isTrue(isRawInvalid(v, []));
  });

  it("accepts http/https URLs", () => {
    const v: Validator = { url: true };
    assert.isFalse(isRawInvalid(v, "https://example.com"));
    assert.isFalse(isRawInvalid(v, "http://example.com/path?x=1"));
    assert.isFalse(isRawInvalid(v, "  https://example.com  "));
  });

  it("rejects non-http(s) or malformed URLs", () => {
    const v: Validator = { url: true };
    assert.isTrue(isRawInvalid(v, "example.com"));
    assert.isTrue(isRawInvalid(v, "ftp://example.com"));
    assert.isTrue(isRawInvalid(v, "://broken"));
  });

  it("required + url requires non-empty and valid", () => {
    const v: Validator = { required: true, url: true };
    assert.isTrue(isRawInvalid(v, ""));
    assert.isTrue(isRawInvalid(v, "   "));
    assert.isTrue(isRawInvalid(v, "ftp://example.com"));
    assert.isFalse(isRawInvalid(v, "https://example.com"));
  });
});
