import { describe, expect, it } from "vitest";
import { ApiError } from "../errors";

describe("ApiError", () => {
  it("includes stale session guidance for unauthorized responses", async () => {
    const response = new Response(
      JSON.stringify({ detail: "Session token is no longer valid." }),
      {
        status: 401,
        statusText: "Unauthorized",
        headers: { "Content-Type": "application/json" },
      }
    );

    const error = await ApiError.createFromResponse(response, {
      sessionWasUsed: true,
    });

    expect(error.message).toContain(
      "Your session has expired. Please sign in again."
    );
    expect(error.message).toContain("Session token is no longer valid.");
    expect(error.message).toContain("(401 Unauthorized)");
  });

  it("surfaces validation issue details when available", async () => {
    const response = new Response(
      JSON.stringify({ errors: { field: ["Missing value", "Invalid state"] } }),
      {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: { "Content-Type": "application/json" },
      }
    );

    const error = await ApiError.createFromResponse(response);

    expect(error.message).toContain(
      "The server could not process the request due to validation errors."
    );
    expect(error.message).toContain("Missing value");
    expect(error.message).toContain("(422 Unprocessable Entity)");
  });
});
