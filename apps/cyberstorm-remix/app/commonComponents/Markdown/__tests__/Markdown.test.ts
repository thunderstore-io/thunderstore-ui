import { waitFor } from "@testing-library/dom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { Markdown } from "../Markdown";

// Opts into React's act() support; without it every render logs "The current
// testing environment is not configured to support act(...)".
(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT =
  true;

// Renders the real component (MarkdownHooks resolves its pipeline in an effect,
// so we wait for the "Loading markdown..." fallback to be replaced) and returns
// the HTML it produced. This exercises the exact plugin chain Markdown.tsx
// wires up — rehype-raw parsing embedded HTML, then nimbusSanitize allowlisting
// it — rather than a reconstruction of it, so the tests cannot drift from the
// component.
let container: HTMLDivElement | undefined;
let root: ReturnType<typeof createRoot> | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
});

async function renderMarkdown(input: string): Promise<string> {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(createElement(Markdown, { input }));
  });

  const markdown = container.querySelector(".markdown");
  await waitFor(() => {
    expect(markdown?.textContent).not.toBe("Loading markdown...");
  });
  return markdown?.innerHTML ?? "";
}

describe("Markdown renders embedded HTML the old site supported", () => {
  test("keeps <details>/<summary> collapsibles", async () => {
    const html = await renderMarkdown(
      "<details>\n<summary>Click me</summary>\n\nHidden body.\n\n</details>"
    );

    expect(html).toContain("<details>");
    expect(html).toContain("<summary>Click me</summary>");
    expect(html).toContain("Hidden body.");
  });

  test("keeps the `open` attribute on <details>", async () => {
    const html = await renderMarkdown(
      "<details open>\n<summary>Open</summary>\n\nBody\n\n</details>"
    );

    expect(html).toMatch(/<details open(="")?>/);
  });

  test("still parses markdown around and inside the raw HTML", async () => {
    const html = await renderMarkdown(
      "# Heading\n\n<details><summary>s</summary>\n\n- one\n- two\n\n</details>"
    );

    expect(html).toContain("<h1>Heading</h1>");
    expect(html).toContain("<li>one</li>");
  });
});

describe("Markdown sanitizes embedded HTML", () => {
  // rehype-raw parses whatever the author wrote, so nimbusSanitize is the only
  // thing standing between package/wiki authors and script execution. Each of
  // these is a way that has historically bypassed a markdown sanitizer.
  const attacks: [name: string, input: string][] = [
    ["script tag", "<script>window.__xss = 1</script>"],
    ["uppercase script tag", "<SCRIPT>window.__xss = 1</SCRIPT>"],
    ["img onerror", '<img src=x onerror="window.__xss = 1">'],
    ["svg onload", '<svg onload="window.__xss = 1"></svg>'],
    [
      "anchor onmouseover",
      '<a href="https://ok.example" onmouseover="window.__xss = 1">x</a>',
    ],
    [
      "details onclick",
      '<details onclick="window.__xss = 1"><summary>s</summary>b</details>',
    ],
    ["javascript: href", '<a href="javascript:window.__xss = 1">click</a>'],
    ["javascript: img src", '<img src="javascript:window.__xss = 1">'],
    ["iframe", '<iframe src="https://evil.example"></iframe>'],
    [
      "iframe srcdoc",
      '<iframe srcdoc="&lt;script&gt;window.__xss = 1&lt;/script&gt;"></iframe>',
    ],
    ["object and embed", '<object data="x.swf"></object><embed src="y.swf">'],
    ["base tag", '<base href="https://evil.example/">'],
    [
      "meta refresh",
      '<meta http-equiv="refresh" content="0;url=https://evil.example">',
    ],
    [
      "remote stylesheet",
      '<link rel="stylesheet" href="https://evil.example/x.css">',
    ],
    [
      "template wrapping a script",
      "<template><script>window.__xss = 1</script></template>",
    ],
    ["unclosed tags", "<details><summary>a</summary><script>window.__xss = 1"],
    ["comment breakout", "<!--><script>window.__xss = 1</script>-->"],
  ];

  test.each(attacks)("strips %s", async (_name, input) => {
    const html = await renderMarkdown(input);

    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<iframe/i);
    expect(html).not.toMatch(/<object/i);
    expect(html).not.toMatch(/<embed/i);
    expect(html).not.toMatch(/<base/i);
    expect(html).not.toMatch(/<meta/i);
    expect(html).not.toMatch(/<link/i);
    expect(html).not.toMatch(/<template/i);
    expect(html).not.toMatch(/\son[a-z]+=/i);
    expect(html).not.toMatch(/javascript:/i);
    expect(html).not.toMatch(/srcdoc/i);
    // Nothing above should have executed while rendering.
    expect(
      (window as unknown as Record<string, unknown>).__xss
    ).toBeUndefined();
  });

  test("drops disallowed attributes but keeps the allowed ones", async () => {
    const html = await renderMarkdown(
      '<details data-foo="bar" class="evil" style="color:red"><summary>s</summary>b</details>'
    );

    expect(html).toContain("<details>");
    expect(html).not.toContain("data-foo");
    expect(html).not.toContain("evil");
    expect(html).not.toContain("color:red");
  });

  test("keeps http(s) links intact", async () => {
    const html = await renderMarkdown('<a href="https://ok.example">ok</a>');

    expect(html).toContain('href="https://ok.example"');
  });
});
