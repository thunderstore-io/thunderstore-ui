import { assert, describe, it } from "vitest";

import type { Validator } from "../validation";
import {
  getValidationError,
  isRawInvalid,
  validateHttpUrl,
  validateHttpsUrl,
  validateMaxLength,
  validateMinLength,
  validatePattern,
  validateRequired,
} from "../validation";

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

  it("does not mark optional httpsUrl empty values invalid", () => {
    const v: Validator = { httpsUrl: true };
    assert.isFalse(isRawInvalid(v, ""));
    assert.isFalse(isRawInvalid(v, "   "));
    assert.isFalse(isRawInvalid(v, null));
    assert.isFalse(isRawInvalid(v, undefined));
  });

  it("marks non-string httpsUrl values invalid", () => {
    const v: Validator = { httpsUrl: true };
    assert.isTrue(isRawInvalid(v, 123));
    assert.isTrue(isRawInvalid(v, {}));
    assert.isTrue(isRawInvalid(v, []));
  });

  it("accepts https URLs for httpsUrl", () => {
    const v: Validator = { httpsUrl: true };
    assert.isFalse(isRawInvalid(v, "https://example.com"));
    assert.isFalse(isRawInvalid(v, "  https://example.com  "));
  });

  it("rejects http, non-https or malformed URLs for httpsUrl", () => {
    const v: Validator = { httpsUrl: true };
    assert.isTrue(isRawInvalid(v, "http://example.com"));
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

describe("StrongForm.validation.isRawInvalid - minLength", () => {
  it("marks values shorter than minLength as invalid", () => {
    const v: Validator = { minLength: 3 };
    assert.isTrue(isRawInvalid(v, "ab"));
    assert.isTrue(isRawInvalid(v, "a"));
  });

  it("accepts values at or above minLength", () => {
    const v: Validator = { minLength: 3 };
    assert.isFalse(isRawInvalid(v, "abc"));
    assert.isFalse(isRawInvalid(v, "abcd"));
  });

  it("does not check minLength on empty values (unless required)", () => {
    const v: Validator = { minLength: 3 };
    assert.isFalse(isRawInvalid(v, ""));
    assert.isFalse(isRawInvalid(v, "   "));
  });

  it("checks minLength when required and non-empty but too short", () => {
    const v: Validator = { required: true, minLength: 3 };
    // Empty triggers required error first
    assert.isTrue(isRawInvalid(v, ""));
    // Non-empty but too short
    assert.isTrue(isRawInvalid(v, "ab"));
    assert.isFalse(isRawInvalid(v, "abc"));
  });
});

describe("StrongForm.validation.isRawInvalid - maxLength", () => {
  it("marks values longer than maxLength as invalid", () => {
    const v: Validator = { maxLength: 5 };
    assert.isTrue(isRawInvalid(v, "abcdef"));
    assert.isTrue(isRawInvalid(v, "123456"));
  });

  it("accepts values at or below maxLength", () => {
    const v: Validator = { maxLength: 5 };
    assert.isFalse(isRawInvalid(v, "abcde"));
    assert.isFalse(isRawInvalid(v, "abc"));
    assert.isFalse(isRawInvalid(v, ""));
  });
});

describe("StrongForm.validation.isRawInvalid - pattern", () => {
  it("marks values not matching pattern as invalid", () => {
    const v: Validator = {
      pattern: { regex: /^[a-z]+$/, message: "Only lowercase" },
    };
    assert.isTrue(isRawInvalid(v, "ABC"));
    assert.isTrue(isRawInvalid(v, "abc123"));
    assert.isTrue(isRawInvalid(v, "€€€"));
  });

  it("accepts values matching pattern", () => {
    const v: Validator = {
      pattern: { regex: /^[a-z]+$/, message: "Only lowercase" },
    };
    assert.isFalse(isRawInvalid(v, "abc"));
    assert.isFalse(isRawInvalid(v, "hello"));
  });

  it("does not check pattern on empty values", () => {
    const v: Validator = {
      pattern: { regex: /^[a-z]+$/, message: "Only lowercase" },
    };
    assert.isFalse(isRawInvalid(v, ""));
    assert.isFalse(isRawInvalid(v, "   "));
  });

  it("validates team name pattern correctly", () => {
    const v: Validator = {
      pattern: {
        regex: /^[a-zA-Z0-9]+([a-zA-Z0-9_]+[a-zA-Z0-9])?$/,
        message: "Invalid team name",
      },
    };
    assert.isFalse(isRawInvalid(v, "MyTeam"));
    assert.isFalse(isRawInvalid(v, "My_Team"));
    assert.isFalse(isRawInvalid(v, "a1_b2"));
    assert.isTrue(isRawInvalid(v, "_MyTeam"));
    assert.isTrue(isRawInvalid(v, "MyTeam_"));
    assert.isTrue(isRawInvalid(v, "€€€"));
    assert.isTrue(isRawInvalid(v, "my team"));
  });
});

describe("StrongForm.validation.getValidationError", () => {
  it("returns undefined when no validator is provided", () => {
    assert.isUndefined(getValidationError(undefined, "anything"));
  });

  it("returns specific error for required empty field", () => {
    const v: Validator = { required: true };
    assert.equal(getValidationError(v, ""), "This field is required");
  });

  it("returns specific error for invalid HTTPS URL", () => {
    const v: Validator = { httpsUrl: true };
    assert.equal(
      getValidationError(v, "http://example.com"),
      "Must be a valid HTTPS URL"
    );
  });

  it("returns specific error for maxLength exceeded", () => {
    const v: Validator = { maxLength: 5 };
    assert.equal(
      getValidationError(v, "abcdef"),
      "Must be at most 5 characters"
    );
  });

  it("returns specific error for minLength not met", () => {
    const v: Validator = { minLength: 3 };
    assert.equal(getValidationError(v, "ab"), "Must be at least 3 characters");
  });

  it("returns custom pattern message", () => {
    const v: Validator = {
      pattern: { regex: /^[a-z]+$/, message: "Only lowercase letters" },
    };
    assert.equal(getValidationError(v, "ABC"), "Only lowercase letters");
  });

  it("returns undefined for valid values", () => {
    const v: Validator = {
      required: true,
      maxLength: 10,
      pattern: { regex: /^[a-z]+$/, message: "bad" },
    };
    assert.isUndefined(getValidationError(v, "hello"));
  });
});

describe("StrongForm.validation.validateRequired", () => {
  it("returns error for empty values", () => {
    assert.equal(validateRequired(""), "This field is required");
    assert.equal(validateRequired("   "), "This field is required");
    assert.equal(validateRequired(null), "This field is required");
    assert.equal(validateRequired(undefined), "This field is required");
  });

  it("returns undefined for non-empty values", () => {
    assert.isUndefined(validateRequired("hello"));
    assert.isUndefined(validateRequired("a"));
  });
});

describe("StrongForm.validation.validateHttpsUrl", () => {
  it("returns undefined for empty values", () => {
    assert.isUndefined(validateHttpsUrl(""));
    assert.isUndefined(validateHttpsUrl(null));
  });

  it("returns error for non-string values", () => {
    assert.equal(validateHttpsUrl(123), "Must be a valid HTTPS URL");
  });

  it("returns error for non-https URLs", () => {
    assert.equal(
      validateHttpsUrl("http://example.com"),
      "Must be a valid HTTPS URL"
    );
    assert.equal(validateHttpsUrl("example.com"), "Must be a valid HTTPS URL");
  });

  it("returns undefined for valid https URLs", () => {
    assert.isUndefined(validateHttpsUrl("https://example.com"));
  });
});

describe("StrongForm.validation.validateHttpUrl", () => {
  it("returns undefined for empty values", () => {
    assert.isUndefined(validateHttpUrl(""));
    assert.isUndefined(validateHttpUrl(null));
  });

  it("returns error for non-string values", () => {
    assert.equal(validateHttpUrl(123), "Must be a valid URL");
  });

  it("returns error for invalid URLs", () => {
    assert.isDefined(validateHttpUrl("ftp://example.com"));
    assert.isDefined(validateHttpUrl("example.com"));
  });

  it("returns undefined for valid http/https URLs", () => {
    assert.isUndefined(validateHttpUrl("https://example.com"));
    assert.isUndefined(validateHttpUrl("http://example.com"));
  });
});

describe("StrongForm.validation.validateMinLength", () => {
  it("returns error when below min", () => {
    assert.equal(validateMinLength("ab", 3), "Must be at least 3 characters");
    assert.equal(validateMinLength("", 1), "Must be at least 1 character");
  });

  it("returns undefined when at or above min", () => {
    assert.isUndefined(validateMinLength("abc", 3));
    assert.isUndefined(validateMinLength("abcd", 3));
  });
});

describe("StrongForm.validation.validateMaxLength", () => {
  it("returns error when above max", () => {
    assert.equal(
      validateMaxLength("abcdef", 5),
      "Must be at most 5 characters"
    );
  });

  it("returns undefined when at or below max", () => {
    assert.isUndefined(validateMaxLength("abcde", 5));
    assert.isUndefined(validateMaxLength("abc", 5));
  });
});

describe("StrongForm.validation.validatePattern", () => {
  it("returns custom message when pattern does not match", () => {
    assert.equal(
      validatePattern("ABC", { regex: /^[a-z]+$/, message: "Only lowercase" }),
      "Only lowercase"
    );
  });

  it("returns undefined when pattern matches", () => {
    assert.isUndefined(
      validatePattern("abc", { regex: /^[a-z]+$/, message: "Only lowercase" })
    );
  });
});
