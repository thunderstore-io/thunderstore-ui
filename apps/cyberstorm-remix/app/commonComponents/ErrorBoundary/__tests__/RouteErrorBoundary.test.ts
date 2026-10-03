import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { ApiError } from "@thunderstore/thunderstore-api";

import { RouteErrorBoundary } from "../RouteErrorBoundary";

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

const URL =
  "https://thunderstore.localhost/api/cyberstorm/listing/riskofrain2/";

const ssrChallenge = () =>
  new Response(
    JSON.stringify({
      status: 403,
      statusText: "Forbidden",
      url: URL,
      cfChallenge: true,
    }),
    { status: 403, headers: { "Content-Type": "application/json" } }
  );

const apiError = (headers: Record<string, string> = {}) =>
  new ApiError({
    message: "403: Forbidden",
    response: { headers, status: 403, statusText: "Forbidden", url: URL },
  });

const browserChallenge = () => apiError({ "cf-mitigated": "challenge" });

const throwing = (make: () => unknown) => () => {
  throw make();
};
const hang = () => new Promise<never>(() => {});

function scriptedRoute(steps: (() => unknown)[]) {
  const calls = { count: 0 };
  const route = {
    path: "/c/:communityId",
    ErrorBoundary: RouteErrorBoundary,
    Component: () => createElement("p", null, "Page content"),
    loader: () => {
      calls.count += 1;
      return steps.shift()?.() ?? null;
    },
  };
  return { calls, route };
}

async function mount(steps: (() => unknown)[]) {
  const { calls, route } = scriptedRoute(steps);
  const router = createMemoryRouter([route], {
    initialEntries: ["/c/riskofrain2/?search=challenge"],
  });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(createElement(RouterProvider, { router }));
  });
  return calls;
}

const text = () => container?.textContent ?? "";

async function settle(ms: number) {
  await act(async () => {
    await new Promise((r) => setTimeout(r, ms));
  });
}

async function until(predicate: () => boolean, budgetMs = 5_000) {
  const deadline = performance.now() + budgetMs;
  while (!predicate() && performance.now() < deadline) {
    await settle(25);
  }
  expect(predicate()).toBe(true);
}

describe("RouteErrorBoundary and Cloudflare challenges", () => {
  it("re-runs the loaders once in the browser after a challenged SSR fetch", async () => {
    const calls = await mount([throwing(ssrChallenge)]);

    await until(() => text().includes("Page content"));

    expect(calls.count).toBe(2);
  });

  it("renders no visible content while the browser re-run is pending", async () => {
    const calls = await mount([throwing(ssrChallenge), hang]);

    await until(() => calls.count === 2);
    await settle(200);

    expect(text()).toBe("");
    expect(document.title).toContain("Verification required");
  });

  it("shows the prompt without a third attempt when the re-run is challenged too", async () => {
    const calls = await mount([throwing(ssrChallenge), throwing(ssrChallenge)]);

    await until(
      () => calls.count === 2 && text().includes("Verification required")
    );
    await settle(200);

    expect(calls.count).toBe(2);
    expect(text()).toContain("Reload page");
    expect(text()).not.toContain("Page content");
  });

  it("shows the prompt and does not re-run for a challenged browser fetch", async () => {
    const calls = await mount([throwing(browserChallenge)]);

    await until(() => text().includes("Verification required"));
    await settle(200);

    expect(calls.count).toBe(1);
    expect(text()).toContain("Reload page");
  });

  it("keeps the plain 403 page for an ordinary forbidden response", async () => {
    const calls = await mount([throwing(() => apiError())]);

    await until(() => text().includes("Red keycard required"));

    expect(calls.count).toBe(1);
    expect(text()).not.toContain("Reload page");
  });

  it("keeps the 404 page for a not-found response", async () => {
    await mount([throwing(() => new Response(null, { status: 404 }))]);

    await until(() => text().includes("Oops! Page not found"));

    expect(text()).not.toContain("Reload page");
  });
});
