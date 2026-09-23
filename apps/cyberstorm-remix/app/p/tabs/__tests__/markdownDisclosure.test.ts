import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import PackageVersionReadme from "../Readme/PackageVersionReadme";
import Readme from "../Readme/Readme";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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
vi.mock("@thunderstore/cyberstorm", () => ({
  SkeletonBox: () => null,
  LocalDateTime: ({ time }: { time: string }) => time,
}));

let cleanup: (() => void) | undefined;

async function renderPage(component: React.ComponentType, data: unknown) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const router = createMemoryRouter([
    { path: "/", loader: () => data, element: React.createElement(component) },
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

const edited_at = "2026-09-08T00:30:00Z";

describe("edited Markdown disclosure", () => {
  it.each([
    ["latest", Readme],
    ["historical", PackageVersionReadme],
  ])("marks an empty %s README as edited", async (_, component) => {
    const container = await renderPage(component, {
      readme: { html: "", is_edited: true, edited_at },
    });
    expect(container.textContent).toContain("Edited");
    expect(container.textContent).toContain(edited_at);
  });

  it("does not mark an unedited README", async () => {
    const container = await renderPage(Readme, {
      readme: { html: "<p>x</p>", is_edited: false, edited_at: null },
    });
    expect(container.textContent).not.toContain("Edited");
  });
});
