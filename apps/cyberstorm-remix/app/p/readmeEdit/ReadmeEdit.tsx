import { faArrowLeft, faEdit } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useBeforeUnload,
  useBlocker,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "react-router";
import { useDebounce } from "use-debounce";
import { Markdown } from "~/commonComponents/Markdown/Markdown";
import { Page } from "~/commonComponents/Page/Page";
import { type OutletContextShape } from "~/root";

import {
  CodeInput,
  NewAlert,
  NewButton,
  NewIcon,
  NewValidationBar,
  Tabs,
  TooltipWrapper,
  classnames,
  isRecord,
  useToast,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  type PackageVersionRawMarkdownResponseData,
  type RequestConfig,
  fetchPackageVersionMarkdownRaw,
  fetchPackageVersionOverrideRaw,
  isApiError,
  postPackageVersionMarkdown,
  toolsMarkdownPreview,
} from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/ReadmeEdit";
import "./ReadmeEdit.css";
import {
  type PreviousOverride,
  findPreviousReadmeOverride,
} from "./overrideMigration";

// Matches the backend's MAX_MARKDOWN_SIZE (100,000 characters).
const MAX_MARKDOWN_SIZE = 100000;

type DocumentKey = "readme" | "changelog";

interface DocumentState {
  markdown: string;
  baseline: string;
  needsReload: boolean;
  is_edited: boolean;
  edited_at: string | null;
}

function getEditorParams(params: Route.LoaderArgs["params"]) {
  const { communityId, namespaceId, packageId, packageVersion } = params;
  if (!communityId || !namespaceId || !packageId || !packageVersion) {
    throw new Response("Not Found", { status: 404 });
  }
  return { communityId, namespaceId, packageId, packageVersion };
}

function createDocumentState(
  document?: Partial<PackageVersionRawMarkdownResponseData> | null
): DocumentState {
  return {
    markdown: document?.markdown ?? "",
    baseline: document?.markdown ?? "",
    needsReload: false,
    is_edited: document?.is_edited ?? false,
    edited_at: document?.edited_at ?? null,
  };
}

async function fetchEditorData(
  config: () => RequestConfig,
  {
    communityId,
    namespaceId,
    packageId,
    packageVersion,
  }: ReturnType<typeof getEditorParams>
) {
  const dapper = new DapperTs(config);
  const listing = await dapper.getPackageListingDetails(
    communityId,
    namespaceId,
    packageId
  );
  const isLatest = listing.latest_version_number === packageVersion;

  const params = {
    namespace: namespaceId,
    package: packageId,
    version: packageVersion,
  };

  // Prefer the uncached override download so reopening the editor immediately
  // after saving does not load stale content from the experimental endpoint.
  const loadDocument = async (document: DocumentKey) => {
    const shared = { config, params, data: {}, queryParams: {}, document };
    const override = await fetchPackageVersionOverrideRaw(shared);
    if (override !== null) {
      return { markdown: override, is_edited: true, edited_at: null };
    }
    try {
      return await fetchPackageVersionMarkdownRaw(shared);
    } catch (error) {
      if (isApiError(error) && error.response.status === 404) return null;
      throw error;
    }
  };

  const readme = (await loadDocument("readme")) ?? {
    markdown: "",
    is_edited: false,
    edited_at: null,
  };
  const changelog = isLatest ? await loadDocument("changelog") : null;

  return { listing, isLatest, readme, changelog };
}

export const loader = async ({ params: routeParams }: Route.LoaderArgs) => {
  const params = getEditorParams(routeParams);

  const data = await fetchEditorData(
    () => ({ apiHost: getApiHostForSsr(), sessionId: undefined }),
    params
  );

  return {
    ...data,
    ...params,
    seo: createSeo({
      descriptors: [
        {
          title: `Edit ${params.namespaceId}-${params.packageId} | Thunderstore`,
        },
      ],
    }),
  };
};

export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({
  params: routeParams,
  request,
}: Route.ClientLoaderArgs) {
  const params = getEditorParams(routeParams);

  const tools = getSessionTools();
  const sessionId = tools?.getConfig().sessionId;
  if (!sessionId) {
    const url = new URL(request.url);
    return redirectToLogin(url.pathname + url.search + url.hash);
  }

  const config = () => ({
    apiHost: tools?.getConfig().apiHost,
    sessionId,
  });
  const dapper = new DapperTs(config);

  const permissions = await dapper.getPackagePermissions(
    params.communityId,
    params.namespaceId,
    params.packageId
  );
  if (!permissions?.permissions.can_manage_wiki) {
    throw new Response("Unauthorized", { status: 403 });
  }

  const data = await fetchEditorData(config, params);

  return {
    ...data,
    ...params,
  };
}

