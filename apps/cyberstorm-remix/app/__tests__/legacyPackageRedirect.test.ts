import { describe, expect, it } from "vitest";

import { loader } from "../legacyPackageRedirect";

const PACKAGE_FORMAT_DOCS_URL =
  "https://wiki.thunderstore.io/mods/creating-a-package";

// Invoke the loader the way React Router would for the `/package/*` splat:
// `params["*"]` is everything after `/package/` (no query string), while the
// request keeps the full URL so query-string preservation can be exercised.
function call(path: string): Response {
  const splat = path.replace(/^\/package\/?/, "").split("?")[0];
  const args = {
    params: { "*": splat },
    request: new Request(`http://localhost${path}`),
    context: {},
  };
  return loader(args as unknown as Parameters<typeof loader>[0]) as Response;
}

function locationOf(path: string): string | null {
  return call(path).headers.get("Location");
}

describe("legacy /package redirect loader", () => {
  it("redirects the package listing index to the community", () => {
    const response = call("/package/");
    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe("/c/riskofrain2/");
  });

  it("redirects a package detail page (the canonical example)", () => {
    expect(locationOf("/package/x753/AudioEngineFix/")).toBe(
      "/c/riskofrain2/p/x753/AudioEngineFix/"
    );
  });

  it("redirects a team/owner listing", () => {
    expect(locationOf("/package/x753/")).toBe("/c/riskofrain2/p/x753/");
  });

  it.each([
    ["versions", "/c/riskofrain2/p/x753/AudioEngineFix/versions"],
    ["changelog", "/c/riskofrain2/p/x753/AudioEngineFix/changelog"],
    ["source", "/c/riskofrain2/p/x753/AudioEngineFix/source"],
    ["dependants", "/c/riskofrain2/p/x753/AudioEngineFix/dependants/"],
  ])("redirects the %s tab", (tab, expected) => {
    expect(locationOf(`/package/x753/AudioEngineFix/${tab}/`)).toBe(expected);
  });

  it("redirects a version detail page to the /v/ route", () => {
    expect(locationOf("/package/x753/AudioEngineFix/1.2.3/")).toBe(
      "/c/riskofrain2/p/x753/AudioEngineFix/v/1.2.3/"
    );
  });

  it("passes wiki paths through (the legacy <id>-<slug> is the new full_slug)", () => {
    expect(locationOf("/package/x753/AudioEngineFix/wiki/")).toBe(
      "/c/riskofrain2/p/x753/AudioEngineFix/wiki"
    );
    expect(locationOf("/package/x753/AudioEngineFix/wiki/12-some-page/")).toBe(
      "/c/riskofrain2/p/x753/AudioEngineFix/wiki/12-some-page"
    );
    expect(
      locationOf("/package/x753/AudioEngineFix/wiki/12-some-page/edit/")
    ).toBe("/c/riskofrain2/p/x753/AudioEngineFix/wiki/12-some-page/edit");
  });

  it("preserves the query string on in-app redirects", () => {
    expect(locationOf("/package/?ordering=newest&q=audio")).toBe(
      "/c/riskofrain2/?ordering=newest&q=audio"
    );
  });

  it("sends the bare create path to the upload page", () => {
    expect(locationOf("/package/create")).toBe("/package/create");
  });

  it("sends the create docs path to the external format docs", () => {
    expect(locationOf("/package/create/docs/")).toBe(PACKAGE_FORMAT_DOCS_URL);
  });

  it("treats a deeper create path as a team literally named 'create'", () => {
    expect(locationOf("/package/create/SomeMod/")).toBe(
      "/c/riskofrain2/p/create/SomeMod/"
    );
  });

  it("leaves binary download URLs as a 404", () => {
    try {
      call("/package/download/x753/AudioEngineFix/1.2.3/");
      expect.unreachable("should have thrown");
    } catch (thrown) {
      expect(thrown).toBeInstanceOf(Response);
      expect((thrown as Response).status).toBe(404);
    }
  });

  it("treats a non-download-shaped path as a team literally named 'download'", () => {
    expect(locationOf("/package/download/SomeMod/")).toBe(
      "/c/riskofrain2/p/download/SomeMod/"
    );
  });
});
