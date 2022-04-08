import {
  getBoolean,
  getNumber,
  getString,
  getStringArray,
  UrlQuery,
  _isNonNegativeInt,
} from "utils/urlQuery";

describe("getBoolean", () => {
  it("returns undefined for undefined", () => {
    const actual = getBoolean(undefined);

    expect(actual).toStrictEqual(undefined);
  });

  it.each([
    { input: "true", expected: true },
    { input: "false", expected: false },
    { input: "yes", expected: undefined },
    { input: "no", expected: undefined },
    { input: "on", expected: undefined },
    { input: "off", expected: undefined },
    { input: "1", expected: undefined },
    { input: "0", expected: undefined },
    { input: "", expected: undefined },
  ])(`returns $expected for "$input"`, ({ input, expected }) => {
    const actualString = getBoolean(input);
    const actualSingleArray = getBoolean([input]);
    const actualMultiArray = getBoolean([input, "ignored"]);

    expect(actualString).toStrictEqual(expected);
    expect(actualSingleArray).toStrictEqual(expected);
    expect(actualMultiArray).toStrictEqual(expected);
  });
});

describe("getNumber", () => {
  it("returns undefined for undefined", () => {
    const actual = getNumber(undefined);

    expect(actual).toStrictEqual(undefined);
  });

  it.each([
    { input: "", expected: undefined },
    { input: "one", expected: undefined },
    { input: "0", expected: 0 },
    { input: "1", expected: 1 },
  ])(`returns $expected for "$input"`, ({ input, expected }) => {
    const actualString = getNumber(input);
    const actualSingleArray = getNumber([input]);
    const actualMultiArray = getNumber([input, "ignored"]);

    expect(actualString).toStrictEqual(expected);
    expect(actualSingleArray).toStrictEqual(expected);
    expect(actualMultiArray).toStrictEqual(expected);
  });
});

describe("getString", () => {
  it.each([
    [undefined, undefined],
    ["", ""],
    ["single", "single"],
    [["single"], "single"],
    [["first", "second"], "first"],
  ])(
    "returns string or undefined (case %p)",
    (input: UrlQuery, expected: string | undefined) => {
      const actual = getString(input);

      expect(actual).toStrictEqual(expected);
    }
  );
});

describe("getStringArray", () => {
  it.each([
    [undefined, undefined],
    ["", [""]],
    ["single", ["single"]],
    [["single"], ["single"]],
    [
      ["first", "second"],
      ["first", "second"],
    ],
  ])(
    "returns string array or undefined (case %p)",
    (input: UrlQuery, expected: string[] | undefined) => {
      const actual = getStringArray(input);

      expect(actual).toStrictEqual(expected);
    }
  );
});

describe("_isNonNegativeInt", () => {
  it.each([
    ["9999999999999999999999999999999999999", true],
    ["1", true],
    ["0", true],
    ["-1", false],
    ["123a", false],
    ["a123", false],
    ["abc", false],
    ["", false],
  ])(
    "identifies %p as %p positive integer string",
    (input: string, expected: boolean) => {
      const actual = _isNonNegativeInt(input);

      expect(actual).toStrictEqual(expected);
    }
  );
});