clientLoader.hydrate = true;

type PreviewState = {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
};

export default function ReadmeEdit() {
  const data = useLoaderData<typeof loader | typeof clientLoader>();
  // Reset drafts when the package version changes, but preserve them when
  // the same route revalidates.
  const key = [
    data.communityId,
    data.namespaceId,
    data.packageId,
    data.packageVersion,
  ].join("/");
  return <ReadmeEditor key={key} data={data} />;
}

function ReadmeEditor({
  data,
}: {
  data: Awaited<ReturnType<typeof fetchEditorData>> &
    ReturnType<typeof getEditorParams>;
}) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const { communityId, namespaceId, packageId, packageVersion, isLatest } =
    data;

  const markdownRequest = {
    config: outletContext.requestConfig,
    params: {
      namespace: namespaceId,
      package: packageId,
      version: packageVersion,
    },
    queryParams: {},
  };

  const [searchParams] = useSearchParams();
  // The latest version can be opened from either listing. Keep an explicit
  // return target so refreshes and opening the editor in a new tab work too.
  const returnToVersion = searchParams.get("from") === "version" || !isLatest;
  const [selectedDoc, setSelectedDoc] = useState<DocumentKey>(() =>
    isLatest && searchParams.get("document") === "changelog"
      ? "changelog"
      : "readme"
  );
  const [documents, setDocuments] = useState<
    Record<DocumentKey, DocumentState | null>
  >({
    readme: createDocumentState(data.readme),
    changelog: isLatest ? createDocumentState(data.changelog) : null,
  });

  const [previewHtml, setPreviewHtml] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<PreviewState>({
    status: "waiting",
    message: "Waiting for input",
  });
  const [saving, setSaving] = useState(false);
  const [discardConfirming, setDiscardConfirming] = useState(false);
  const [previousOverride, setPreviousOverride] =
    useState<PreviousOverride | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // File.text() cannot be aborted. Ignore its result after another read,
  // an edit, a save, a discard, or unmount supersedes it.
  const fileReadIds = useRef({ readme: 0, changelog: 0 });

  useEffect(() => {
    const reads = fileReadIds.current;
    return () => {
      reads.readme++;
      reads.changelog++;
    };
  }, []);

  // Keyed on the live edit state, not the loader snapshot, so discarding a
  // site edit in-session brings the offer back without a reload.
  const readmeIsEdited = documents.readme?.is_edited ?? false;
  useEffect(() => {
    if (readmeIsEdited) return;
    let cancelled = false;
    findPreviousReadmeOverride(
      outletContext.requestConfig,
      namespaceId,
      packageId,
      packageVersion
    )
      .then((result) => {
        if (!cancelled) setPreviousOverride(result);
      })
      .catch(() => {
        // Best effort
      });
    return () => {
      cancelled = true;
    };
  }, [
    namespaceId,
    packageId,
    packageVersion,
    readmeIsEdited,
    outletContext.requestConfig,
  ]);

  const current = documents[selectedDoc];
  const documentLabel = selectedDoc === "readme" ? "README" : "CHANGELOG";
  const currentText = current?.markdown ?? "";
  const isDirty = current !== null && currentText !== current.baseline;
  const hasUnsavedChanges = Object.values(documents).some(
    (doc) => doc !== null && !doc.needsReload && doc.markdown !== doc.baseline
  );
  const blocker = useBlocker(hasUnsavedChanges);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (
      window.confirm("Leave without saving your README or CHANGELOG changes?")
    ) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);
  useBeforeUnload(
    useCallback(
      (event) => {
        if (!hasUnsavedChanges) return;
        event.preventDefault();
        event.returnValue = "";
      },
      [hasUnsavedChanges]
    )
  );

  const characterCount = Array.from(currentText).length;
  const overLimit = characterCount > MAX_MARKDOWN_SIZE;
  const barState: PreviewState = overLimit
    ? {
        status: "failure",
        message: `Too long: ${characterCount.toLocaleString()} / ${MAX_MARKDOWN_SIZE.toLocaleString()} characters`,
      }
    : preview;

  const [debouncedText] = useDebounce(currentText, 1000);

  useEffect(() => {
    let cancelled = false;
    if (debouncedText === "") {
      setPreviewHtml(undefined);
      setPreview({ status: "waiting", message: "Waiting for input" });
      return;
    }
    setPreview({ status: "processing" });
    toolsMarkdownPreview({
      config: outletContext.requestConfig,
      data: {
        markdown: Array.from(debouncedText)
          .slice(0, MAX_MARKDOWN_SIZE)
          .join(""),
      },
      params: {},
      queryParams: {},
    })
      .then((response) => {
        if (cancelled) return;
        if (isRecord(response) && typeof response.html === "string") {
          setPreviewHtml(response.html);
          setPreview({ status: "success", message: "Rendered" });
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setPreview({
          status: "failure",
          message:
            isApiError(error) && isRecord(error.responseJson)
              ? String(error.responseJson.detail ?? "Render failed")
              : "Render failed",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedText, outletContext.requestConfig]);

  function updateDocument(
    document: DocumentKey,
    state: Partial<DocumentState>
  ) {
    fileReadIds.current[document]++;
    setDocuments((docs) => ({
      ...docs,
      [document]: { ...(docs[document] ?? createDocumentState()), ...state },
    }));
  }

  function setDocumentText(document: DocumentKey, markdown: string) {
    updateDocument(document, { markdown });
    setDiscardConfirming(false);
  }

  const canSave = isDirty && !overLimit && !saving && !current?.needsReload;

  async function save() {
    if (!canSave) return;
    fileReadIds.current[selectedDoc]++;
    setSaving(true);
    try {
      const response = await postPackageVersionMarkdown({
        ...markdownRequest,
        data: { [selectedDoc]: currentText },
      });
      updateDocument(
        selectedDoc,
        createDocumentState({
          ...response[selectedDoc],
          markdown: currentText,
        })
      );
      toast.addToast({
        csVariant: "success",
        children:
          "Saved. It can take up to 15 minutes to appear for everyone else.",
        duration: 8000,
      });
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: `Save failed: ${
          isApiError(error) ? error.message : "unknown error"
        }`,
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  }

  async function discard() {
    if (saving) return;
    if (!discardConfirming) {
      setDiscardConfirming(true);
      return;
    }
    setDiscardConfirming(false);
    fileReadIds.current[selectedDoc]++;
    setSaving(true);
    try {
      await postPackageVersionMarkdown({
        ...markdownRequest,
        data: { [selectedDoc]: null },
      });
      updateDocument(selectedDoc, {
        markdown: currentText,
        is_edited: false,
        edited_at: null,
        needsReload: true,
      });
      await reloadPackagedContent();
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: `Discard failed: ${
          isApiError(error) ? error.message : "unknown error"
        }`,
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  }

  async function reloadPackagedContent() {
    setSaving(true);
    try {
      const raw = await fetchPackageVersionMarkdownRaw({
        ...markdownRequest,
        data: {},
        document: selectedDoc,
      }).catch((error) => {
        if (isApiError(error) && error.response.status === 404) return null;
        throw error;
      });
      // A successful discard can still be followed by a cached override.
      // Keep the editor locked until the packaged content is available.
      if (raw?.is_edited) {
        throw new Error("The cached README or changelog has not updated yet.");
      }
      const markdown = raw?.markdown ?? "";
      updateDocument(selectedDoc, createDocumentState({ markdown }));
      toast.addToast({
        csVariant: "success",
        children: "Site edit discarded, the packaged content is restored.",
        duration: 6000,
      });
    } catch {
      toast.addToast({
        csVariant: "danger",
        children: `The original ${documentLabel} was restored, but the editor couldn’t reload it.`,
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  }

  function loadPreviousOverride() {
    if (!previousOverride) return;
    setDocumentText("readme", previousOverride.markdown);
    setPreviousOverride(null);
  }

  function loadFromFile(file: File | undefined) {
    if (!file) return;
    // Text-length validation happens on save. This only guards against
    // reading an obviously wrong selection into memory.
    if (file.size > MAX_MARKDOWN_SIZE * 4) {
      toast.addToast({
        csVariant: "danger",
        children: "File is too large to be a package markdown file.",
        duration: 6000,
      });
      return;
    }
    const readId = ++fileReadIds.current[selectedDoc];
    file
      .text()
      .then((text) => {
        if (fileReadIds.current[selectedDoc] === readId) {
          setDocumentText(selectedDoc, text);
        }
      })
      .catch(() => {
        if (fileReadIds.current[selectedDoc] !== readId) return;
        toast.addToast({
          csVariant: "danger",
          children: "The file could not be read. Please try again.",
          duration: 6000,
        });
      });
  }

  const editedTitle = (doc: DocumentState | null, label: string) =>
    `This ${label.toUpperCase()} has a site edit${
      doc?.edited_at
        ? `, last saved ${new Date(doc.edited_at).toISOString().slice(0, 10)}`
        : ""
    }.`;

  return (
    <Page rootClasses="readme-edit">
      {current?.needsReload ? (
        <NewAlert csVariant="warning">
          The original {documentLabel} was restored, but the editor couldn’t
          reload it.
          <NewButton
            csSize="small"
            csVariant="secondary"
            onClick={reloadPackagedContent}
            disabled={saving}
          >
            Reload {documentLabel}
          </NewButton>
        </NewAlert>
      ) : null}

      <div className="readme-edit__workspace">
        <Tabs rootClasses="readme-edit__toolbar">
          <NewButton
            csModifiers={["ghost"]}
            csVariant="secondary"
            csSize="small"
            primitiveType="cyberstormLink"
            linkId={returnToVersion ? "PackageVersion" : "Package"}
            community={communityId}
            namespace={namespaceId}
            package={packageId}
            version={packageVersion}
            rootClasses="readme-edit__back"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowLeft} />
            </NewIcon>
            Go back
          </NewButton>
          {(["readme", "changelog"] as const).map((doc) => {
            const unavailable = doc === "changelog" && !isLatest;
            return (
              <TooltipWrapper
                key={doc}
                tooltipText={
                  unavailable
                    ? "Changelogs can only be edited on the latest version."
                    : undefined
                }
              >
                <button
                  aria-disabled={unavailable || undefined}
                  onClick={() => {
                    if (unavailable) return;
                    setSelectedDoc(doc);
                    setDiscardConfirming(false);
                  }}
                  aria-current={selectedDoc === doc}
                  className={classnames(
                    "readme-edit__tab",
                    "tabs-item",
                    selectedDoc === doc ? "tabs-item--current" : undefined
                  )}
                >
                  {doc.toUpperCase()}
                  {documents[doc]?.is_edited ? (
                    <span
                      className="readme-edit__tab-edited"
                      title={editedTitle(documents[doc], doc)}
                    >
                      <NewIcon csMode="inline" noWrapper>
                        <FontAwesomeIcon icon={faEdit} />
                      </NewIcon>
                    </span>
                  ) : null}
                </button>
              </TooltipWrapper>
            );
          })}
          <span className="readme-edit__identity">
            {namespaceId}-{packageId} {packageVersion}
          </span>
        </Tabs>
        <div className="readme-edit__panes">
          <CodeInput
            aria-label={`${documentLabel} source`}
            placeholder="# Package markdown"
            onChange={(e) =>
              setDocumentText(selectedDoc, e.currentTarget.value)
            }
            value={currentText}
            disabled={saving || current?.needsReload}
            rootClasses="readme-edit__editor"
          />
          <div className="readme-edit__preview">
            <Markdown input={previewHtml} placeholder="" dangerous />
          </div>
        </div>
        <NewValidationBar
          status={barState.status}
          message={barState.message}
          rootClasses="readme-edit__bar"
        >
          <span className="readme-edit__bar-actions">
            {selectedDoc === "readme" &&
            !current?.is_edited &&
            !current?.needsReload &&
            previousOverride ? (
              <NewButton
                csSize="small"
                csVariant="secondary"
                onClick={loadPreviousOverride}
                disabled={saving}
              >
                Load site edit from {previousOverride.versionNumber}
              </NewButton>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              hidden
              onChange={(e) => {
                loadFromFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <NewButton
              csSize="small"
              csVariant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving || current?.needsReload}
            >
              Load from file
            </NewButton>
            {current?.is_edited ? (
              <NewButton
                csSize="small"
                csVariant="danger"
                onClick={discard}
                disabled={saving}
              >
                {discardConfirming
                  ? "Confirm: restore packaged content"
                  : "Discard site edit"}
              </NewButton>
            ) : null}
            <NewButton
              csSize="small"
              csVariant="accent"
              onClick={save}
              disabled={!canSave}
            >
              {saving ? "Saving…" : "Save"}
            </NewButton>
          </span>
        </NewValidationBar>
      </div>
    </Page>
  );
}
