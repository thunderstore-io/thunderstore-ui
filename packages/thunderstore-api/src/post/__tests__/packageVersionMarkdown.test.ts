import { afterEach, describe, expect, it, vi } from "vitest";

import { RequestBodyParseError } from "../../index";
import { postPackageVersionChangelog } from "../packageVersionChangelog";
import { postPackageVersionReadme } from "../packageVersionReadme";

const props = {
  config: () => ({
    apiHost: "https://api.example.invalid",
    sessionId: "session",
  }),
  params: { namespace: "Team", package: "Mod", version: "1.0.0" },
  queryParams: {},
};

const state = { is_edited: false, edited_at: null };

afterEach(() => vi.unstubAllGlobals());

describe.each([
  [
    "readme",
    (readme: string | null) =>
      postPackageVersionReadme({ ...props, data: { readme } }),
  ],
  [
    "changelog",
    (changelog: string | null) =>
      postPackageVersionChangelog({ ...props, data: { changelog } }),
  ],
] as const)("post %s override", (document, send) => {
  it("rejects invalid values before sending a request", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    await expect(send(123 as unknown as string)).rejects.toBeInstanceOf(
      RequestBodyParseError
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([[""], [null]])("sends %j", async (value) => {
    const response = new Response(
      JSON.stringify({ readme: state, changelog: state }),
      { status: 200 }
    );
    const fetch = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetch);
    await send(value);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ body: JSON.stringify({ [document]: value }) })
    );
  });
});
