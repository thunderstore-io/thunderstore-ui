import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

import type { PackageSubmissionStatus } from "@thunderstore/dapper/types";

import { UploadSubmissionStatus } from "../UploadSubmissionStatus";

type ActTestGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

(globalThis as ActTestGlobal).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../../../commonComponents/FormSection/FormSection", () => ({
  FormSectionSeparator: () =>
    React.createElement("hr", { "data-testid": "form-section-separator" }),
}));

vi.mock("@thunderstore/cyberstorm", () => ({
  NewAlert: ({
    children,
    csVariant,
  }: {
    children: React.ReactNode;
    csVariant: string;
  }) =>
    React.createElement(
      "div",
      { "data-variant": csVariant, "data-testid": "alert" },
      children
    ),
  NewButton: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => React.createElement("button", { type: "button", onClick }, children),
}));

vi.mock("../SubmissionResult", () => ({
  SubmissionResult: () =>
    React.createElement("div", { "data-testid": "submission-result" }),
}));

function render(element: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(element);
  });

  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

function asStatus(
  status: "PENDING" | "FINISHED",
  withResult = false
): PackageSubmissionStatus {
  return {
    id: "sub-1",
    status,
    result: withResult
      ? ({
          package_version: { name: "Test Mod" },
        } as PackageSubmissionStatus["result"])
      : undefined,
  } as PackageSubmissionStatus;
}

describe("UploadSubmissionStatus", () => {
  it("does not show retry button while submission is pending without polling error", () => {
    const { container, unmount } = render(
      React.createElement(UploadSubmissionStatus, {
        submissionStatus: asStatus("PENDING"),
        pollingError: null,
        submitSectionErrors: [],
        onRetryPolling: vi.fn(),
      })
    );

    expect(container.querySelector("button")).toBeNull();

    unmount();
  });

  it("renders submission result and section errors when present", () => {
    const { container, unmount } = render(
      React.createElement(UploadSubmissionStatus, {
        submissionStatus: asStatus("FINISHED", true),
        pollingError: null,
        submitSectionErrors: ["Submit failed"],
        onRetryPolling: vi.fn(),
      })
    );

    expect(
      container.querySelector("[data-testid='submission-result']")
    ).not.toBeNull();
    expect(container.textContent).toContain("Submit failed");
    expect(container.querySelector("button")).toBeNull();

    unmount();
  });

  it("shows polling error alert and retry when polling fails", () => {
    const { container, unmount } = render(
      React.createElement(UploadSubmissionStatus, {
        submissionStatus: asStatus("FINISHED"),
        pollingError: "network error",
        submitSectionErrors: [],
        onRetryPolling: vi.fn(),
      })
    );

    const alert = container.querySelector("[data-testid='alert']");
    expect(alert?.textContent).toContain("network error");
    expect(container.querySelector("button")?.textContent).toBe(
      "Retry Status Check"
    );

    unmount();
  });
});
