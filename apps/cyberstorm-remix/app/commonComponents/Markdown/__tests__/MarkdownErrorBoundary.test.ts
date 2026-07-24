import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { Markdown } from "../Markdown";

(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT =
  true;

let container: HTMLDivElement | undefined;
let root: ReturnType<typeof createRoot> | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
});

async function render(input: string, budgetMs = 20_000) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(createElement(Markdown, { input }));
  });
  const deadline = performance.now() + budgetMs;
  while (
    container.textContent === "Loading markdown..." &&
    performance.now() < deadline
  ) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 25));
    });
  }
  return container;
}

// Two shapes the converter walks recursively. Kept as generators so the depth
// is a knob rather than a fixture — the point is that the boundary holds for
// documents the conversion cannot finish, not these particular numbers.
const nestedElements = (depth: number) =>
  "<div>".repeat(depth) + "nested element text" + "</div>".repeat(depth);

const nestedBlocks = (depth: number) =>
  ">".repeat(depth) + " nested block text";

describe("Markdown survives documents the converter cannot finish", () => {
  test.each([
    [
      "moderately nested elements",
      nestedElements(2_000),
      "nested element text",
    ],
    ["deeply nested elements", nestedElements(20_000), "nested element text"],
    ["deeply nested blocks", nestedBlocks(20_000), "nested block text"],
  ])("renders %s as text instead of failing", async (_name, input, needle) => {
    const el = await render(input);

    // The tab is alive, the page still has a markdown region, and the author's
    // content is still legible.
    expect(el.querySelector(".markdown")).not.toBeNull();
    expect(el.textContent).toContain(needle);
    expect(el.textContent).not.toBe("Loading markdown...");
  });

  test("ordinary documents are unaffected by the boundary", async () => {
    const el = await render(
      "# Title\n\n<details><summary>s</summary>\n\nbody\n\n</details>"
    );

    expect(el.querySelector("h1")?.textContent).toBe("Title");
    expect(el.querySelector("details")).not.toBeNull();
    expect(el.querySelector(".markdown__fallback")).toBeNull();
  });

  test("one unconvertible document does not affect the next", async () => {
    // The boundary latches on error; without a reset keyed to the input, every
    // page visited afterwards would render as plain text too.
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(createElement(Markdown, { input: nestedElements(20_000) }));
    });
    let deadline = performance.now() + 20_000;
    while (
      container.textContent === "Loading markdown..." &&
      performance.now() < deadline
    ) {
      await act(async () => {
        await new Promise((r) => setTimeout(r, 25));
      });
    }
    expect(container.querySelector(".markdown__fallback")).not.toBeNull();

    await act(async () => {
      root?.render(createElement(Markdown, { input: "# Recovered" }));
    });
    deadline = performance.now() + 20_000;
    while (
      container.querySelector("h1") === null &&
      performance.now() < deadline
    ) {
      await act(async () => {
        await new Promise((r) => setTimeout(r, 25));
      });
    }

    expect(container.querySelector("h1")?.textContent).toBe("Recovered");
    expect(container.querySelector(".markdown__fallback")).toBeNull();
  });
});
