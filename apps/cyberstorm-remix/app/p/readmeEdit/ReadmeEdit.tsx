import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import { useDebounce } from "use-debounce";
import {
  FormSection,
  FormSectionSeparator,
  FormSections,
} from "~/commonComponents/FormSection/FormSection";
import { Markdown } from "~/commonComponents/Markdown/Markdown";
import { Page } from "~/commonComponents/Page/Page";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "~/root";

import {
  CodeInput,
  NewAlert,
  NewButton,
  NewLink,
  Tabs,
  classnames,
  isRecord,
  useToast,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  type RequestConfig,
  fetchPackageVersionMarkdownRaw,
  isApiError,
  postPackageVersionMarkdown,
  toolsMarkdownPreview,
} from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/ReadmeEdit";
import "./ReadmeEdit.css";

// Matches the backend's MAX_MARKDOWN_SIZE (100,000 characters).
const MAX_MARKDOWN_SIZE = 100000;

type DocumentKey = "readme" | "changelog";

interface DocumentState {
  markdown: string;
  is_edited: boolean;
  edited_at: string | null;
}

async function fetchEditorData(
  config: () => RequestConfig,
  communityId: string,
  namespaceId: string,
  packageId: string,
  packageVersion: string
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
  const readme = await fetchPackageVersionMarkdownRaw({
    config,
    params,
    data: {},
    queryParams: {},
    document: "readme",
  });

  let changelog = null;
  if (isLatest) {
    try {
      changelog = await fetchPackageVersionMarkdownRaw({
        config,
        params,
        data: {},
        queryParams: {},
        document: "changelog",
      });
    } catch (error) {
      if (!(isApiError(error) && error.response.status === 404)) throw error;
    }
  }

  return { listing, isLatest, readme, changelog };
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  if (
    !params.communityId ||
    !params.namespaceId ||
    !params.packageId ||
    !params.packageVersion
  ) {
    throw new Response("Not Found", { status: 404 });
  }

  const data = await fetchEditorData(
    () => ({ apiHost: getApiHostForSsr(), sessionId: undefined }),
    params.communityId,
    params.namespaceId,
    params.packageId,
    params.packageVersion
  );

  return {
    ...data,
    communityId: params.communityId,
    namespaceId: params.namespaceId,
    packageId: params.packageId,
    packageVersion: params.packageVersion,
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
  params,
  request,
}: Route.ClientLoaderArgs) {
  if (
    !params.communityId ||
    !params.namespaceId ||
    !params.packageId ||
    !params.packageVersion
  ) {
    throw new Response("Not Found", { status: 404 });
  }

  const tools = getSessionTools();
  const sessionId = tools?.getConfig().sessionId;
  if (!sessionId) {
    const url = new URL(request.url);
    return redirectToLogin(url.pathname + url.search + url.hash);
  }

  const config = () => ({
    apiHost: tools?.getConfig().apiHost,
    sessionId: sessionId,
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

  const data = await fetchEditorData(
    config,
    params.communityId,
    params.namespaceId,
    params.packageId,
    params.packageVersion
  );

  return {
    ...data,
    communityId: params.communityId,
    namespaceId: params.namespaceId,
    packageId: params.packageId,
    packageVersion: params.packageVersion,
  };
}

clientLoader.hydrate = true;

type PreviewState = {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
};

export default function ReadmeEdit() {
  const data = useLoaderData<typeof loader | typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const { communityId, namespaceId, packageId, packageVersion, isLatest } =
    data;

  const [selectedDoc, setSelectedDoc] = useState<DocumentKey>("readme");
  const [documents, setDocuments] = useState<
    Record<DocumentKey, DocumentState | null>
  >({
    readme: {
      markdown: data.readme.markdown ?? "",
      is_edited: data.readme.is_edited ?? false,
      edited_at: data.readme.edited_at ?? null,
    },
    changelog: data.changelog
      ? {
          markdown: data.changelog.markdown ?? "",
          is_edited: data.changelog.is_edited ?? false,
          edited_at: data.changelog.edited_at ?? null,
        }
      : isLatest
        ? { markdown: "", is_edited: false, edited_at: null }
        : null,
  });
  const [baselines, setBaselines] = useState<Record<DocumentKey, string>>({
    readme: data.readme.markdown ?? "",
    changelog: data.changelog?.markdown ?? "",
  });

  const [previewHtml, setPreviewHtml] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<PreviewState>({
    status: "waiting",
    message: "Waiting for input",
  });
  const [saving, setSaving] = useState(false);
  const [discardConfirming, setDiscardConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = documents[selectedDoc];
  const currentText = current?.markdown ?? "";
  const isDirty = current !== null && currentText !== baselines[selectedDoc];
  const overLimit = currentText.length > MAX_MARKDOWN_SIZE;

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
      data: { markdown: debouncedText.slice(0, MAX_MARKDOWN_SIZE) },
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

  const setCurrentText = (value: string) => {
    setDocuments((docs) => ({
      ...docs,
      [selectedDoc]: {
        ...(docs[selectedDoc] ?? {
          markdown: "",
          is_edited: false,
          edited_at: null,
        }),
        markdown: value,
      },
    }));
    setDiscardConfirming(false);
  };

  async function save() {
    if (!isDirty || overLimit || saving) return;
    setSaving(true);
    try {
      const response = await postPackageVersionMarkdown({
        config: outletContext.requestConfig,
        params: {
          namespace: namespaceId,
          package: packageId,
          version: packageVersion,
        },
        data: { [selectedDoc]: currentText },
        queryParams: {},
      });
      const state = response[selectedDoc];
      setDocuments((docs) => ({
        ...docs,
        [selectedDoc]: {
          markdown: currentText,
          is_edited: state.is_edited,
          edited_at: state.edited_at,
        },
      }));
      setBaselines((b) => ({ ...b, [selectedDoc]: currentText }));
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
    setSaving(true);
    try {
      await postPackageVersionMarkdown({
        config: outletContext.requestConfig,
        params: {
          namespace: namespaceId,
          package: packageId,
          version: packageVersion,
        },
        data: { [selectedDoc]: null },
        queryParams: {},
      });
      const raw = await fetchPackageVersionMarkdownRaw({
        config: outletContext.requestConfig,
        params: {
          namespace: namespaceId,
          package: packageId,
          version: packageVersion,
        },
        data: {},
        queryParams: {},
        document: selectedDoc,
      }).catch(() => null);
      const markdown = raw?.markdown ?? "";
      setDocuments((docs) => ({
        ...docs,
        [selectedDoc]: { markdown, is_edited: false, edited_at: null },
      }));
      setBaselines((b) => ({ ...b, [selectedDoc]: markdown }));
      toast.addToast({
        csVariant: "success",
        children: "Site edit discarded, the packaged content is restored.",
        duration: 6000,
      });
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

  function loadFromFile(file: File | undefined) {
    if (!file) return;
    // Text-length validation happens on save; this only guards against
    // reading an obviously wrong selection into memory.
    if (file.size > MAX_MARKDOWN_SIZE * 4) {
      toast.addToast({
        csVariant: "danger",
        children: "File is too large to be a package markdown file.",
        duration: 6000,
      });
      return;
    }
    file.text().then(setCurrentText);
  }

  return (
    <Page>
      <PageHeader headingLevel="1" headingSize="2">
        Edit {namespaceId}-{packageId} {packageVersion}
      </PageHeader>

      <div className="readme-edit__nav">
        <NewLink
          primitiveType="cyberstormLink"
          linkId="PackageVersion"
          community={communityId}
          namespace={namespaceId}
          package={packageId}
          version={packageVersion}
          csVariant="cyber"
        >
          Back to version page
        </NewLink>
      </div>

      <Tabs>
        <button
          key="readme"
          onClick={() => {
            setSelectedDoc("readme");
            setDiscardConfirming(false);
          }}
          aria-current={selectedDoc === "readme"}
          className={classnames(
            "readme-edit__tab",
            "tabs-item",
            selectedDoc === "readme" ? "tabs-item--current" : undefined
          )}
        >
          README
        </button>
        {isLatest ? (
          <button
            key="changelog"
            onClick={() => {
              setSelectedDoc("changelog");
              setDiscardConfirming(false);
            }}
            aria-current={selectedDoc === "changelog"}
            className={classnames(
              "readme-edit__tab",
              "tabs-item",
              selectedDoc === "changelog" ? "tabs-item--current" : undefined
            )}
          >
            CHANGELOG
          </button>
        ) : null}
      </Tabs>

      {!isLatest ? (
        <NewAlert csVariant="info">
          Changelogs can only be edited on the latest version.
        </NewAlert>
      ) : null}

      {current?.is_edited ? (
        <NewAlert csVariant="info">
          This {selectedDoc} has a site edit
          {current.edited_at
            ? `, last saved ${new Date(current.edited_at).toLocaleString()}`
            : ""}
          . The downloaded package keeps its original file.
        </NewAlert>
      ) : null}

      <FormSections>
        <FormSection
          title="Markdown"
          description="Edits are served on the site and through the API. The uploaded package is never modified."
        >
          <CodeInput
            placeholder="# Package markdown"
            onChange={(e) => setCurrentText(e.currentTarget.value)}
            value={currentText}
            validationBarProps={
              overLimit
                ? {
                    status: "failure",
                    message: `Too long: ${currentText.length.toLocaleString()} / ${MAX_MARKDOWN_SIZE.toLocaleString()} characters`,
                  }
                : preview
            }
          />
          <div className="readme-edit__actions">
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
              csVariant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              Load from file
            </NewButton>
            {current?.is_edited ? (
              <NewButton csVariant="danger" onClick={discard} disabled={saving}>
                {discardConfirming
                  ? "Confirm: restore packaged content"
                  : "Discard site edit"}
              </NewButton>
            ) : null}
            <NewButton
              csVariant="accent"
              onClick={save}
              disabled={!isDirty || overLimit || saving}
            >
              {saving ? "Saving…" : "Save"}
            </NewButton>
          </div>
        </FormSection>
        <FormSectionSeparator />
        <FormSection
          title="Preview"
          description="Rendered with the same pipeline the site uses."
        >
          <Markdown input={previewHtml} placeholder="" dangerous />
        </FormSection>
      </FormSections>
    </Page>
  );
}
