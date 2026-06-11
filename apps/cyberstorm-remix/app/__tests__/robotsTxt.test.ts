import { describe, expect, it } from "vitest";

import { loader } from "../robotsTxt";

describe("robots.txt loader", () => {
  it("responds with status 200", async () => {
    const response = await loader();
    expect(response.status).toBe(200);
  });

  it("serves a UTF-8 plain text body as required by RFC 9309", async () => {
    const response = await loader();
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8"
    );
  });

  it("allows caching with an explicit max-age", async () => {
    const response = await loader();
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
  });

  it("serves the same crawler rules as the legacy Django site", async () => {
    const response = await loader();
    const body = await response.text();
    expect(body).toBe(
      "User-agent: *\n" +
        "Disallow: /auth/\n" +
        "Allow: /api/docs/\n" +
        "Disallow: /api/\n"
    );
  });
});
