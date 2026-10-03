import { Suspense, act, createElement } from "react";
import { createRoot } from "react-dom/client";
import {
  Await,
  type AwaitProps,
  RouterProvider,
  createMemoryRouter,
} from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { ApiError } from "@thunderstore/thunderstore-api";

import { FetchErrorState } from "../FetchErrorState";

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

const challengeError = () =>
  new ApiError({
    message: "403: Forbidden",
    response: {
      headers: { "cf-mitigated": "challenge" },
      status: 403,
      statusText: "Forbidden",
      url: "https://thunderstore.localhost/api/cyberstorm/listing/riskofrain2/",
    },
  });

const rejectLater = (error: unknown) =>
  new Promise<never>((_, reject) => {
    setTimeout(() => reject(error), 0);
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

async function renderAwaitError(error: unknown) {
  const resolve = rejectLater(error);
  const router = createMemoryRouter([
    {
      path: "/",
      Component: () =>
        createElement(
          Suspense,
          { fallback: createElement("p", null, "Loading") },
          createElement(
            Await,
            {
              resolve,
              errorElement: createElement(FetchErrorState, {
                message: "Couldn't load packages.",
              }),
            } as AwaitProps<unknown>,
            createElement("p", null, "Resolved")
          )
        ),
    },
  ]);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(createElement(RouterProvider, { router }));
  });
  await until(() => !text().includes("Loading"));
}

const button = () => container?.querySelector("button");

describe("FetchErrorState", () => {
  it("offers a refetch for ordinary fetch errors", async () => {
    await renderAwaitError(new Error("boom"));

    expect(text()).toContain("Couldn't load packages.");
    expect(button()?.textContent).toBe("Retry");
    expect(button()?.disabled).toBe(false);
  });

  it("offers a page reload instead of a refetch when the fetch was challenged", async () => {
    await renderAwaitError(challengeError());

    expect(text()).toContain(
      "Our security provider needs to verify your browser."
    );
    expect(text()).not.toContain("Couldn't load packages.");
    expect(button()?.textContent).toBe("Reload page");
    expect(button()?.disabled).toBe(false);
  });

  it("keeps the refetch for a challenge-shaped error that is not an ApiError", async () => {
    await renderAwaitError({
      response: { headers: { "cf-mitigated": "challenge" }, status: 403 },
    });

    expect(text()).toContain("Couldn't load packages.");
    expect(button()?.textContent).toBe("Retry");
  });
});
