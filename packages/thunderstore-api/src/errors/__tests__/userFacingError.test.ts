import { describe, expect, it } from "vitest";

import { mapApiErrorToUserFacingError } from "../userFacingError";

describe("mapApiErrorToUserFacingError", () => {
  it("identifies AbortError as network error", () => {
    const error = new Error("Aborted");
    error.name = "AbortError";
    const result = mapApiErrorToUserFacingError(error);
    expect(result.category).toBe("network");
  });

  it("identifies 'Network Error' message as network error", () => {
    const error = new Error("Network Error");
    const result = mapApiErrorToUserFacingError(error);
    expect(result.category).toBe("network");
  });

  it("identifies 'Failed to fetch' as network error", () => {
    const error = new TypeError("Failed to fetch");
    const result = mapApiErrorToUserFacingError(error);
    expect(result.category).toBe("network");
  });

  it("identifies 'fetch failed' as network error", () => {
    const error = new TypeError("fetch failed");
    const result = mapApiErrorToUserFacingError(error);
    expect(result.category).toBe("network");
  });

  it("identifies plain object with 'Network Error' message as network error", () => {
    const error = { message: "Network Error" };
    const result = mapApiErrorToUserFacingError(error);
    expect(result.category).toBe("network");
  });

  it("identifies generic TypeError as unknown error", () => {
    const error = new TypeError("Some random type error");
    const result = mapApiErrorToUserFacingError(error);
    expect(result.category).toBe("unknown");
  });

  it("identifies other errors as unknown", () => {
    const error = new Error("Something else");
    const result = mapApiErrorToUserFacingError(error);
    expect(result.category).toBe("unknown");
  });
});
