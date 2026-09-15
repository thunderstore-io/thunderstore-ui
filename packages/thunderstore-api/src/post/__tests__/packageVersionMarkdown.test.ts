import { afterEach, describe, expect, it, vi } from "vitest";

import { RequestBodyParseError } from "../../index";
import { postPackageVersionMarkdown } from "../packageVersionMarkdown";

const props = {
  config: () => ({
    apiHost: "https://api.example.invalid",
    sessionId: "session",
  }),
  params: { namespace: "Team", package: "Mod", version: "1.0.0" },
  queryParams: {},
};

afterEach(() => vi.unstubAllGlobals());

describe("postPackageVersionMarkdown", () => {
  it("rejects invalid document values before sending a request", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    await expect(
      postPackageVersionMarkdown({
        ...props,
        data: { readme: 123 as unknown as string },
      })
    ).rejects.toBeInstanceOf(RequestBodyParseError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("accepts empty markdown and discarding an override", async () => {
    const data = { readme: "", changelog: null };
    const state = { html: "", is_edited: false, edited_at: null };
    const response = new Response(
      JSON.stringify({ readme: state, changelog: state }),
      { status: 200 }
    );
    const fetch = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetch);
    await postPackageVersionMarkdown({ ...props, data });
    expect(fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ body: JSON.stringify(data) })
    );
  });
});
