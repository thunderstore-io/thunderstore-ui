import { describe, expect, it } from "vitest";

import { isNumberArray, isStringArray } from "../typeguards";

describe("isNumberArray", () => {
  it.each([
    { value: [], expected: true },
    { value: [-1, 0, 1], expected: true },
    { value: [-1, "0", 1], expected: false },
    { value: [Math.PI], expected: true },
    { value: [NaN], expected: false },
    { value: 1, expected: false },
  ])(`correctly infers the type for $value`, ({ value, expected }) => {
    const actual = isNumberArray(value);

    expect(actual).toStrictEqual(expected);
  });
});

describe("isStringArray", () => {
  it.each([
    { value: [], expected: true },
    { value: ["abc", "123"], expected: true },
    { value: ["abc", 123], expected: false },
    { value: [NaN], expected: false },
    { value: "potato", expected: false },
  ])(`correctly infers the type for $value`, ({ value, expected }) => {
    const actual = isStringArray(value);

    expect(actual).toStrictEqual(expected);
  });
});
