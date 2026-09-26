import { faArrowLeft, faEdit } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
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
  SkeletonBox,
  Tabs,
  TooltipWrapper,
  classnames,
  isRecord,
  useToast,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  type PackageVersionRawMarkdownResponseData,
  extractApiErrorMessage,
  fetchPackageVersionChangelogMarkdownRaw,
  fetchPackageVersionChangelogOverrideRaw,
  fetchPackageVersionReadmeMarkdownRaw,
  fetchPackageVersionReadmeOverrideRaw,
  isApiError,
  postPackageVersionChangelog,
  postPackageVersionReadme,
  toolsMarkdownPreview,
} from "@thunderstore/thunderstore-api";

import { getPrivateListing } from "../listingUtils";
import type { Route } from "./+types/ReadmeEdit";
import "./ReadmeEdit.css";
import {
  type PreviousOverride,
  findPreviousReadmeOverride,
} from "./overrideMigration";

// Matches the backend's MAX_MARKDOWN_SIZE (100,000 characters).
const MAX_MARKDOWN_SIZE = 100000;

type DocumentKey = "readme" | "changelog";

const DOCUMENT_LABELS: Record<DocumentKey, string> = {
  readme: "README",
  changelog: "CHANGELOG",
};

type MarkdownRequest = Omit<
  Parameters<typeof postPackageVersionReadme>[0],
  "data"
>;

const documentApi: Record<
  DocumentKey,
  {
    fetchOverride: typeof fetchPackageVersionReadmeOverrideRaw;
    fetchRaw: typeof fetchPackageVersionReadmeMarkdownRaw;
    save: (
      request: MarkdownRequest,
      markdown: string | null
    ) => ReturnType<typeof postPackageVersionReadme>;
  }
> = {
  readme: {
    fetchOverride: fetchPackageVersionReadmeOverrideRaw,
    fetchRaw: fetchPackageVersionReadmeMarkdownRaw,
    save: (request, readme) =>
      postPackageVersionReadme({ ...request, data: { readme } }),
  },
  changelog: {
    fetchOverride: fetchPackageVersionChangelogOverrideRaw,
    fetchRaw: fetchPackageVersionChangelogMarkdownRaw,
    save: (request, changelog) =>
      postPackageVersionChangelog({ ...request, data: { changelog } }),
  },
};

interface DocumentState {
  markdown: string;
  baseline: string;
  needsReload: boolean;
  is_edited: boolean;
  edited_at: string | null;
}

type LoadedDocument = PackageVersionRawMarkdownResponseData & {
  needsReload?: boolean;
};

type PreviewState = {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
};

function getEditorParams(params: Route.LoaderArgs["params"]) {
  const { communityId, namespaceId, packageId, packageVersion } = params;
  if (!communityId || !namespaceId || !packageId || !packageVersion) {
    throw new Response("Not Found", { status: 404 });
  }
  return { communityId, namespaceId, packageId, packageVersion };
}

function editorSeo({
  namespaceId,
  packageId,
}: ReturnType<typeof getEditorParams>) {
  return createSeo({
    descriptors: [{ title: `Edit ${namespaceId}-${packageId} | Thunderstore` }],
  });
}

// Textareas report line breaks as \n, so text with \r\n would never match its
// baseline again after an edit.
function normalizeLineEndings(text: string) {
  return text.replace(/\r\n?/g, "\n");
}

function createDocumentState(
  loaded?: Partial<LoadedDocument> | null
): DocumentState {
  const markdown = normalizeLineEndings(loaded?.markdown ?? "");
  return {
    markdown,
    baseline: markdown,
    needsReload: loaded?.needsReload ?? false,
    is_edited: loaded?.is_edited ?? false,
    edited_at: loaded?.edited_at ?? null,
  };
}

function errorMessage(error: unknown) {
  return isApiError(error) ? extractApiErrorMessage(error) : "unknown error";
}

function siteEditTitle(doc: DocumentKey, editedAt: string | null) {
  const lastSaved = editedAt
    ? `, last saved ${new Date(editedAt).toISOString().slice(0, 10)}`
    : "";
  return `This ${DOCUMENT_LABELS[doc]} has a site edit${lastSaved}.`;
}

// Prefer the uncached override download so reopening the editor immediately
// after saving does not load stale content from the experimental endpoint.
async function loadDocument(
  request: MarkdownRequest,
  doc: DocumentKey
): Promise<LoadedDocument> {
  const shared = { ...request, data: {} };
  const override = await documentApi[doc].fetchOverride(shared);
  if (override !== null) {
    return { markdown: override, is_edited: true, edited_at: null };
  }
  const raw = await documentApi[doc].fetchRaw(shared);
  // With no override to download, an edited response is a cache entry left
  // over from a discard. Keep the document locked until the cache updates.
  if (raw.is_edited) {
    return {
      markdown: "",
      is_edited: false,
      edited_at: null,
      needsReload: true,
    };
  }
  return raw;
}

