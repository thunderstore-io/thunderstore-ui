import { describe, expect, it } from "vitest";

import { arraysAreEqual, serializeQueryString } from "../queryString";

describe("serializeQueryString", () => {
  it.each([
    {
      queryParams: [],
      expected: "",
    },
    {
      queryParams: [{ key: "query", value: "cats" }],
      expected: "query=cats",
    },
    {
      queryParams: [{ key: "category-id", value: 8 }],
      expected: "category-id=8",
    },
    {
      queryParams: [{ key: "deprecated", value: true }],
      expected: "deprecated=true",
    },
    {
      queryParams: [{ key: "included-categories", value: ["cats"] }],
      expected: "included-categories=cats",
    },
    {
      queryParams: [{ key: "category-ids", value: [8] }],
      expected: "category-ids=8",
    },
  ])(`handles single-value cases: #$#`, ({ queryParams, expected }) => {
    const actual = serializeQueryString(queryParams);

    expect(actual).toStrictEqual(expected);
  });

  it.each([
    {
      queryParams: [{ key: "a", value: [] }],
      expected: "",
    },
    {
      queryParams: [{ key: "a", value: ["a"] }],
      expected: "a=a",
    },
    {
      queryParams: [{ key: "a", value: ["a", "b"] }],
      expected: "a=a&a=b",
    },
    {
      queryParams: [{ key: "b", value: 1 }],
      expected: "b=1",
    },
    {
      queryParams: [{ key: "b", value: [0, 2] }],
      expected: "b=0&b=2",
    },
  ])(`handles multi-value cases: #$#`, ({ queryParams, expected }) => {
    const actual = serializeQueryString(queryParams);

    expect(actual).toStrictEqual(expected);
  });

  it("joins multiple single-value keys", () => {
    const actual = serializeQueryString([
      { key: "a", value: "a" },
      { key: "b", value: 8 },
      { key: "c", value: false },
    ]);

    expect(actual).toStrictEqual("a=a&b=8&c=false");
  });

  it("filters out undefined values", () => {
    const actual = serializeQueryString([
      { key: "a", value: undefined },
      { key: "b", value: 0 },
      { key: "c", value: undefined },
    ]);

    expect(actual).toStrictEqual("b=0");
  });

  it("filters out empty strings", () => {
    const actual = serializeQueryString([
      { key: "a", value: "" },
      { key: "b", value: false },
      { key: "c", value: "" },
    ]);

    expect(actual).toStrictEqual("b=false");
  });

  it("filters out empty arrays", () => {
    const actual = serializeQueryString([
      { key: "a", value: [] },
      { key: "b", value: "false" },
      { key: "c", value: [], impotent: ["irrelevant"] },
    ]);

    expect(actual).toStrictEqual("b=false");
  });

  it.each([
    {
      queryParams: [{ key: "a", value: "string", impotent: "string" }],
      expected: "",
    },
    {
      queryParams: [{ key: "a", value: 42, impotent: 42 }],
      expected: "",
    },
    {
      queryParams: [
        { key: "a", value: true, impotent: true },
        { key: "b", value: false, impotent: false },
      ],
      expected: "",
    },
    {
      queryParams: [
        { key: "a", value: ["a"], impotent: ["a"] },
        { key: "b", value: ["a", "b"], impotent: ["a", "b"] },
        { key: "c", value: ["b", "a"], impotent: ["a", "b"] },
      ],
      expected: "",
    },
    {
      queryParams: [
        { key: "a", value: [1], impotent: [1] },
        { key: "b", value: [1, 2], impotent: [1, 2] },
        { key: "c", value: [2, 1], impotent: [1, 2] },
      ],
      expected: "",
    },
  ])("filters out impotent values: #$#", ({ queryParams, expected }) => {
    const actual = serializeQueryString(queryParams);

    expect(actual).toStrictEqual(expected);
  });

  it("sorts keys alphabetically", () => {
    const actual = serializeQueryString([
      { key: "aba", value: 1 },
      { key: "bab", value: 1 },
      { key: "aaa", value: 1 },
      { key: "a", value: 1 },
    ]);

    expect(actual).toStrictEqual("a=1&aaa=1&aba=1&bab=1");
  });

  it("sorts string values alphabetically", () => {
    const actual = serializeQueryString([
      { key: "a", value: ["bab", "aab", "aba", "aaa"] },
    ]);

    expect(actual).toStrictEqual("a=aaa&a=aab&a=aba&a=bab");
  });

  it("sorts number values alphabetically", () => {
    const actual = serializeQueryString([
      { key: "a", value: [0, 1, -1, 12, 2] },
    ]);

    expect(actual).toStrictEqual("a=-1&a=0&a=1&a=2&a=12");
  });

  it.each([
    {
      queryParams: [{ key: "space bar", value: "space" }],
      expected: "space%20bar=space",
    },
    {
      queryParams: [{ key: "#metoo", value: "octothorpe" }],
      expected: "%23metoo=octothorpe",
    },
    {
      queryParams: [{ key: ";,/?:@&=+$", value: "reserved" }],
      expected: "%3B%2C%2F%3F%3A%40%26%3D%2B%24=reserved",
    },
  ])(`URL encodes keys: $queryParams.0.value`, ({ queryParams, expected }) => {
    const actual = serializeQueryString(queryParams);

    expect(actual).toStrictEqual(expected);
  });

  it.each([
    {
      queryParams: [{ key: "space", value: "final frontier" }],
      expected: "space=final%20frontier",
    },
    {
      queryParams: [{ key: "octothorpe", value: "#octocat" }],
      expected: "octothorpe=%23octocat",
    },
    {
      queryParams: [{ key: "reserved", value: ";,/?:@&=+$" }],
      expected: "reserved=%3B%2C%2F%3F%3A%40%26%3D%2B%24",
    },
  ])(`URL encodes values: $queryParams.0.key`, ({ queryParams, expected }) => {
    const actual = serializeQueryString(queryParams);

    expect(actual).toStrictEqual(expected);
  });

  it("disallows duplicate keys", () => {
    expect(() =>
      serializeQueryString([
        { key: "a", value: 1 },
        { key: "a", value: 2 },
      ])
    ).toThrow("Duplicate keys are not allowed");
  });
});

