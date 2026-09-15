import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Link, Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ReadmeEdit, { clientLoader, loader } from "../ReadmeEdit";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
  download: vi.fn(),
  raw: vi.fn(),
  post: vi.fn(),
  preview: vi.fn(),
  toast: vi.fn(),
  permissions: vi.fn(),
  listing: vi.fn(),
}));

vi.mock("~/root", () => ({}));
vi.mock("cyberstorm/security/publicEnvVariables", () => ({
  getSessionTools: () => ({
    getConfig: () => ({
      apiHost: "https://api.example.invalid",
      sessionId: "session",
    }),
  }),
}));
vi.mock("cyberstorm/utils/ThunderstoreAuth", () => ({
  redirectToLogin: vi.fn(),
}));
vi.mock("cyberstorm/utils/env", () => ({
  getApiHostForSsr: () => "https://api.example.invalid",
}));
vi.mock("cyberstorm/utils/ssrLoader", () => ({ noStoreHeaders: vi.fn() }));
vi.mock("@thunderstore/dapper-ts", () => ({
  DapperTs: class {
    getPackageListingDetails = mocks.listing;
    getPackagePermissions = mocks.permissions;
  },
}));
vi.mock("@thunderstore/thunderstore-api", () => ({
  fetchPackageVersionOverrideRaw: mocks.download,
  fetchPackageVersionMarkdownRaw: mocks.raw,
  postPackageVersionMarkdown: mocks.post,
  toolsMarkdownPreview: mocks.preview,
  isApiError: (error: unknown) =>
    !!error && typeof error === "object" && "response" in error,
}));
vi.mock("../overrideMigration", () => ({
  findPreviousReadmeOverride: () => Promise.resolve(null),
}));
vi.mock("~/commonComponents/Markdown/Markdown", () => ({
  Markdown: () => null,
}));
vi.mock("~/commonComponents/Page/Page", () => ({
  Page: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("@thunderstore/cyberstorm", () => ({
  CodeInput: ({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: React.FormEventHandler<HTMLTextAreaElement>;
    disabled: boolean;
  }) =>
    React.createElement("textarea", {
      value,
      onInput: onChange,
      disabled,
      readOnly: true,
    }),
  NewAlert: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { role: "alert" }, children),
  NewButton: ({
    children,
    onClick,
    disabled,
    primitiveType,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    primitiveType?: string;
  }) =>
    primitiveType === "cyberstormLink"
      ? React.createElement(Link, { to: "/away" }, children)
      : React.createElement("button", { onClick, disabled }, children),
  NewIcon: () => null,
  NewValidationBar: ({
    children,
    message,
  }: {
    children: React.ReactNode;
    message?: string;
  }) => React.createElement("div", null, message, children),
  Tabs: ({ children }: { children: React.ReactNode }) => children,
  TooltipWrapper: ({ children }: { children: React.ReactNode }) => children,
  classnames: (...args: unknown[]) => args.filter(Boolean).join(" "),
  isRecord: (value: unknown) => !!value && typeof value === "object",
  useToast: () => ({ addToast: mocks.toast }),
}));

const params = {
  communityId: "game",
  namespaceId: "Team",
  packageId: "Mod",
  packageVersion: "1.0.0",
};
const documentState = (markdown: string, is_edited = false) => ({
  markdown,
  is_edited,
  edited_at: null,
});
let cleanup: (() => void) | undefined;

async function renderEditor(
  readme = "Packaged README",
  edited = false,
  isLatest = true
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: React.createElement(Outlet, {
          context: {
            requestConfig: () => ({ apiHost: "https://api.example.invalid" }),
          },
        }),
        children: [
          {
            path: "edit/:version?",
            loader: ({ params: routeParams }) => ({
              ...params,
              packageVersion: routeParams.version ?? params.packageVersion,
              isLatest,
              readme: documentState(
                routeParams.version ? `README ${routeParams.version}` : readme,
                edited
              ),
              changelog: documentState("Packaged changelog"),
            }),
            element: React.createElement(ReadmeEdit),
          },
          { path: "away", element: React.createElement("div", null, "Away") },
        ],
      },
    ],
    { initialEntries: ["/edit"] }
  );
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
  return { container, router };
}

async function click(container: HTMLElement, text: string) {
  const button = Array.from(container.querySelectorAll("button")).find(
    (item) => item.textContent === text
  );
  expect(button, text).toBeDefined();
  await act(async () => {
    button?.click();
  });
}

