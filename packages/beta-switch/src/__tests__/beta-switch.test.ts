import { describe, expect, it, vi } from "vitest";

type TestWindow = {
  location: {
    hostname: string;
    pathname: string;
    assign: (url: string) => void;
  };
};

type TestElement = {
  tag: string;
  attributes: Map<string, string>;
  setAttribute: (key: string, value: string) => void;
  onclick?: (() => void) | null;
  innerHTML: string;
  cloneNode: (deep?: boolean) => TestElement;
};

type TestDocument = {
  readyState: "complete" | "interactive" | "loading";
  createElement: (tag: string) => TestElement;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
  querySelector: (
    selector: string
  ) => { appendChild: (child: TestElement) => void } | null;
};

describe("@thunderstore/beta-switch", () => {
  it("can be imported without window/document (SSR-safe)", async () => {
    // Ensure SSR-like environment
    const g = globalThis as unknown as { window?: unknown; document?: unknown };
    delete g.window;
    delete g.document;

    await expect(import("../index")).resolves.toBeTruthy();
  });

  it("inserts switch button into #nimbusBeta when container exists", async () => {
    const appended: TestElement[] = [];

    const desktopContainer = {
      appendChild: (child: TestElement) => appended.push(child),
    };

    const createElement = (tag: string) => {
      const element: TestElement = {
        tag,
        attributes: new Map<string, string>(),
        setAttribute: (k: string, v: string) => element.attributes.set(k, v),
        onclick: undefined,
        innerHTML: "",
        cloneNode: () => ({
          ...element,
          attributes: new Map(element.attributes),
        }),
      };
      return element;
    };

    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    const g = globalThis as unknown as { window?: unknown; document?: unknown };

    const w: TestWindow = {
      location: {
        hostname: "thunderstore.temp",
        pathname: "/",
        assign: vi.fn(),
      },
    };

    const d: TestDocument = {
      readyState: "complete",
      createElement,
      addEventListener:
        addEventListener as unknown as TestDocument["addEventListener"],
      removeEventListener:
        removeEventListener as unknown as TestDocument["removeEventListener"],
      querySelector: (selector: string) =>
        selector === "#nimbusBeta" ? desktopContainer : null,
    };

    g.window = w;
    g.document = d;

    const mod: typeof import("../index") = await import("../index");
    mod.initBetaSwitch();

    expect(appended.length).toBe(1);
    expect(appended[0].tag).toBe("button");
  });
});
