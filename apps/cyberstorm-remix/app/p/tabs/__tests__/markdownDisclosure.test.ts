import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import PackageVersionReadme from "../Readme/PackageVersionReadme";
import Readme from "../Readme/Readme";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("app/p/packageListing", () => ({}));
vi.mock("cyberstorm/utils/ssrLoader", () => ({
  ssrLoader: (loader: unknown) => loader,
  forwardLoaderHeaders: vi.fn(),
}));
vi.mock("@thunderstore/dapper-ts", () => ({ DapperTs: vi.fn() }));
vi.mock("app/commonComponents/FetchErrorState/FetchErrorState", () => ({
  FetchErrorState: () => null,
}));
vi.mock("app/p/components/TabFetchState/TabFetchState", () => ({
  TabFetchState: () => null,
}));
vi.mock("@thunderstore/cyberstorm", () => ({ SkeletonBox: () => null }));

let cleanup: (() => void) | undefined;

async function renderPage(
  component: React.ComponentType,
  data: unknown,
  setDocEdited = vi.fn()
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const router = createMemoryRouter([
    {
      path: "/",
      element: React.createElement(Outlet, { context: { setDocEdited } }),
      children: [
        {
          index: true,
          loader: () => data,
          element: React.createElement(component),
        },
      ],
    },
  ]);
  await act(async () => {
    root.render(React.createElement(RouterProvider, { router }));
  });
  cleanup = () => {
    act(() => root.unmount());
    router.dispose();
    container.remove();
  };
  return container;
}

afterEach(() => {
  cleanup?.();
});

describe("edited Markdown disclosure", () => {
  it("reports an empty latest README as edited", async () => {
    const setDocEdited = vi.fn();
    const edited_at = "2026-09-08T00:30:00Z";
    await renderPage(
      Readme,
      { readme: { html: "", is_edited: true, edited_at } },
      setDocEdited
    );
    expect(setDocEdited).toHaveBeenCalledWith({ edited_at });
  });

  it("shows the edit date for an empty historical README in UTC year-month-day form", async () => {
    const container = await renderPage(PackageVersionReadme, {
      readme: {
        html: "",
        is_edited: true,
        edited_at: "2026-09-08T23:30:00-03:00",
      },
    });
    expect(container.textContent).toContain("2026-09-09");
  });
});