describe("arraysAreEqual", () => {
  it("considers empty arrays equal", () => {
    const actual = arraysAreEqual([], []);

    expect(actual).toStrictEqual(true);
  });

  it.each([
    {
      array1: [],
      array2: [],
      expected: true,
    },
    {
      array1: ["a"],
      array2: ["a"],
      expected: true,
    },
    {
      array1: ["a", "b", "c"],
      array2: ["a", "b", "c"],
      expected: true,
    },
    {
      array1: ["a", "b", "c"],
      array2: ["b", "c", "a"],
      expected: true,
    },
    {
      array1: ["a"],
      array2: [],
      expected: false,
    },
    {
      array1: ["a", "b", "c"],
      array2: ["a", "c"],
      expected: false,
    },
    {
      array1: ["a", "b", "c"],
      array2: ["a", "d", "c"],
      expected: false,
    },
  ])("just works on string arrays: #$#", ({ array1, array2, expected }) => {
    const actual = arraysAreEqual(array1, array2);

    expect(actual).toStrictEqual(expected);
  });

  it.each([
    {
      array1: [42],
      array2: [42],
      expected: true,
    },
    {
      array1: [1, 2, 3],
      array2: [1, 2, 3],
      expected: true,
    },
    {
      array1: [1, 2, 3],
      array2: [2, 3, 1],
      expected: true,
    },
    {
      array1: [42],
      array2: [],
      expected: false,
    },
    {
      array1: [1, 2, 3],
      array2: [1, 3],
      expected: false,
    },
    {
      array1: [1, 2, 3],
      array2: [1, 4, 3],
      expected: false,
    },
  ])("just works on number arrays: #$#", ({ array1, array2, expected }) => {
    const actual = arraysAreEqual(array1, array2);

    expect(actual).toStrictEqual(expected);
  });
});