export async function loader({ params }: Route.LoaderArgs) {
  const editorParams = getEditorParams(params);
  return { ...editorParams, seo: editorSeo(editorParams) };
}

export { noStoreHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({
  params: routeParams,
  request,
}: Route.ClientLoaderArgs) {
  const params = getEditorParams(routeParams);
  const url = new URL(request.url);
  const returnUrl = url.pathname + url.search + url.hash;

  const tools = getSessionTools();
  const sessionId = tools?.getConfig().sessionId;
  if (!sessionId) {
    return redirectToLogin(returnUrl);
  }

  const config = () => ({
    apiHost: tools?.getConfig().apiHost,
    sessionId,
  });
  const dapper = new DapperTs(config);

  try {
    const permissions = await dapper.getPackagePermissions(
      params.communityId,
      params.namespaceId,
      params.packageId
    );
    if (!permissions) {
      return redirectToLogin(returnUrl);
    }
    if (!permissions.permissions.can_manage_wiki) {
      throw new Response("Unauthorized", { status: 403 });
    }
  } catch (error) {
    if (isApiError(error) && error.response.status === 404) {
      throw new Response("Package not found", { status: 404 });
    }
    throw error;
  }

  // Looking up the listing by version also 404s a missing or inactive version.
  const listing = await getPrivateListing(dapper, params);
  const isLatest = listing.latest_version_number === params.packageVersion;

  const markdownRequest: MarkdownRequest = {
    config,
    params: {
      namespace: params.namespaceId,
      package: params.packageId,
      version: params.packageVersion,
    },
    queryParams: {},
  };
  const [readme, changelog] = await Promise.all([
    loadDocument(markdownRequest, "readme"),
    isLatest ? loadDocument(markdownRequest, "changelog") : null,
  ]);

  return { ...params, isLatest, readme, changelog, seo: editorSeo(params) };
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <Page rootClasses="readme-edit">
      <SkeletonBox className="readme-edit__skeleton" />
    </Page>
  );
}

type EditorData = Exclude<Awaited<ReturnType<typeof clientLoader>>, Response>;

