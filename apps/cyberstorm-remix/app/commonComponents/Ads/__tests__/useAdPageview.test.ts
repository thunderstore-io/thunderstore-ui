import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, type NavigateFunction, useNavigate } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { useAdPageview } from "../useAdPageview";

(globalThis as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT =
  true;

let container: HTMLDivElement | undefined;
let root: ReturnType<typeof createRoot> | undefined;
let navigate: NavigateFunction | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  container = undefined;
  root = undefined;
  navigate = undefined;
});

function PageviewProbe() {
  navigate = useNavigate();
  return createElement("output", null, String(useAdPageview()));
}

async function renderAt(url: string) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(
      createElement(
        MemoryRouter,
        { initialEntries: [url] },
        createElement(PageviewProbe)
      )
    );
  });
}

async function go(to: string | number, options?: { replace?: boolean }) {
  await act(async () => {
    if (typeof to === "number") {
      await navigate?.(to);
    } else {
      await navigate?.(to, options);
    }
  });
}

const pageview = () => Number(container?.querySelector("output")?.textContent);

describe("commonComponents.Ads.useAdPageview", () => {
  it("counts a route change, and going back over one", async () => {
    await renderAt("/c/riskofrain2");
    expect(pageview()).toBe(0);
    await go("/c/riskofrain2/p/team/package");
    expect(pageview()).toBe(1);
    await go(-1);
    expect(pageview()).toBe(2);
  });

  it("counts a page number change, and going back over one", async () => {
    await renderAt("/c/riskofrain2?search=valheim");
    await go("/c/riskofrain2?search=valheim&page=2");
    expect(pageview()).toBe(1);
    await go("/c/riskofrain2?search=valheim");
    expect(pageview()).toBe(2);
    await go(-1);
    expect(pageview()).toBe(3);
  });

  it("ignores search, section, sort and filter changes", async () => {
    await renderAt("/c/riskofrain2");
    await go("/c/riskofrain2?search=val", { replace: true });
    await go("/c/riskofrain2?search=val&section=modpacks");
    await go("/c/riskofrain2?search=val&section=modpacks&ordering=newest");
    await go(
      "/c/riskofrain2?search=val&section=modpacks&ordering=newest&nsfw=true"
    );
    await go(-1);
    await go(-1);
    expect(pageview()).toBe(0);
  });

  it("ignores a filter change that resets the page number", async () => {
    await renderAt("/c/riskofrain2?page=3");
    await go("/c/riskofrain2?includedCategories=1");
    expect(pageview()).toBe(0);
    await go(-1);
    expect(pageview()).toBe(0);
  });

  it("ignores hash-only and same-URL navigations", async () => {
    await renderAt("/c/riskofrain2");
    await go("/c/riskofrain2#top");
    await go("/c/riskofrain2");
    expect(pageview()).toBe(0);
  });
});
