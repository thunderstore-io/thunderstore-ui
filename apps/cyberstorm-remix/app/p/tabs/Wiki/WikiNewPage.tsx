import "./Wiki.css";

import {
  Await,
  type LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useRouteError,
} from "react-router";
import {
  Heading,
  NewAlert,
  NewButton,
  NewTextInput,
  SkeletonBox,
  Tabs,
  useToast,
} from "@thunderstore/cyberstorm";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { Suspense, useMemo, useReducer, useState } from "react";
import {
  type PackageWikiPageCreateRequestData,
  postPackageWikiPageCreate,
  UserFacingError,
  formatUserFacingError,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "~/root";
import { Markdown } from "~/commonComponents/Markdown/Markdown";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  CONFLICT_MAPPING,
  RATE_LIMIT_MAPPING,
  createServerErrorMapping,
} from "cyberstorm/utils/errors/loaderMappings";
import { wikiErrorMappings } from "./Wiki";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";

type MaybePromise<T> = T | Promise<T>;

type ResultType = {
  communityId: string;
  namespaceId: string;
  packageId: string;
  wikiValidation: MaybePromise<void>;
};

const wikiNewPageErrorMappings = [
  ...wikiErrorMappings,
  CONFLICT_MAPPING,
  RATE_LIMIT_MAPPING,
  createServerErrorMapping(),
];

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });

    const wikiValidationPromise = dapper
      .getPackageWiki(params.namespaceId, params.packageId)
      .then(() => undefined)
      .catch((error) => handleLoaderError(error, { mappings: wikiNewPageErrorMappings }));

    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      wikiValidation: wikiValidationPromise,
    } satisfies ResultType;
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });

    try {
      await dapper.getPackageWiki(params.namespaceId, params.packageId);

      return {
        communityId: params.communityId,
        namespaceId: params.namespaceId,
        packageId: params.packageId,
        wikiValidation: undefined,
      } satisfies ResultType;
    } catch (error) {
      handleLoaderError(error, { mappings: wikiNewPageErrorMappings });
    }
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

/**
 * Renders the new wiki page form and defers validation to Suspense.
 */
export default function Wiki() {
  const { communityId, namespaceId, packageId, wikiValidation } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const validationPromise = useMemo(
    () => Promise.resolve(wikiValidation),
    [wikiValidation]
  );

  return (
    <Suspense fallback={<WikiNewPageSkeleton />}>
      <Await
        resolve={validationPromise}
        errorElement={<WikiNewPageAwaitError />}
      >
        {() => (
          <WikiNewPageContent
            communityId={communityId}
            namespaceId={namespaceId}
            packageId={packageId}
          />
        )}
      </Await>
    </Suspense>
  );
}

type WikiNewPageContentProps = {
  communityId: string;
  namespaceId: string;
  packageId: string;
};

/**
 * Provides the interactive form for creating a new wiki page.
 */
function WikiNewPageContent({
  communityId,
  namespaceId,
  packageId,
}: WikiNewPageContentProps) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  function formFieldUpdateAction(
    state: PackageWikiPageCreateRequestData,
    action: {
      field: keyof PackageWikiPageCreateRequestData;
      value: PackageWikiPageCreateRequestData[keyof PackageWikiPageCreateRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    title: "",
    markdown_content: "# New page",
  });

  async function moveToWikiPage(slug: string) {
    toast.addToast({
      csVariant: "info",
      children: `Moving to the created wiki page`,
      duration: 4000,
    });
    navigate(`/c/${communityId}/p/${namespaceId}/${packageId}/wiki/${slug}`);
  }

  type SubmitorOutput = Awaited<ReturnType<typeof postPackageWikiPageCreate>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await postPackageWikiPageCreate({
      config: outletContext.requestConfig,
      params: { namespace_id: namespaceId, package_name: packageId },
      data: {
        title: data.title,
        markdown_content: data.markdown_content,
      },
      queryParams: {},
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    PackageWikiPageCreateRequestData,
    Error,
    SubmitorOutput,
    UserFacingError,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: (result) => {
      toast.addToast({
        csVariant: "success",
        children: `Page ${result.title} has been created`,
        duration: 4000,
      });
      moveToWikiPage(result.slug);
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: formatUserFacingError(error),
        duration: 8000,
      });
    },
  });

  return (
    <>
      <div className="package-wiki-content__header">
        <div className="package-wiki-content__title">
          <Heading csLevel="3">New page</Heading>
        </div>
      </div>
      <div className="package-wiki-content__body">
        <Tabs>
          <button
            key="write"
            onClick={() => setSelectedTab("write")}
            aria-current={selectedTab === "write"}
            className={classnames(
              "package-wiki-edit__tabs-button",
              "tabs-item",
              selectedTab === "write" ? "tabs-item--current" : undefined
            )}
          >
            Write
          </button>
          <button
            key="preview"
            onClick={() => setSelectedTab("preview")}
            aria-current={selectedTab === "preview"}
            className={classnames(
              "package-wiki-edit__tabs-button",
              "tabs-item",
              selectedTab === "preview" ? "tabs-item--current" : undefined
            )}
          >
            Preview
          </button>
        </Tabs>
        {selectedTab === "write" ? (
          <>
            <NewTextInput
              value={formInputs.title}
              onChange={(e) =>
                updateFormFieldState({
                  field: "title",
                  value: e.target.value,
                })
              }
              placeholder="Title of the page"
            />
            <NewTextInput
              csSize="textarea"
              value={formInputs.markdown_content}
              onChange={(e) =>
                updateFormFieldState({
                  field: "markdown_content",
                  value: e.target.value,
                })
              }
              name="markdown_content"
              rootClasses="package-wiki-edit__markdown-input"
              style={{ height: "500px" }}
            />
          </>
        ) : (
          <Markdown input={formInputs.markdown_content} />
        )}
      </div>
      <div className="package-wiki-content__footer">
        <NewButton
          csVariant="secondary"
          primitiveType="cyberstormLink"
          linkId="PackageWiki"
          community={communityId}
          namespace={namespaceId}
          package={packageId}
        >
          Cancel
        </NewButton>
        <NewButton
          onClick={() => {
            strongForm.submit();
          }}
          csVariant="success"
        >
          Save
        </NewButton>
      </div>
    </>
  );
}

/**
 * Displays skeleton placeholders while the new page validation loads.
 */
function WikiNewPageSkeleton() {
  return (
    <div className="package-wiki-content__body">
      <SkeletonBox className="package-wiki-edit__skeleton-title" />
      <SkeletonBox className="package-wiki-edit__skeleton-input" />
    </div>
  );
}

/**
 * Surfaces a friendly error when wiki validation fails during Suspense.
 */
function WikiNewPageAwaitError() {
  return (
    <NewAlert csVariant="danger">
      We could not confirm the wiki is available. Please try again.
    </NewAlert>
  );
}

/**
 * Maps loader errors to user-facing alerts for the new wiki page route.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
  );
}
