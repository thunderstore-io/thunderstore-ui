import { getByRole } from "@testing-library/dom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import Upload from "../upload";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../../root", () => ({}));
vi.mock("cyberstorm/utils/ssrLoader", () => ({
  ssrLoader: (loader: unknown) => loader,
}));
vi.mock("cyberstorm/utils/StrongForm/useStrongForm", () => ({
  useStrongForm: () => ({ submitting: false, submit: vi.fn() }),
}));
vi.mock("@thunderstore/dapper-ts", () => ({
  DapperTs: vi.fn(),
  postPackageSubmissionMetadata: vi.fn(),
}));
vi.mock("@thunderstore/ts-uploader-react", () => ({
  useUploadProgress: () => undefined,
}));
vi.mock("../../commonComponents/ErrorBoundary/RouteErrorBoundary", () => ({
  RouteErrorBoundary: () => null,
}));
vi.mock("../../commonComponents/Page/Page", () => ({
  Page: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("../../commonComponents/PageHeader/PageHeader", () => ({
  PageHeader: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("../../commonComponents/FormSection/FormSection", () => ({
  FormSections: ({ children }: { children: React.ReactNode }) => children,
  FormSectionSeparator: () => null,
}));
vi.mock("@thunderstore/cyberstorm", () => ({
  NewAlert: ({ children }: { children: React.ReactNode }) => children,
  NewLink: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("../components/UploadFileSection", () => ({
  UploadFileSection: ({
    carryOverride,
    onCarryOverrideChange,
  }: {
    carryOverride: boolean;
    onCarryOverrideChange: (value: boolean) => void;
  }) =>
    React.createElement("button", {
      role: "switch",
      "aria-checked": carryOverride,
      onClick: () => onCarryOverrideChange(!carryOverride),
    }),
}));
vi.mock("../uploadHooks", () => ({
  usePackageFileUpload: () => ({
    file: null,
    fileWarnings: [],
    fileErrors: [],
    selectFile: vi.fn(),
    clearFile: vi.fn(),
    fileInputRef: { current: null },
  }),
  usePreviousOverrideWarning: () => ({
    versionNumber: "1.0.1",
    markdown: "Edited README",
  }),
  useSubmissionStatusPolling: () => ({
    pollingError: null,
    setPollingError: vi.fn(),
    retryPolling: vi.fn(),
  }),
  useUploadCategoryOptions: () => ({}),
}));
vi.mock("../components/UploadTeamSection", () => ({
  UploadTeamSection: ({
    authorName,
    onAuthorNameChange,
  }: {
    authorName: string;
    onAuthorNameChange: (name: string) => void;
  }) =>
    React.createElement(
      "select",
      {
        "aria-label": "Team",
        value: authorName,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          onAuthorNameChange(event.target.value),
      },
      React.createElement("option", { value: "" }, "Select team"),
      React.createElement("option", { value: "TeamA" }, "Team A"),
      React.createElement("option", { value: "TeamB" }, "Team B")
    ),
}));
vi.mock("../components/UploadCategoriesSection", () => ({
  UploadCategoriesSection: () => null,
}));
vi.mock("../components/UploadCommunitiesSection", () => ({
  UploadCommunitiesSection: () => null,
}));
vi.mock("../components/UploadNsfwSection", () => ({
  UploadNsfwSection: () => null,
}));
vi.mock("../components/UploadSubmissionStatus", () => ({
  UploadSubmissionStatus: () => null,
}));
vi.mock("../components/UploadSubmitSection", () => ({
  UploadSubmitSection: () => null,
}));

let cleanup: (() => void) | undefined;

async function renderUpload() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const router = createMemoryRouter([
    {
      path: "/",
      element: React.createElement(Outlet, {
        context: { requestConfig: () => ({}), currentUser: { teams_full: [] } },
      }),
      children: [
        {
          index: true,
          loader: () => ({ results: [] }),
          element: React.createElement(Upload),
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

afterEach(() => cleanup?.());

describe("README carry-forward opt-in", () => {
  it("resets the opt-in when the selected team changes", async () => {
    const container = await renderUpload();
    const team = getByRole(container, "combobox", {
      name: "Team",
    }) as HTMLSelectElement;
    await act(async () => {
      team.value = "TeamA";
      team.dispatchEvent(new Event("change", { bubbles: true }));
    });
    const carry = getByRole(container, "switch");
    await act(async () => carry.click());
    expect(carry.getAttribute("aria-checked")).toBe("true");
    await act(async () => {
      team.value = "TeamB";
      team.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(carry.getAttribute("aria-checked")).toBe("false");
  });
});
