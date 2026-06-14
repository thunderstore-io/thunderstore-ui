import { describe, expect, it } from "vitest";

import { loader } from "../robotsTxt";

// The loader now derives an absolute Sitemap URL from the request, so each call
// needs a request. Only `request` is read; cast the minimal shape to the args.
function makeArgs() {
  return {
    request: new Request("https://thunderstore.io/robots.txt"),
  } as unknown as Parameters<typeof loader>[0];
}

describe("robots.txt loader", () => {
  it("responds with status 200", async () => {
    const response = await loader(makeArgs());
    expect(response.status).toBe(200);
  });

  it("serves a UTF-8 plain text body as required by RFC 9309", async () => {
    const response = await loader(makeArgs());
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8"
    );
  });

  it("allows caching with an explicit max-age", async () => {
    const response = await loader(makeArgs());
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
  });

  it("serves the same crawler rules as the legacy Django site", async () => {
    const response = await loader(makeArgs());
    const body = await response.text();
    expect(body).toContain(
      "User-agent: *\n" +
        "Disallow: /auth/\n" +
        "Allow: /api/docs/\n" +
        "Disallow: /api/\n"
    );
  });

  it("points crawlers at an absolute https sitemap", async () => {
    const response = await loader(makeArgs());
    const body = await response.text();
    expect(body).toMatch(/\nSitemap: https?:\/\/[^\n]+\/sitemap\.xml\n$/);
  });
});
