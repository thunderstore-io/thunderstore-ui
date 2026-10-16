import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Changelog from "../Changelog/Changelog";
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
  TabFetchState: ({ message }: { message: string }) => message,
}));
vi.mock("@thunderstore/cyberstorm", () => ({
  SkeletonBox: () => null,
  formatToDisplayName: (name: string) => name,
  LocalDateTime: ({ time }: { time: string }) =>
    React.createElement("time", { dateTime: time }),
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

function setMarkdownEditing(enabled: boolean) {
  window.NIMBUS_PUBLIC_ENV = enabled
    ? { VITE_ENABLE_MARKDOWN_EDITING: "true" }
    : {};
}

beforeEach(() => {
  setMarkdownEditing(true);
});

afterEach(() => {
  cleanup?.();
});

const editedAt = "2026-09-08T00:30:00Z";

describe("edited Markdown disclosure", () => {
  it.each([
    ["latest", Readme],
    ["historical", PackageVersionReadme],
  ])("marks an edited %s README with its edit date", async (_, component) => {
    const container = await renderPage(component, {
      readme: { html: "<p>x</p>", is_edited: true, edited_at: editedAt },
    });
    expect(container.textContent).toContain("Edited");
    expect(container.querySelector("time")?.getAttribute("datetime")).toBe(
      editedAt
    );
  });

  it("keeps the empty state for a README edited down to nothing", async () => {
    const container = await renderPage(Readme, {
      readme: { html: "", is_edited: true, edited_at: editedAt },
    });
    expect(container.textContent).toContain("Edited");
    expect(container.textContent).toContain("No details available");
  });

  it("marks an edited CHANGELOG", async () => {
    const container = await renderPage(Changelog, {
      changelog: { html: "<p>x</p>", is_edited: true, edited_at: editedAt },
    });
    expect(container.textContent).toContain("Edited");
  });

  it("does not mark an unedited README", async () => {
    const container = await renderPage(Readme, {
      readme: { html: "<p>x</p>", is_edited: false, edited_at: null },
    });
    expect(container.textContent).not.toContain("Edited");
  });

  it("renders an edited README like master while markdown editing is off", async () => {
    setMarkdownEditing(false);
    const container = await renderPage(Readme, {
      readme: { html: "<p>x</p>", is_edited: true, edited_at: editedAt },
    });
    const wrapper = container.querySelector(".markdown-wrapper");
    expect(wrapper?.children).toHaveLength(1);
    expect(container.textContent).not.toContain("Edited");
  });

  it.each([
    ["an emptied", { html: "", is_edited: true, edited_at: editedAt }],
    ["a missing", null],
  ])(
    "renders %s README like master while markdown editing is off",
    async (_, readme) => {
      setMarkdownEditing(false);
      const container = await renderPage(Readme, { readme });
      expect(container.querySelector(".markdown-wrapper")).toBeNull();
      expect(container.textContent).toBe("No details available");
    }
  );
});
