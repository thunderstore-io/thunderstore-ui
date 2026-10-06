import { describe, expect, it } from "vitest";

import { isWikiEditorPath } from "../wikiPaths";

const WIKI = "/c/how-to-fish/p/ebkr/r2modman/wiki";

describe("isWikiEditorPath", () => {
  it("is the create form", () => {
    expect(isWikiEditorPath(`${WIKI}/new`, undefined)).toBe(true);
    expect(isWikiEditorPath(`${WIKI}/new/`, undefined)).toBe(true);
  });

  it("is the edit form", () => {
    expect(isWikiEditorPath(`${WIKI}/1459-a-page/edit`, "1459-a-page")).toBe(
      true
    );
  });

  it("is not the wiki index", () => {
    expect(isWikiEditorPath(WIKI, undefined)).toBe(false);
    expect(isWikiEditorPath(`${WIKI}/`, undefined)).toBe(false);
  });

  it("is not a page someone reads", () => {
    expect(isWikiEditorPath(`${WIKI}/1459-a-page`, "1459-a-page")).toBe(false);
  });

  // Slugs are free-form text, so they can collide with the route's own
  // segments. The backend prefixes them with the page id today, but nothing
  // here should depend on that.
  it("reads a page slugged wiki as a page, and its editor as an editor", () => {
    expect(isWikiEditorPath(`${WIKI}/wiki`, "wiki")).toBe(false);
    expect(isWikiEditorPath(`${WIKI}/wiki/edit`, "wiki")).toBe(true);
  });

  it("reads a page slugged edit as a page", () => {
    expect(isWikiEditorPath(`${WIKI}/edit`, "edit")).toBe(false);
    expect(isWikiEditorPath(`${WIKI}/edit/edit`, "edit")).toBe(true);
  });

  // React Router decodes route params before handing them over, so the path
  // has to be decoded to be compared against them.
  it("sees through percent-encoded segments", () => {
    expect(isWikiEditorPath(`${WIKI}/%6Eew`, undefined)).toBe(true);
    expect(isWikiEditorPath(`${WIKI}/1459-a%2Dpage/edit`, "1459-a-page")).toBe(
      true
    );
    expect(isWikiEditorPath(`${WIKI}/1459-a%2Dpage`, "1459-a-page")).toBe(
      false
    );
  });

  it("does not throw on a malformed escape", () => {
    expect(isWikiEditorPath(`${WIKI}/%E0%A4%A/edit`, "1459-a-page")).toBe(
      false
    );
    expect(isWikiEditorPath(`${WIKI}/%/new`, undefined)).toBe(false);
  });

  // The router matches static segments without regard to case, so these reach
  // the editors too.
  it("sees through uppercase static segments", () => {
    expect(isWikiEditorPath(`${WIKI}/NEW`, undefined)).toBe(true);
    expect(isWikiEditorPath(`${WIKI}/1459-a-page/EDIT`, "1459-a-page")).toBe(
      true
    );
    expect(isWikiEditorPath(`${WIKI}/1459-a-page/Edit`, "1459-a-page")).toBe(
      true
    );
  });

  // The slug keeps the case the URL used, and the router hands it over that
  // way, so the two agree without lowercasing either.
  it("matches an uppercase slug exactly", () => {
    expect(isWikiEditorPath(`${WIKI}/1459-A-Page/edit`, "1459-A-Page")).toBe(
      true
    );
    expect(isWikiEditorPath(`${WIKI}/1459-A-Page`, "1459-A-Page")).toBe(false);
  });

  it("is unconfused by a package named wiki", () => {
    const nested = "/c/how-to-fish/p/ebkr/wiki/wiki";
    expect(isWikiEditorPath(`${nested}/new`, undefined)).toBe(true);
    expect(isWikiEditorPath(nested, undefined)).toBe(false);
  });
});