async function edit(container: HTMLElement, text: string) {
  const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
  await act(async () => {
    textarea.value = text;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function selectFile(container: HTMLElement, file: File) {
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const files = new DataTransfer();
  files.items.add(file);
  await act(async () => {
    input.files = files.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.download.mockReset().mockResolvedValue(null);
  mocks.raw.mockReset().mockResolvedValue(documentState("Packaged README"));
  mocks.post.mockReset();
  mocks.post.mockResolvedValue({
    readme: documentState("", true),
    changelog: documentState("", true),
  });
  mocks.preview.mockResolvedValue({ html: "<p>Preview</p>" });
  mocks.permissions.mockResolvedValue({
    permissions: { can_manage_wiki: true },
  });
  mocks.listing.mockResolvedValue({ latest_version_number: "1.0.0" });
});

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  vi.restoreAllMocks();
});

describe("README editor loading", () => {
  it("allows an authenticated retry after an anonymous listing 404", async () => {
    mocks.listing.mockRejectedValueOnce({ response: { status: 404 } });
    const response = await loader({ params } as never);
    expect(response).toMatchObject({
      init: { status: 404 },
      data: { ...params, __gatedSsr404: true },
    });
    expect(mocks.download).not.toHaveBeenCalled();
    expect(clientLoader.hydrate).toBe(true);

    const result = await clientLoader({
      params,
      request: new Request("https://example.invalid/edit"),
    } as never);
    expect(result).toMatchObject({ readme: documentState("Packaged README") });
    expect(mocks.permissions).toHaveBeenCalled();
  });

  it("does not treat an SSR backend failure as a hidden listing", async () => {
    const error = { response: { status: 503 } };
    mocks.listing.mockRejectedValueOnce(error);
    await expect(loader({ params } as never)).rejects.toBe(error);
  });

  it("does not hide an override download failure behind the cached endpoint", async () => {
    mocks.download.mockRejectedValue(
      new Error("Override download failed: 503")
    );
    await expect(
      clientLoader({
        params,
        request: new Request("https://example.invalid/edit"),
      } as never)
    ).rejects.toThrow("503");
    expect(mocks.raw).not.toHaveBeenCalled();
  });

  it("allows an absent changelog", async () => {
    mocks.raw.mockImplementation(({ document }) =>
      document === "changelog"
        ? Promise.reject({ response: { status: 404 } })
        : Promise.resolve(documentState("Cached edit", true))
    );
    const result = await clientLoader({
      params,
      request: new Request("https://example.invalid/edit"),
    } as never);
    expect(result).toMatchObject({
      readme: documentState("Cached edit", true),
      changelog: null,
    });
  });
});

describe("README editor", () => {
  it("keeps an unavailable changelog tab focusable without switching documents", async () => {
    const { container } = await renderEditor("Historical README", false, false);
    const tab = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "CHANGELOG"
    )!;
    expect(tab.getAttribute("aria-disabled")).toBe("true");
    tab.focus();
    expect(document.activeElement).toBe(tab);
    await act(async () => tab.click());
    expect(container.querySelector("textarea")?.value).toBe(
      "Historical README"
    );
    expect(tab.getAttribute("aria-current")).toBe("false");
  });

  it("loads fresh state when navigating to another package version", async () => {
    const { container, router } = await renderEditor();
    await act(async () => {
      await router.navigate("/edit/2.0.0");
    });
    expect(container.textContent).toContain("2.0.0");
    expect(container.querySelector("textarea")?.value).toBe("README 2.0.0");
  });

  it("preserves a draft when the current route revalidates", async () => {
    const { container, router } = await renderEditor();
    await edit(container, "Unsaved README");
    await act(async () => {
      await router.revalidate();
    });
    expect(container.querySelector("textarea")?.value).toBe("Unsaved README");
  });

  it("does not replace newer typing with a delayed file read", async () => {
    const { container } = await renderEditor();
    let finishRead!: (text: string) => void;
    const file = new File(["Imported README"], "README.md");
    vi.spyOn(file, "text").mockReturnValue(
      new Promise<string>((resolve) => {
        finishRead = resolve;
      })
    );
    await selectFile(container, file);
    await edit(container, "Newer typing");
    await act(async () => {
      finishRead("Imported README");
    });
    expect(container.querySelector("textarea")?.value).toBe("Newer typing");
  });

  it("applies a delayed file read to its original document after switching tabs", async () => {
    const { container } = await renderEditor();
    let finishRead!: (text: string) => void;
    const file = new File(["Imported README"], "README.md");
    vi.spyOn(file, "text").mockReturnValue(
      new Promise<string>((resolve) => {
        finishRead = resolve;
      })
    );
    await selectFile(container, file);
    await click(container, "CHANGELOG");
    await act(async () => {
      finishRead("Imported README");
    });
    expect(container.querySelector("textarea")?.value).toBe(
      "Packaged changelog"
    );
    await click(container, "README");
    expect(container.querySelector("textarea")?.value).toBe("Imported README");
  });

  it("ignores an older file read when a newer selection finishes first", async () => {
    const { container } = await renderEditor();
    let finishRead!: (text: string) => void;
    const first = new File(["First"], "first.md");
    vi.spyOn(first, "text").mockReturnValue(
      new Promise<string>((resolve) => {
        finishRead = resolve;
      })
    );
    await selectFile(container, first);
    const second = new File(["Second"], "second.md");
    vi.spyOn(second, "text").mockResolvedValue("Second");
    await selectFile(container, second);
    expect(container.querySelector("textarea")?.value).toBe("Second");
    await act(async () => {
      finishRead("First");
    });
    expect(container.querySelector("textarea")?.value).toBe("Second");
  });

  it("ignores a file read that completes after saving", async () => {
    const { container } = await renderEditor();
    await edit(container, "Saved README");
    let finishRead!: (text: string) => void;
    const file = new File(["Imported README"], "README.md");
    vi.spyOn(file, "text").mockReturnValue(
      new Promise<string>((resolve) => {
        finishRead = resolve;
      })
    );
    await selectFile(container, file);
    await click(container, "Save");
    await act(async () => {
      finishRead("Imported README");
    });
    expect(container.querySelector("textarea")?.value).toBe("Saved README");
  });

  it("ignores a file-read failure after navigating away", async () => {
    const { container, router } = await renderEditor();
    let failRead!: (reason: Error) => void;
    const file = new File(["Imported README"], "README.md");
    vi.spyOn(file, "text").mockReturnValue(
      new Promise<string>((_, reject) => {
        failRead = reject;
      })
    );
    await selectFile(container, file);
    await act(async () => {
      await router.navigate("/away");
    });
    await act(async () => {
      failRead(new Error("Read failed"));
    });
    expect(mocks.toast).not.toHaveBeenCalled();
  });

  it("applies a delayed save to its original document after switching tabs", async () => {
    const { container } = await renderEditor();
    let finishSave!: (value: unknown) => void;
    mocks.post.mockReturnValueOnce(
      new Promise((resolve) => {
        finishSave = resolve;
      })
    );
    await edit(container, "Saved README");
    await click(container, "Save");
    await click(container, "CHANGELOG");
    await act(async () => {
      finishSave({
        readme: documentState("", true),
        changelog: documentState("", false),
      });
    });
    expect(container.querySelector("textarea")?.value).toBe(
      "Packaged changelog"
    );
    await click(container, "README");
    expect(container.querySelector("textarea")?.value).toBe("Saved README");
    const save = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Save"
    );
    expect(save?.disabled).toBe(true);
  });

  it("retains text and offers reload after discard succeeds but fetching content fails", async () => {
    const { container } = await renderEditor("Edited README", true);
    mocks.raw.mockRejectedValueOnce(new Error("offline"));
    await click(container, "Discard site edit");
    await click(container, "Confirm: restore packaged content");
    expect(container.querySelector("textarea")?.value).toBe("Edited README");
    expect(container.querySelector("textarea")?.disabled).toBe(true);
    expect(container.textContent).toContain("Reload README");
    expect(mocks.toast).not.toHaveBeenCalledWith(
      expect.objectContaining({ csVariant: "success" })
    );
    await click(container, "Reload README");
    expect(container.querySelector("textarea")?.value).toBe("Packaged README");
    expect(container.querySelector("textarea")?.disabled).toBe(false);
    expect(mocks.post).toHaveBeenCalledTimes(1);
  });

  it("does not label a cached override as restored packaged content", async () => {
    const { container } = await renderEditor("Edited README", true);
    mocks.raw.mockResolvedValue(documentState("Cached override", true));
    await click(container, "Discard site edit");
    await click(container, "Confirm: restore packaged content");
    expect(container.querySelector("textarea")?.value).toBe("Edited README");
    expect(container.textContent).toContain("Reload README");
  });

  it("accepts a missing packaged changelog after discarding its override", async () => {
    const { container } = await renderEditor();
    await click(container, "CHANGELOG");
    await edit(container, "Edited changelog");
    await click(container, "Save");
    mocks.raw.mockRejectedValue({ response: { status: 404 } });
    await click(container, "Discard site edit");
    await click(container, "Confirm: restore packaged content");
    expect(container.querySelector("textarea")?.value).toBe("");
    expect(container.querySelector("textarea")?.disabled).toBe(false);
    expect(container.textContent).not.toContain("Reload CHANGELOG");
  });

  it("guards navigation and unloading when an inactive document is dirty", async () => {
    const { container, router } = await renderEditor();
    await edit(container, "Unsaved README");
    await click(container, "CHANGELOG");
    const unload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    await act(async () => {
      await router.navigate("/away");
    });
    expect(router.state.location.pathname).toBe("/edit");
    expect(confirm).toHaveBeenCalledTimes(1);
    confirm.mockReturnValue(true);
    await act(async () => {
      await router.navigate("/away");
    });
    expect(router.state.location.pathname).toBe("/away");
  });

  it("does not block navigation after saving", async () => {
    const { container, router } = await renderEditor();
    await edit(container, "Saved README");
    await click(container, "Save");
    expect(container.querySelector("textarea")?.value).toBe("Saved README");
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    await act(async () => {
      await router.navigate("/away");
    });
    expect(router.state.location.pathname).toBe("/away");
    expect(confirm).not.toHaveBeenCalled();
  });

  it("counts Unicode code points rather than UTF-16 units", async () => {
    const { container } = await renderEditor();
    const text = "😀".repeat(100000);
    await edit(container, text);
    await click(container, "Save");
    expect(mocks.post).toHaveBeenCalledWith(
      expect.objectContaining({ data: { readme: text } })
    );
    await edit(container, text + "x");
    const save = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Save"
    );
    expect(save?.disabled).toBe(true);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });
    expect(mocks.preview).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: { markdown: text } })
    );
  });
});
