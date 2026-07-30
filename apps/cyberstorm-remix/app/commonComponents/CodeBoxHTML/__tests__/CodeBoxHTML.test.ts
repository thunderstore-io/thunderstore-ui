import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { CodeBoxHTML, parseHighlightedLine } from "../CodeBoxHTML";
// The windowing is driven by the scroll port's real geometry, so the component's
// own stylesheet has to be applied for the scrolling test to mean anything.
import "../CodeBoxHTML.css";

(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT =
  true;

let container: HTMLDivElement | undefined;
let root: ReturnType<typeof createRoot> | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
  delete (window as unknown as Record<string, unknown>).__xss;
});

async function render(value: string, maxHeight = 600, label?: string) {
  container = document.createElement("div");
  container.style.cssText = "width:900px";
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(createElement(CodeBoxHTML, { value, maxHeight, label }));
  });
  return container;
}

/** A line of Pygments output, the shape the source API returns. */
const line = (n: number) =>
  `<span class="k">var</span><span class="w"> </span><span class="n">x${n}</span><span class="p">;</span>`;

const pygmentsFile = (lineCount: number) =>
  Array.from({ length: lineCount }, (_, i) => line(i)).join("\n");

describe("CodeBoxHTML rendering", () => {
  test("keeps the server's highlighting instead of re-deriving it", async () => {
    const el = await render(pygmentsFile(3));

    expect(el.querySelectorAll(".code-view__row")).toHaveLength(3);
    expect(el.querySelector(".code-view__code")?.innerHTML).toBe(line(0));
    // The `.highlight` scope is what the Pygments stylesheet keys off.
    expect(el.querySelector(".code-view__scroll")?.classList).toContain(
      "highlight"
    );
  });

  test("numbers the lines from one", async () => {
    const el = await render(pygmentsFile(5));
    const gutters = [...el.querySelectorAll(".code-view__gutter")].map(
      (g) => g.textContent
    );

    expect(gutters).toEqual(["1", "2", "3", "4", "5"]);
  });

  test("only mounts a window of rows for a large file", async () => {
    // The regression this guards: a decompiled assembly mounted every line at
    // once, and the resulting DOM kept the tab at 100% CPU.
    const el = await render(pygmentsFile(20_000));

    const rows = el.querySelectorAll(".code-view__row").length;
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThan(200);
    expect(el.querySelectorAll("*").length).toBeLessThan(2_000);
  });

  test("sizes the scroll surface for every line, not just the mounted ones", async () => {
    const el = await render(pygmentsFile(1_000));
    const surface = el.querySelector(".code-view__surface") as HTMLElement;

    // 1000 lines at the 20px row height.
    expect(surface.style.height).toBe("20000px");
  });

  test("sizes the width from the text, ignoring only the tags it strips", async () => {
    const el = await render('<span class="k">abcd</span>');
    const surface = el.querySelector(".code-view__surface") as HTMLElement;

    expect(surface.style.minWidth).toBe("4ch");
  });

  test("counts a tag it does not recognise, because that renders as text", async () => {
    const markup = '<div class="x">abc</div>';
    const el = await render(markup);
    const surface = el.querySelector(".code-view__surface") as HTMLElement;

    expect(surface.style.minWidth).toBe(`${markup.length}ch`);
  });

  test("renders later lines after scrolling", async () => {
    const el = await render(pygmentsFile(5_000));
    const scroller = el.querySelector(".code-view__scroll") as HTMLElement;

    await act(async () => {
      scroller.scrollTop = 10_000;
      scroller.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    const gutters = [...el.querySelectorAll(".code-view__gutter")].map((g) =>
      Number(g.textContent)
    );
    // 10000px / 20px = line 500, minus the overscan.
    expect(Math.min(...gutters)).toBeGreaterThan(400);
    expect(Math.min(...gutters)).toBeLessThanOrEqual(500);
    expect(Math.max(...gutters)).toBeGreaterThan(500);
  });

  test("shows an empty state for a missing file", async () => {
    const el = await render("");

    expect(el.querySelector(".code-view__row")).toBeNull();
    expect(el.textContent).toContain("No source available");
  });

  test("caps absurd line counts instead of building an unreachable surface", async () => {
    // Past ~1.7M rows the surface exceeds the browser's maximum element height
    // and the tail silently stops being scrollable. Truncate visibly instead.
    const el = await render("\n".repeat(250_000));
    const surface = el.querySelector(".code-view__surface") as HTMLElement;

    // Compared numerically: the browser serialises large px values in
    // exponential form ("4e+06px").
    expect(parseFloat(surface.style.height)).toBe(200_000 * 20);
    expect(el.textContent).toContain("Showing the first");
    expect(el.textContent).toContain("Download the file");
  });

  test("says nothing about truncation for an ordinary file", async () => {
    const el = await render(pygmentsFile(100));

    expect(el.textContent).not.toContain("Showing the first");
  });

  test("still renders where ResizeObserver is unavailable", async () => {
    // Only the live resize updates depend on it; losing the observer must not
    // take the whole tab down with it.
    const saved = globalThis.ResizeObserver;
    // @ts-expect-error emulating an environment without the global
    delete globalThis.ResizeObserver;
    try {
      const el = await render(pygmentsFile(3));
      expect(el.querySelectorAll(".code-view__row")).toHaveLength(3);
    } finally {
      globalThis.ResizeObserver = saved;
    }
  });

  test("lets the keyboard reach the scroll region", async () => {
    const el = await render(pygmentsFile(500), 600, "Assembly.cs");
    const scroller = el.querySelector(".code-view__scroll") as HTMLElement;

    // Nothing inside the region is focusable, so it has to be focusable itself
    // for arrow keys and PageDown to scroll it.
    expect(scroller.getAttribute("tabindex")).toBe("0");
    expect(scroller.getAttribute("aria-label")).toBe("Source of Assembly.cs");
    scroller.focus();
    expect(document.activeElement).toBe(scroller);
  });

  test("keeps the horizontal scroll range fixed while scrolling down", async () => {
    // The surface is sized from the widest line up front. If the measurement
    // disagreed with what a row actually renders, the horizontal scrollbar
    // would resize as that row scrolled into the window.
    const wide = `<div class="${"a".repeat(400)}">`;
    const lines = Array.from({ length: 400 }, (_, i) =>
      i === 380 ? wide : '<span class="n">x</span>'
    );
    const el = await render(lines.join("\n"));
    const scroller = el.querySelector(".code-view__scroll") as HTMLElement;

    const before = scroller.scrollWidth;
    await act(async () => {
      scroller.scrollTop = 380 * 20;
      scroller.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    expect(scroller.scrollWidth).toBe(before);
  });
});

describe("parseHighlightedLine", () => {
  test("splits the backend's spans into text and token classes", () => {
    expect(parseHighlightedLine(line(0))).toEqual([
      { text: "var", className: "k" },
      { text: " ", className: "w" },
      { text: "x0", className: "n" },
      { text: ";", className: "p" },
    ]);
  });

  test("decodes the entities Pygments escapes", () => {
    // These arrive escaped and must come back as characters, because they are
    // rendered as text rather than parsed as HTML.
    expect(
      parseHighlightedLine('<span class="o">&lt;&gt;&amp;&quot;&#39;</span>')
    ).toEqual([{ text: "<>&\"'", className: "o" }]);
  });

  test("keeps text with no markup at all", () => {
    expect(parseHighlightedLine("plain source line")).toEqual([
      { text: "plain source line" },
    ]);
  });

  test("drops classes outside the styled token set", () => {
    // Package contents must not be able to borrow the site's own class names.
    // A token-shaped but unknown class keeps its text and loses the class.
    expect(parseHighlightedLine('<span class="kk">x</span>')).toEqual([
      { text: "x" },
    ]);
    // A class that isn't even token-shaped (the site's names are hyphenated)
    // fails to match the span grammar at all, so the tag stays literal text.
    expect(
      parseHighlightedLine('<span class="navigation-header">x</span>')
    ).toEqual([{ text: '<span class="navigation-header">x' }]);
  });

  test("treats anything that is not the expected span shape as text", () => {
    // Not a decision about safety — these simply are not the grammar, so they
    // stay text and React escapes them on the way out.
    const notSpans = [
      "<script>alert(1)</script>",
      '<img src=x onerror="alert(1)">',
      '<span class="k" onclick="alert(1)">x</span>',
      "<SPAN CLASS=k>x</SPAN>",
      "<span class='k'>x</span>",
      "a < b && c > d",
      "<",
    ];
    for (const input of notSpans) {
      const text = parseHighlightedLine(input)
        .map((token) => token.text)
        .join("");
      // Every character survives as text, and no token carries a class.
      expect(
        parseHighlightedLine(input).every((t) => !t.className),
        input
      ).toBe(true);
      expect(text.length, input).toBeGreaterThan(0);
    }
  });
});

describe("CodeBoxHTML cannot turn source into markup", () => {
  // The viewer no longer decides whether input is safe to inject — every run of
  // text goes through React as a child. These assert that property end to end.
  const attacks = [
    "<script>window.__xss = 1</script>",
    '<img src=x onerror="window.__xss = 1">',
    '<iframe src="https://evil.example"></iframe>',
    '<span class="k" onmouseover="window.__xss = 1">hover</span>',
    '<span class="k">ok</span>\n<script>window.__xss = 1</script>',
    // No `>` anywhere, which an HTML parser would have discarded silently.
    '<img src=x onerror="window.__xss = 1"',
    // Entity-encoded so a naive decode-then-inject would resurrect the tag.
    "&lt;script&gt;window.__xss = 1&lt;/script&gt;",
  ];

  test.each(attacks)("renders %s as visible text", async (markup) => {
    const el = await render(markup);

    expect(el.querySelector("script")).toBeNull();
    expect(el.querySelector("img")).toBeNull();
    expect(el.querySelector("iframe")).toBeNull();
    expect(
      (window as unknown as Record<string, unknown>).__xss
    ).toBeUndefined();

    // Asserted over real attributes rather than innerHTML: the payload is
    // *shown* as text, so `onerror="..."` legitimately appears in the markup as
    // content. What matters is that no element carries such an attribute.
    for (const node of el.querySelectorAll("*")) {
      for (const attribute of node.attributes) {
        expect(
          attribute.name.toLowerCase(),
          node.outerHTML.slice(0, 80)
        ).not.toMatch(/^on/);
      }
    }

    // Only spans carrying a styled token class are ever created inside a row.
    for (const span of el.querySelectorAll(".code-view__code span")) {
      expect(span.attributes).toHaveLength(1);
      expect(span.getAttribute("class")).toMatch(/^[a-z0-9]+$/);
    }
  });

  test("still shows the source when it is not valid highlighting", async () => {
    const el = await render('<span class="k">keep</span><script>bad</script>');

    expect(el.textContent).toContain("keep");
    expect(el.textContent).toContain("<script>bad</script>");
  });
});

describe("one very long line cannot escape the windowing", () => {
  // Windowing bounds mounted rows, not tokens within a row, so a single line
  // packed with spans could otherwise put tens of thousands of nodes in the DOM
  // on its own.
  const packed = '<span class="k">a</span>'.repeat(50_000);

  test("caps the tokens a single line can produce", () => {
    // 50k spans in, a couple of thousand tokens out — the exact figure is the
    // cap plus the runs that close it out, so assert the bound, not a count.
    expect(parseHighlightedLine(packed).length).toBeLessThan(2_100);
  });

  test("keeps the whole line readable past the cap", () => {
    const text = parseHighlightedLine(packed)
      .map((token) => token.text)
      .join("");
    // Every "a" survives — the tail is folded into one unstyled run, not cut.
    expect(text).toBe("a".repeat(50_000));
  });

  test("bounds the DOM it mounts", async () => {
    const el = await render(packed);
    expect(el.querySelectorAll("*").length).toBeLessThan(3_000);
    expect(el.textContent).toContain("aaaa");
  });
});
