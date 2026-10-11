import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { Fragment, act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { Breadcrumbs } from "../Breadcrumbs";

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

const text = () => container?.textContent ?? "";

async function until(predicate: () => boolean, budgetMs = 5_000) {
  const deadline = performance.now() + budgetMs;
  while (!predicate() && performance.now() < deadline) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 25));
    });
  }
  expect(predicate()).toBe(true);
}

async function renderCommunityPage(community: Promise<unknown>) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        Component: () =>
          createElement(
            Fragment,
            null,
            createElement(Breadcrumbs),
            createElement(Outlet)
          ),
        children: [
          {
            id: "c/Community",
            path: "c/:communityId",
            loader: () => ({ community }),
            Component: () => createElement("p", null, "Community page"),
          },
        ],
      },
    ],
    { initialEntries: ["/c/riskofrain2"] }
  );
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(
      createElement(
        TooltipProvider,
        null,
        createElement(RouterProvider, { router })
      )
    );
  });
  await until(() => !text().includes("Loading..."));
}

describe("Breadcrumbs community crumb", () => {
  it("shows the community name once the deferred community resolves", async () => {
    await renderCommunityPage(
      new Promise((resolve) => {
        setTimeout(() => resolve({ name: "Risk of Rain 2" }), 0);
      })
    );

    expect(text()).toContain("Risk of Rain 2");
    expect(text()).toContain("Community page");
  });

  it("falls back to the community id instead of crashing the layout when the fetch fails", async () => {
    await renderCommunityPage(
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("403: Forbidden")), 0);
      })
    );

    expect(text()).toContain("riskofrain2");
    expect(text()).toContain("Community page");
    expect(text()).not.toContain("Application Error");
  });
});