export default function ReadmeEdit() {
  const data = useLoaderData<typeof clientLoader>();
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

function usePreviousReadmeOverride(
  requestConfig: OutletContextShape["requestConfig"],
  namespaceId: string,
  packageId: string,
  packageVersion: string,
  readmeIsEdited: boolean
) {
  const [previousOverride, setPreviousOverride] =
    useState<PreviousOverride | null>(null);

  // Keyed on the live edit state, not the loader snapshot, so discarding a
  // site edit in-session brings the offer back without a reload.
  useEffect(() => {
    if (readmeIsEdited) return;
    let cancelled = false;
    findPreviousReadmeOverride(
      requestConfig,
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
  }, [namespaceId, packageId, packageVersion, readmeIsEdited]);

  return [previousOverride, setPreviousOverride] as const;
}

function useUnsavedChangesPrompt(hasUnsavedChanges: boolean) {
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
}

function useMarkdownPreview(
  requestConfig: OutletContextShape["requestConfig"],
  text: string,
  selectedDoc: DocumentKey
) {
  const [previewHtml, setPreviewHtml] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<PreviewState>({
    status: "waiting",
    message: "Waiting for input",
  });
  const [debouncedText, debouncedTextControls] = useDebounce(text, 1000);

  // Render the newly selected document right away instead of showing the
  // previous one as rendered until the debounce settles.
  useEffect(() => {
    debouncedTextControls.flush();
  }, [selectedDoc, debouncedTextControls]);

  useEffect(() => {
    let cancelled = false;
    if (debouncedText.trim() === "") {
      setPreviewHtml(undefined);
      setPreview({ status: "waiting", message: "Waiting for input" });
      return;
    }
    setPreview({ status: "processing" });
    toolsMarkdownPreview({
      config: requestConfig,
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
  }, [debouncedText]);

  return { previewHtml, preview };
}

function ReadmeEditor({ data }: { data: EditorData }) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const { communityId, namespaceId, packageId, packageVersion, isLatest } =
    data;

  const markdownRequest: MarkdownRequest = {
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
  const [saving, setSaving] = useState(false);
  const [discardConfirming, setDiscardConfirming] = useState(false);
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

  const [previousOverride, setPreviousOverride] = usePreviousReadmeOverride(
    outletContext.requestConfig,
    namespaceId,
    packageId,
    packageVersion,
    documents.readme?.is_edited ?? false
  );

  const currentDoc = documents[selectedDoc];
  const documentLabel = DOCUMENT_LABELS[selectedDoc];
  const currentText = currentDoc?.markdown ?? "";
  const needsReload = currentDoc?.needsReload ?? false;
  const isDirty = currentDoc !== null && currentText !== currentDoc.baseline;
  const hasUnsavedChanges = Object.values(documents).some(
    (doc) => doc !== null && !doc.needsReload && doc.markdown !== doc.baseline
  );
  useUnsavedChangesPrompt(hasUnsavedChanges);

  const { previewHtml, preview } = useMarkdownPreview(
    outletContext.requestConfig,
    currentText,
    selectedDoc
  );

  const characterCount = Array.from(currentText).length;
  const overLimit = characterCount > MAX_MARKDOWN_SIZE;
  const barState: PreviewState = overLimit
    ? {
        status: "failure",
        message: `Too long: ${characterCount.toLocaleString()} / ${MAX_MARKDOWN_SIZE.toLocaleString()} characters`,
      }
    : preview;

  const canSave = isDirty && !overLimit && !saving && !needsReload;
  const offeredOverride =
    selectedDoc === "readme" && !currentDoc?.is_edited && !needsReload
      ? previousOverride
      : null;

  function updateDocument(doc: DocumentKey, state: Partial<DocumentState>) {
    fileReadIds.current[doc]++;
    setDocuments((docs) => ({
      ...docs,
      [doc]: { ...(docs[doc] ?? createDocumentState()), ...state },
    }));
  }

  function setDocumentText(doc: DocumentKey, markdown: string) {
    updateDocument(doc, { markdown: normalizeLineEndings(markdown) });
    setDiscardConfirming(false);
  }

  function selectDocument(doc: DocumentKey) {
    setSelectedDoc(doc);
    setDiscardConfirming(false);
  }

  async function save() {
    if (!canSave) return;
    fileReadIds.current[selectedDoc]++;
    setSaving(true);
    try {
      const response = await documentApi[selectedDoc].save(
        markdownRequest,
        currentText
      );
      updateDocument(
        selectedDoc,
        createDocumentState({
          ...response[selectedDoc],
          markdown: currentText,
        })
      );
      toast.addToast({
        csVariant: "success",
        children: "Saved. Changes might take several minutes to show publicly!",
        duration: 8000,
      });
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: `Save failed: ${errorMessage(error)}`,
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
      await documentApi[selectedDoc].save(markdownRequest, null);
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
        children: `Discard failed: ${errorMessage(error)}`,
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  }

  async function reloadPackagedContent() {
    setSaving(true);
    try {
      const raw = await documentApi[selectedDoc].fetchRaw({
        ...markdownRequest,
        data: {},
      });
      // A successful discard can still be followed by a cached override.
      // Keep the editor locked until the packaged content is available.
      if (raw.is_edited) {
        throw new Error("The cached README or changelog has not updated yet.");
      }
      updateDocument(
        selectedDoc,
        createDocumentState({ markdown: raw.markdown })
      );
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

  return (
    <Page rootClasses="readme-edit">
      {needsReload ? (
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
          {(["readme", "changelog"] as const).map((doc) => (
            <DocumentTab
              key={doc}
              doc={doc}
              state={documents[doc]}
              selected={selectedDoc === doc}
              unavailable={doc === "changelog" && !isLatest}
              onSelect={() => selectDocument(doc)}
            />
          ))}
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
            disabled={saving || needsReload}
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
            {offeredOverride ? (
              <NewButton
                csSize="small"
                csVariant="secondary"
                onClick={loadPreviousOverride}
                disabled={saving}
              >
                Load site edit from {offeredOverride.versionNumber}
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
              disabled={saving || needsReload}
            >
              Load from file
            </NewButton>
            {currentDoc?.is_edited ? (
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

function DocumentTab(props: {
  doc: DocumentKey;
  state: DocumentState | null;
  selected: boolean;
  unavailable: boolean;
  onSelect: () => void;
}) {
  return (
    <TooltipWrapper
      tooltipText={
        props.unavailable
          ? "Changelogs can only be edited on the latest version."
          : undefined
      }
    >
      <button
        aria-disabled={props.unavailable || undefined}
        onClick={() => {
          if (props.unavailable) return;
          props.onSelect();
        }}
        aria-current={props.selected}
        className={classnames(
          "readme-edit__tab",
          "tabs-item",
          props.selected ? "tabs-item--current" : undefined
        )}
      >
        {DOCUMENT_LABELS[props.doc]}
        {props.state?.is_edited ? (
          <span
            className="readme-edit__tab-edited"
            title={siteEditTitle(props.doc, props.state.edited_at)}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faEdit} />
            </NewIcon>
          </span>
        ) : null}
      </button>
    </TooltipWrapper>
  );
}
