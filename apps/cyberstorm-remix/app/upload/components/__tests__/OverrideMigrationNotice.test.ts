import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PreviousOverride } from "../../../p/readmeEdit/overrideMigration";
import { OverrideMigrationNotice } from "../OverrideMigrationNotice";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
  find: vi.fn(),
  post: vi.fn(),
  toast: vi.fn(),
}));

vi.mock("@thunderstore/cyberstorm", () => ({
  NewAlert: ({ children }: { children: React.ReactNode }) => children,
  NewButton: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => React.createElement("button", { onClick, disabled }, children),
  useToast: () => ({ addToast: mocks.toast }),
}));
vi.mock("@thunderstore/thunderstore-api", () => ({
  extractApiErrorMessage: (error: Error) => error.message,
  isApiError: (error: unknown) =>
    !!error && typeof error === "object" && "response" in error,
  postPackageVersionReadme: mocks.post,
}));
vi.mock("../../../p/readmeEdit/overrideMigration", () => ({
  downloadOverrideText: vi.fn(),
  findPreviousReadmeOverride: mocks.find,
}));

const override: PreviousOverride = {
  versionNumber: "1.0.1",
  markdown: "Edited README",
};
let cleanup: (() => void) | undefined;

async function renderNotice(overrideToCarry: PreviousOverride | null) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const router = createMemoryRouter([
    {
      path: "/",
      element: React.createElement(Outlet, {
        context: { requestConfig: () => ({}) },
      }),
      children: [
        {
          index: true,
          element: React.createElement(OverrideMigrationNotice, {
            namespace: "Team",
            packageName: "Mod",
            newVersion: "2.0.0",
            overrideToCarry,
          }),
        },
      ],
    },
  ]);
  await act(async () => {
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(RouterProvider, { router })
      )
    );
  });
  cleanup = () => {
    act(() => root.unmount());
    router.dispose();
    container.remove();
  };
  return container;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.find.mockResolvedValue(override);
  mocks.post.mockResolvedValue({});
});

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe("OverrideMigrationNotice", () => {
  it("copies the override chosen on the upload form exactly once", async () => {
    await renderNotice(override);
    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(mocks.post).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { namespace: "Team", package: "Mod", version: "2.0.0" },
        data: { readme: "Edited README" },
      })
    );
    expect(mocks.find).not.toHaveBeenCalled();
  });

  it("offers a manual copy when the automatic copy fails", async () => {
    mocks.post.mockRejectedValue(new Error("offline"));
    const container = await renderNotice(override);
    expect(container.textContent).toContain("Copy edited README");
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({ csVariant: "danger" })
    );
  });

  it("only offers a copy when the submitter did not opt in", async () => {
    const container = await renderNotice(null);
    expect(mocks.find).toHaveBeenCalled();
    expect(container.textContent).toContain("Copy edited README");
    expect(mocks.post).not.toHaveBeenCalled();
  });
});
