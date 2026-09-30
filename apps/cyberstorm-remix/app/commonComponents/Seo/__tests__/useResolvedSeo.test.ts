import type { SeoReturn } from "cyberstorm/utils/meta";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import type { UIMatch } from "react-router";
import { describe, expect, it } from "vitest";

import { useResolvedSeo } from "../useResolvedSeo";

type ActTestGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

(globalThis as ActTestGlobal).IS_REACT_ACT_ENVIRONMENT = true;

const ROOT_SEO: SeoReturn = { descriptors: [{ title: "Thunderstore" }] };

function communitySeo(name: string): SeoReturn {
  return {
    descriptors: [
      { title: `${name} Mods` },
      { property: "og:url", content: `https://thunderstore.io/c/${name}/` },
    ],
  };
}

function matches(seo: unknown): UIMatch<unknown, unknown>[] {
  return [
    { id: "root", data: { seo: ROOT_SEO } },
    { id: "c/Community", data: { seo } },
  ] as UIMatch<unknown, unknown>[];
}

/**
 * Renders the hook and returns its latest value plus a setter for the matches,
 * so a test can navigate the way React Router would.
 */
function renderHook(initial: UIMatch<unknown, unknown>[]) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const harness = {
    latest: undefined as SeoReturn | undefined,
    render(next: UIMatch<unknown, unknown>[]) {
      act(() => {
        root.render(React.createElement(Harness, { matches: next }));
      });
    },
    async flush() {
      await act(async () => {
        await Promise.resolve();
      });
    },
    unmount() {
      act(() => root.unmount());
      container.remove();
    },
  };

  function Harness({ matches }: { matches: UIMatch<unknown, unknown>[] }) {
    harness.latest = useResolvedSeo(matches);
    return null;
  }

  harness.render(initial);
  return harness;
}

describe("useResolvedSeo", () => {
  it("merges resolved seo without waiting for anything", () => {
    const harness = renderHook(matches(communitySeo("how-to-fish")));

    expect(harness.latest?.descriptors[0]).toEqual({
      title: "how-to-fish Mods",
    });

    harness.unmount();
  });

  // The point of the promise support: the navigation renders before the
  // community arrives, and the title follows once it does.
  it("adds a promised route's descriptors once it settles", async () => {
    const harness = renderHook(
      matches(Promise.resolve(communitySeo("how-to-fish")))
    );

    expect(harness.latest).toEqual(ROOT_SEO);

    await harness.flush();

    expect(harness.latest?.descriptors).toEqual([
      { title: "how-to-fish Mods" },
      {
        property: "og:url",
        content: "https://thunderstore.io/c/how-to-fish/",
      },
    ]);

    harness.unmount();
  });

  // Keeping the previous value here would put the community you came from in
  // the tab title while the next one loads.
  it("drops a route's tags while it fetches different data", async () => {
    const harness = renderHook(
      matches(Promise.resolve(communitySeo("how-to-fish")))
    );
    await harness.flush();

    let resolveNext: (seo: SeoReturn) => void = () => undefined;
    harness.render(
      matches(
        new Promise<SeoReturn>((resolve) => {
          resolveNext = resolve;
        })
      )
    );

    expect(harness.latest).toEqual(ROOT_SEO);

    resolveNext(communitySeo("how-to-bake"));
    await harness.flush();

    expect(harness.latest?.descriptors[0]).toEqual({
      title: "how-to-bake Mods",
    });

    harness.unmount();
  });

  // The common case: navigating inside a community does not revalidate the
  // layout route, so it hands over the same promise and the tags stay put.
  it("keeps the tags when the route hands over the same promise", async () => {
    const promised = Promise.resolve(communitySeo("how-to-fish"));
    const harness = renderHook(matches(promised));
    await harness.flush();

    harness.render(matches(promised));

    expect(harness.latest?.descriptors[0]).toEqual({
      title: "how-to-fish Mods",
    });

    harness.unmount();
  });

  it("leaves the tags alone when the data never arrives", async () => {
    const harness = renderHook(matches(Promise.resolve(undefined)));

    await harness.flush();

    expect(harness.latest).toEqual(ROOT_SEO);

    harness.unmount();
  });

  it("does not resolve a rejected promise into the head", async () => {
    const harness = renderHook(matches(Promise.reject(new Error("offline"))));

    await harness.flush();

    expect(harness.latest).toEqual(ROOT_SEO);

    harness.unmount();
  });
});
