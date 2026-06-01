import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

import { SectionErrors } from "../SectionErrors";

type ActTestGlobal = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

(globalThis as ActTestGlobal).IS_REACT_ACT_ENVIRONMENT = true;

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

describe("SectionErrors", () => {
  it("renders nothing when there are no errors", () => {
    const { container, unmount } = render(
      React.createElement(SectionErrors, { errors: [] })
    );

    expect(container.textContent).toBe("");
    unmount();
  });

  it("renders a danger alert listing each error", () => {
    const { container, unmount } = render(
      React.createElement(SectionErrors, {
        errors: ["First error", "Second error"],
      })
    );

    const alert = container.querySelector("[data-testid='alert']");
    expect(alert?.getAttribute("data-variant")).toBe("danger");
    expect(container.textContent).toContain("First error");
    expect(container.textContent).toContain("Second error");

    unmount();
  });
});
