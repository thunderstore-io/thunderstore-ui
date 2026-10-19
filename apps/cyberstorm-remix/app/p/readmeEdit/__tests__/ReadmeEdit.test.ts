import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Link, Outlet, RouterProvider, createMemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ReadmeEdit, { clientLoader, loader } from "../ReadmeEdit";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
  readme: { download: vi.fn(), update: vi.fn(), discard: vi.fn() },
  changelog: { download: vi.fn(), update: vi.fn(), discard: vi.fn() },
  raw: vi.fn(),
  preview: vi.fn(),
  toast: vi.fn(),
  permissions: vi.fn(),
  listing: vi.fn(),
  markdownEditingEnabled: vi.fn(),
  previousOverride: vi.fn(),
}));

vi.mock("cyberstorm/security/publicEnvVariables", () => ({
  getSessionTools: () => ({
    getConfig: () => ({
      apiHost: "https://api.example.invalid",
      sessionId: "session",
    }),
  }),
}));
vi.mock("cyberstorm/utils/env", () => ({
  isMarkdownEditingEnabled: mocks.markdownEditingEnabled,
}));
vi.mock("cyberstorm/utils/ThunderstoreAuth", () => ({
  redirectToLogin: vi.fn(),
}));
vi.mock("cyberstorm/utils/gatedSsr", () => ({
  hasSessionCookie: () => true,
}));
vi.mock("cyberstorm/utils/ssrLoader", () => ({ noStoreHeaders: vi.fn() }));
vi.mock("@thunderstore/dapper-ts", () => ({
  DapperTs: class {
    getPackageListingDetails = mocks.listing;
    getPackagePermissions = mocks.permissions;
  },
}));
vi.mock("@thunderstore/thunderstore-api", () => ({
  fetchPackageVersionReadmeOverrideRaw: mocks.readme.download,
  fetchPackageVersionChangelogOverrideRaw: mocks.changelog.download,
  fetchPackageVersionReadmeMarkdownRaw: (props: object) =>
    mocks.raw({ ...props, document: "readme" }),
  fetchPackageVersionChangelogMarkdownRaw: (props: object) =>
    mocks.raw({ ...props, document: "changelog" }),
  extractApiErrorMessage: (error: Error) => error.message,
  extractApiFieldErrorMessage: () => "",
  updatePackageVersionReadmeOverride: mocks.readme.update,
  updatePackageVersionChangelogOverride: mocks.changelog.update,
  deletePackageVersionReadmeOverride: mocks.readme.discard,
  deletePackageVersionChangelogOverride: mocks.changelog.discard,
  toolsMarkdownPreview: mocks.preview,
  isApiError: (error: unknown) =>
    !!error && typeof error === "object" && "response" in error,
}));
vi.mock("../overrideMigration", () => ({
  findPreviousReadmeOverride: mocks.previousOverride,
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
  Modal: Object.assign(
    ({
      trigger,
      open,
      onOpenChange,
      children,
    }: {
      trigger: React.ReactElement<{ onClick?: () => void }>;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      children: React.ReactNode;
    }) =>
      React.createElement(
        React.Fragment,
        null,
        React.cloneElement(trigger, { onClick: () => onOpenChange(true) }),
        open ? children : null
      ),
    {
      Body: ({ children }: { children: React.ReactNode }) => children,
      Footer: ({ children }: { children: React.ReactNode }) => children,
    }
  ),
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
  SkeletonBox: () => null,
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
const documentState = (markdown: string | null, is_edited = false) => ({
  markdown,
  is_edited,
  edited_at: null,
});
const encode = (text: string) => new TextEncoder().encode(text).buffer;
let cleanup: (() => void) | undefined;

async function renderEditor(
  readme = "Packaged README",
  edited = false,
  isLatest = true,
  needsReload = false
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
              readme: {
                ...documentState(
                  routeParams.version
                    ? `README ${routeParams.version}`
                    : readme,
                  edited
                ),
                needsReload,
              },
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
  for (const api of [mocks.readme, mocks.changelog]) {
    api.download.mockReset().mockResolvedValue(null);
    api.update.mockReset().mockResolvedValue(documentState("", true));
  }
  mocks.readme.discard
    .mockReset()
    .mockResolvedValue(documentState("Packaged README"));
  mocks.changelog.discard
    .mockReset()
    .mockResolvedValue(documentState("Packaged changelog"));
  mocks.raw.mockReset().mockResolvedValue(documentState("Packaged README"));
  mocks.preview.mockResolvedValue({ html: "<p>Preview</p>" });
  mocks.permissions.mockResolvedValue({
    permissions: { can_manage_wiki: true },
  });
  mocks.listing.mockResolvedValue({ latest_version_number: "1.0.0" });
  mocks.markdownEditingEnabled.mockReturnValue(true);
  mocks.previousOverride.mockReset().mockResolvedValue(null);
});

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const request = new Request("https://example.invalid/edit?document=changelog");

describe("README editor loading", () => {
  it("returns 404 while markdown editing is off", async () => {
    mocks.markdownEditingEnabled.mockReturnValue(false);
    await expect(loader({ params } as never)).rejects.toHaveProperty(
      "status",
      404
    );
    await expect(
      clientLoader({ params, request } as never)
    ).rejects.toHaveProperty("status", 404);
    expect(mocks.permissions).not.toHaveBeenCalled();
  });

  it("retries a hidden version's listing with the session", async () => {
    mocks.listing.mockImplementation((...args: unknown[]) =>
      args[4] === true
        ? Promise.resolve({ latest_version_number: "1.0.0" })
        : Promise.reject({ response: { status: 404 } })
    );
    const result = await clientLoader({ params, request } as never);
    expect(result).toMatchObject({ readme: documentState("Packaged README") });
    expect(mocks.listing).toHaveBeenNthCalledWith(
      1,
      "game",
      "Team",
      "Mod",
      "1.0.0"
    );
    expect(mocks.listing).toHaveBeenNthCalledWith(
      2,
      "game",
      "Team",
      "Mod",
      "1.0.0",
      true
    );
  });

  it("does not hide an override download failure behind the cached endpoint", async () => {
    mocks.readme.download.mockRejectedValue(
      new Error("Override download failed: 503")
    );
    await expect(clientLoader({ params, request } as never)).rejects.toThrow(
      "503"
    );
    expect(mocks.raw).not.toHaveBeenCalledWith(
      expect.objectContaining({ document: "readme" })
    );
  });

  it("locks a document whose cached response still shows a discarded edit", async () => {
    mocks.raw.mockResolvedValue(documentState("Discarded edit", true));
    const result = await clientLoader({ params, request } as never);
    expect(result).toMatchObject({
      readme: { markdown: "", is_edited: false, needsReload: true },
    });
  });

  it("loads the changelog on the latest version", async () => {
    mocks.raw.mockImplementation(({ document }) =>
      Promise.resolve(
        documentState(document === "changelog" ? null : "Packaged README")
      )
    );
    const result = await clientLoader({ params, request } as never);
    expect(result).toMatchObject({
      readme: documentState("Packaged README"),
      changelog: documentState(null),
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
    vi.spyOn(file, "arrayBuffer").mockReturnValue(
      new Promise<ArrayBuffer>((resolve) => {
        finishRead = (text) => resolve(encode(text));
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
    vi.spyOn(file, "arrayBuffer").mockReturnValue(
      new Promise<ArrayBuffer>((resolve) => {
        finishRead = (text) => resolve(encode(text));
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
    vi.spyOn(first, "arrayBuffer").mockReturnValue(
      new Promise<ArrayBuffer>((resolve) => {
        finishRead = (text) => resolve(encode(text));
      })
    );
    await selectFile(container, first);
    const second = new File(["Second"], "second.md");
    vi.spyOn(second, "arrayBuffer").mockResolvedValue(encode("Second"));
    await selectFile(container, second);
    expect(container.querySelector("textarea")?.value).toBe("Second");
    await act(async () => {
      finishRead("First");
    });
    expect(container.querySelector("textarea")?.value).toBe("Second");
  });

  it("ignores a file-read failure after navigating away", async () => {
    const { container, router } = await renderEditor();
    let failRead!: (reason: Error) => void;
    const file = new File(["Imported README"], "README.md");
    vi.spyOn(file, "arrayBuffer").mockReturnValue(
      new Promise<ArrayBuffer>((_, reject) => {
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

  it("rejects a file that is not UTF-8 text", async () => {
    const { container } = await renderEditor();
    await selectFile(
      container,
      new File([new Uint8Array([0xff, 0xfe, 0x41, 0x00])], "README.md")
    );
    await vi.waitFor(() =>
      expect(mocks.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          csVariant: "danger",
          children: "README.md could not be read. Make sure it is UTF-8 text.",
        })
      )
    );
    expect(container.querySelector("textarea")?.value).toBe("Packaged README");
  });

  it("applies a delayed save to its original document after switching tabs", async () => {
    const { container } = await renderEditor();
    let finishSave!: (value: unknown) => void;
    mocks.readme.update.mockReturnValueOnce(
      new Promise((resolve) => {
        finishSave = resolve;
      })
    );
    await edit(container, "Saved README");
    await click(container, "Save");
    await click(container, "CHANGELOG");
    await act(async () => {
      finishSave(documentState("", true));
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

  it("restores the packaged README from the discard response", async () => {
    const { container } = await renderEditor("Edited README", true);
    await click(container, "Discard site edit");
    await click(container, "Discard");
    expect(mocks.readme.discard).toHaveBeenCalledTimes(1);
    expect(mocks.raw).not.toHaveBeenCalled();
    expect(container.querySelector("textarea")?.value).toBe("Packaged README");
    expect(container.querySelector("textarea")?.disabled).toBe(false);
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({ csVariant: "success" })
    );
  });

  it("keeps the site edit when discarding fails", async () => {
    const { container } = await renderEditor("Edited README", true);
    mocks.readme.discard.mockRejectedValueOnce(new Error("offline"));
    await click(container, "Discard site edit");
    await click(container, "Discard");
    expect(container.querySelector("textarea")?.value).toBe("Edited README");
    expect(mocks.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        csVariant: "danger",
        children: "Discard failed: offline",
      })
    );
  });

  it("stays locked until the packaged README is no longer cached", async () => {
    const { container } = await renderEditor("", false, true, true);
    mocks.raw.mockResolvedValueOnce(documentState("Cached override", true));
    await click(container, "Reload README");
    expect(container.querySelector("textarea")?.disabled).toBe(true);
    await click(container, "Reload README");
    expect(container.querySelector("textarea")?.value).toBe("Packaged README");
    expect(container.querySelector("textarea")?.disabled).toBe(false);
  });

  it("sends each document to its own endpoints", async () => {
    const { container } = await renderEditor();
    await edit(container, "Edited README");
    await click(container, "Save");
    await click(container, "CHANGELOG");
    await edit(container, "Edited changelog");
    await click(container, "Save");
    expect(mocks.readme.update).toHaveBeenCalledTimes(1);
    expect(mocks.readme.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { content: "Edited README" } })
    );
    expect(mocks.changelog.update).toHaveBeenCalledTimes(1);
    expect(mocks.changelog.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { content: "Edited changelog" } })
    );
  });

  it("accepts a missing packaged changelog after discarding its override", async () => {
    const { container } = await renderEditor();
    await click(container, "CHANGELOG");
    await edit(container, "Edited changelog");
    await click(container, "Save");
    mocks.changelog.discard.mockResolvedValueOnce(documentState(null));
    await click(container, "Discard site edit");
    await click(container, "Discard");
    expect(mocks.changelog.discard).toHaveBeenCalledTimes(1);
    expect(mocks.readme.discard).not.toHaveBeenCalled();
    expect(container.querySelector("textarea")?.value).toBe("");
    expect(container.querySelector("textarea")?.disabled).toBe(false);
  });

  it("offers an earlier version's site edit", async () => {
    mocks.previousOverride.mockResolvedValue({
      versionNumber: "0.9.0",
      markdown: "Earlier edit",
    });
    const { container } = await renderEditor();
    await click(container, "Load site edit from 0.9.0");
    expect(container.querySelector("textarea")?.value).toBe("Earlier edit");
  });

  it("asks before replacing an unsaved draft with an earlier site edit", async () => {
    mocks.previousOverride.mockResolvedValue({
      versionNumber: "0.9.0",
      markdown: "Earlier edit",
    });
    const { container } = await renderEditor();
    await edit(container, "Draft");
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    await click(container, "Load site edit from 0.9.0");
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(container.querySelector("textarea")?.value).toBe("Draft");
    confirm.mockReturnValue(true);
    await click(container, "Load site edit from 0.9.0");
    expect(container.querySelector("textarea")?.value).toBe("Earlier edit");
  });

  it("treats a CRLF document as clean after reverting an edit", async () => {
    const { container } = await renderEditor("Line one\r\nLine two");
    await edit(container, "Line one\nLine two!");
    await edit(container, "Line one\nLine two");
    const save = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Save"
    );
    expect(save?.disabled).toBe(true);
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
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
    const text = "😀".repeat(100000);
    await edit(container, text);
    await click(container, "Save");
    expect(mocks.readme.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { content: text } })
    );
    await edit(container, text + "x");
    const save = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Save"
    );
    expect(save?.disabled).toBe(true);
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(mocks.preview).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: { markdown: text } })
    );
  });
});
