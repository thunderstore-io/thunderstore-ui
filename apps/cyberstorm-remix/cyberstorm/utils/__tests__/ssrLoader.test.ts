import type { LoaderFunctionArgs } from "react-router";
import { describe, expect, it } from "vitest";

import { ApiError } from "@thunderstore/thunderstore-api";

import { ssrLoader } from "../ssrLoader";

function fakeLoaderArgs(
  overrides: Partial<LoaderFunctionArgs> = {}
): LoaderFunctionArgs {
  return {
    params: {},
    request: new Request("http://localhost/test"),
    context: {},
    ...overrides,
  } as LoaderFunctionArgs;
}

function createApiError(
  status: number,
  statusText: string,
  url = "http://localhost/api/test"
): ApiError {
  return new ApiError({
    message: `${status}: ${statusText}`,
    response: {
      headers: {},
      status,
      statusText,
      url,
    },
    responseJson: { detail: "Something went wrong" },
  });
}

describe("ssrLoader", () => {
  it("returns the value from the wrapped loader on success", async () => {
    const data = { message: "hello" };
    const loader = ssrLoader(async () => data);
    const result = await loader(fakeLoaderArgs());
    expect(result).toBe(data);
  });

  it("passes loader args through to the wrapped function", async () => {
    const request = new Request("http://localhost/custom");
    const params = { communityId: "riskofrain2" };

    const loader = ssrLoader(async (args: LoaderFunctionArgs) => ({
      url: args.request.url,
      params: args.params,
    }));

    const result = await loader(fakeLoaderArgs({ request, params }));
    expect(result).toEqual({
      url: "http://localhost/custom",
      params: { communityId: "riskofrain2" },
    });
  });

  it("converts an ApiError into a Response with matching status", async () => {
    const loader = ssrLoader(async () => {
      throw createApiError(404, "Not Found");
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      expect(thrown).toBeInstanceOf(Response);
      const response = thrown as Response;
      expect(response.status).toBe(404);
      expect(response.statusText).toBe("Not Found");
    }
  });

  it("includes status, statusText, and url in the Response JSON body", async () => {
    const apiUrl = "http://localhost/api/community/test";
    const loader = ssrLoader(async () => {
      throw createApiError(403, "Forbidden", apiUrl);
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      const response = thrown as Response;
      const body = await response.json();
      expect(body).toEqual({
        status: 403,
        statusText: "Forbidden",
        url: apiUrl,
      });
    }
  });

  it("sets Content-Type header to application/json on the Response", async () => {
    const loader = ssrLoader(async () => {
      throw createApiError(500, "Internal Server Error");
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      const response = thrown as Response;
      expect(response.headers.get("Content-Type")).toBe("application/json");
    }
  });

  it("re-throws non-ApiError errors unchanged", async () => {
    const originalError = new Error("network failure");
    const loader = ssrLoader(async () => {
      throw originalError;
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      expect(thrown).toBe(originalError);
    }
  });

  it("re-throws a Response thrown by the wrapped loader unchanged", async () => {
    const originalResponse = new Response("Not Found", { status: 404 });
    const loader = ssrLoader(async () => {
      throw originalResponse;
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      expect(thrown).toBe(originalResponse);
    }
  });

  it("re-throws non-Error values unchanged", async () => {
    const loader = ssrLoader(async () => {
      throw "string error";
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      expect(thrown).toBe("string error");
    }
  });

  it("excludes sensitive ApiError properties from the Response body", async () => {
    const loader = ssrLoader(async () => {
      throw new ApiError({
        message: "500: Internal Server Error",
        response: {
          headers: { Authorization: "Bearer secret-token" },
          status: 500,
          statusText: "Internal Server Error",
          url: "http://localhost/api/test",
        },
        responseJson: { detail: "sensitive internal details" },
      });
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      const body = await (thrown as Response).json();
      const keys = Object.keys(body);
      expect(keys).toEqual(["status", "statusText", "url"]);
      expect(body).not.toHaveProperty("headers");
      expect(body).not.toHaveProperty("message");
      expect(body).not.toHaveProperty("responseJson");
    }
  });

  it("preserves the original request url in the Response body", async () => {
    const apiUrl = "http://localhost/api/v1/resource/42";
    const loader = ssrLoader(async () => {
      throw createApiError(500, "Internal Server Error", apiUrl);
    });

    try {
      await loader(fakeLoaderArgs());
      expect.unreachable("should have thrown");
    } catch (thrown) {
      expect(thrown).toBeInstanceOf(Response);
      const body = await (thrown as Response).json();
      expect(body.url).toBe(apiUrl);
    }
  });
});
