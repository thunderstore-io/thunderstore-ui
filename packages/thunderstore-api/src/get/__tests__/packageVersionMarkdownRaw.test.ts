import { afterEach, expect, it, vi } from "vitest";

import {
  fetchPackageVersionChangelogMarkdownRaw,
  fetchPackageVersionChangelogOverrideRaw,
} from "../packageVersionChangelogMarkdownRaw";
import {
  fetchPackageVersionReadmeMarkdownRaw,
  fetchPackageVersionReadmeOverrideRaw,
} from "../packageVersionReadmeMarkdownRaw";

const props = {
  config: () => ({ apiHost: "http://127.0.0.1:8000", sessionId: "session" }),
  params: { namespace: "Team", package: "Package", version: "1.0.0" },
  data: {},
  queryParams: {},
};

afterEach(() => {
  vi.unstubAllGlobals();
});

it.each([
  ["README", fetchPackageVersionReadmeMarkdownRaw],
  ["CHANGELOG", fetchPackageVersionChangelogMarkdownRaw],
  ["README override", fetchPackageVersionReadmeOverrideRaw],
  ["CHANGELOG override", fetchPackageVersionChangelogOverrideRaw],
])("sends the session when reading the %s", async (_, read) => {
  const fetch = vi
    .fn()
    .mockResolvedValue(Response.json({ markdown: "", is_edited: false }));
  vi.stubGlobal("fetch", fetch);

  await read(props);

  expect(fetch.mock.calls[0][1].headers).toMatchObject({
    Authorization: "Session session",
  });
});
