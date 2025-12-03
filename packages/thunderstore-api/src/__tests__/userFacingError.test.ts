import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  ApiError,
  RequestBodyParseError,
  createResourceNotFoundError,
  mapApiErrorToUserFacingError,
  UserFacingError,
} from "../index";

describe("mapApiErrorToUserFacingError", () => {
  it("categorises stale session responses as auth errors", async () => {
    const response = new Response(
      JSON.stringify({ detail: "Session token is no longer valid." }),
      {
        status: 401,
        statusText: "Unauthorized",
        headers: { "Content-Type": "application/json" },
      }
    );

    const apiError = await ApiError.createFromResponse(response, {
      sessionWasUsed: true,
    });

    const userFacing = mapApiErrorToUserFacingError(apiError);

    expect(userFacing).toBeInstanceOf(UserFacingError);
    expect(userFacing.category).toBe("auth");
    expect(userFacing.status).toBe(401);
    expect(userFacing.headline).toContain("session has expired");
    expect(userFacing.description).toContain(
      "Session token is no longer valid."
    );
    expect(userFacing.context?.sessionWasUsed).toBe(true);
  });

  it("maps request validation issues to validation category", () => {
    const schema = z.object({ field: z.string().min(1) });
    const result = schema.safeParse({ field: "" });

    expect(result.success).toBe(false);

    const zodError = result.success ? undefined : result.error;
    const validationError = new RequestBodyParseError(zodError!);

    const userFacing = mapApiErrorToUserFacingError(validationError);

    expect(userFacing.category).toBe("validation");
    expect(userFacing.headline).toContain("Invalid request data");
  });

  it("falls back to network category for fetch issues", () => {
    const networkError = new TypeError("Failed to fetch");

    const userFacing = mapApiErrorToUserFacingError(networkError, {
      fallbackHeadline: "Network issue detected.",
      fallbackDescription: "Check your connection and retry.",
    });

    expect(userFacing.category).toBe("network");
    expect(userFacing.headline).toBe("Network issue detected.");
    expect(userFacing.description).toBe("Check your connection and retry.");
  });

  it("creates a consistent not found user-facing error", async () => {
    const response = new Response(JSON.stringify({ detail: "Not found." }), {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "application/json" },
    });

    const apiError = await ApiError.createFromResponse(response);

    const userFacing = createResourceNotFoundError({
      resourceName: "team",
      identifier: "alpha",
      originalError: apiError,
    });

    expect(userFacing).toBeInstanceOf(UserFacingError);
    expect(userFacing.headline).toBe("Team not found.");
    expect(userFacing.description).toBe('We could not find the team "alpha".');
    expect(userFacing.status).toBe(404);
    expect(userFacing.category).toBe("not_found");
    expect(userFacing.context?.resource).toBe("team");
    expect(userFacing.context?.identifier).toBe("alpha");
  });

  it("falls back to generic copy when identifier absent", async () => {
    const response = new Response("Not found.", {
      status: 404,
      statusText: "Not Found",
    });

    const apiError = await ApiError.createFromResponse(response);

    const userFacing = createResourceNotFoundError({
      resourceName: "team",
      originalError: apiError,
    });

    expect(userFacing.description).toBe(
      "We could not find the requested team."
    );
    expect(userFacing.context?.identifier).toBeUndefined();
  });
});
