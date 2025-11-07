import "./Wiki.css";

import {
  Await,
  type LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";
import {
  Heading,
  Modal,
  NewAlert,
  NewButton,
  NewLink,
  NewTextInput,
  SkeletonBox,
  Tabs,
  useToast,
} from "@thunderstore/cyberstorm";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { Suspense, useReducer, useState } from "react";
import {
  deletePackageWikiPage,
  type PackageWikiPageEditRequestData,
  type PackageWikiPageResponseData,
  postPackageWikiPageEdit,
  type RequestConfig,
  UserFacingError,
  formatUserFacingError,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "~/root";
import { Markdown } from "~/commonComponents/Markdown/Markdown";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

type MaybePromise<T> = T | Promise<T>;

type ResultType = {
  page: MaybePromise<PackageWikiPageResponseData | undefined>;
  communityId: string;
  namespaceId: string;
  packageId: string;
};

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const { dapper } = getLoaderTools();
    const pagePromise = dapper
      .getPackageWiki(params.namespaceId, params.packageId)
      .then((wiki) => {
        if (!wiki) {
          throwUserFacingPayloadResponse(
            {
              headline: "Wiki not available.",
              description: "We could not find the requested wiki.",
              category: "not_found",
              status: 404,
            },
            { statusOverride: 404 }
          );
        }

        const pageId = wiki.pages.find(
          (candidate) => candidate.slug === params.slug
        )?.id;

        if (!pageId) {
          throwUserFacingPayloadResponse(
            {
              headline: "Wiki page not available.",
              description: "We could not find the requested wiki page.",
              category: "not_found",
              status: 404,
            },
            { statusOverride: 404 }
          );
        }

        return dapper.getPackageWikiPage(pageId);
      });

    return {
      page: pagePromise,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    } satisfies ResultType;
  } else {
    throwUserFacingPayloadResponse({
      headline: "Wiki page not available for edit.",
      description: "We could not find the requested wiki page for editing.",
      category: "not_found",
      status: 404,
    });
  }
}

/**
 * Renders the wiki page editor and defers data resolution to Suspense.
 */
export default function WikiEdit() {
  const { page, communityId, namespaceId, packageId } =
    useLoaderData<typeof clientLoader>();

  return (
    <Suspense fallback={<WikiEditSkeleton />}>
      <Await resolve={page} errorElement={<NimbusAwaitErrorElement />}>
        {(resolvedPage) =>
          resolvedPage ? (
            <WikiEditContent
              page={resolvedPage}
              communityId={communityId}
              namespaceId={namespaceId}
              packageId={packageId}
            />
          ) : (
            <NewAlert csVariant="info">Wiki page not found.</NewAlert>
          )
        }
      </Await>
    </Suspense>
  );
}

type WikiEditContentProps = {
  page: PackageWikiPageResponseData;
  communityId: string;
  namespaceId: string;
  packageId: string;
};

/**
 * Provides the interactive wiki page edit form once the page data is ready.
 */
function WikiEditContent({
  page,
  communityId,
  namespaceId,
  packageId,
}: WikiEditContentProps) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  async function moveToWikiPage() {
    toast.addToast({
      csVariant: "info",
      children: `Moving to wiki page`,
      duration: 4000,
    });
    navigate(
      `/c/${communityId}/p/${namespaceId}/${packageId}/wiki/${page.slug}`
    );
  }

  async function moveToWiki() {
    toast.addToast({
      csVariant: "info",
      children: `Moving to wiki page`,
      duration: 4000,
    });
    navigate(`/c/${communityId}/p/${namespaceId}/${packageId}/wiki`);
  }

  function formFieldUpdateAction(
    state: PackageWikiPageEditRequestData,
    action: {
      field: keyof PackageWikiPageEditRequestData;
      value: PackageWikiPageEditRequestData[keyof PackageWikiPageEditRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    id: page.id,
    title: page.title,
    markdown_content: page.markdown_content,
  });

  type SubmitorOutput = Awaited<ReturnType<typeof postPackageWikiPageEdit>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await postPackageWikiPageEdit({
      config: outletContext.requestConfig,
      params: { namespace_id: namespaceId, package_name: packageId },
      data: {
        id: data.id,
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
    PackageWikiPageEditRequestData,
    Error,
    SubmitorOutput,
    UserFacingError,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Page ${page.title} has been updated`,
        duration: 4000,
      });
      moveToWikiPage();
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
          <Heading csLevel="3">Editing page</Heading>
        </div>
        <div className="package-wiki-content__actions">
          <DeletePackageWikiPageForm
            page={page}
            communityId={communityId}
            namespaceId={namespaceId}
            packageId={packageId}
            toast={toast}
            updateTrigger={moveToWiki}
            config={outletContext.requestConfig}
          />
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
          linkId="PackageWikiPage"
          community={communityId}
          namespace={namespaceId}
          package={packageId}
          wikipageslug={page.slug}
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
 * Renders a skeleton while wiki edit data streams in.
 */
function WikiEditSkeleton() {
  return (
    <div className="package-wiki-content__body">
      <SkeletonBox className="package-wiki-edit__skeleton-title" />
      <SkeletonBox className="package-wiki-edit__skeleton-input" />
      <SkeletonBox className="package-wiki-edit__skeleton-input" />
    </div>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}

/**
 * Confirmation modal to delete a wiki page and refresh the listing.
 */
function DeletePackageWikiPageForm(props: {
  communityId: string;
  namespaceId: string;
  packageId: string;
  page: PackageWikiPageResponseData;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}) {
  const {
    page,
    communityId,
    namespaceId,
    packageId,
    toast,
    updateTrigger,
    config,
  } = props;
  const deleteWikiPageAction = ApiAction({
    endpoint: deletePackageWikiPage,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Wiki page deleted`,
        duration: 4000,
      });
      updateTrigger();
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
    <Modal
      csSize="small"
      trigger={<NewButton csVariant="danger">Delete page</NewButton>}
      titleContent="Delete wiki page"
    >
      <Modal.Body>
        <div>
          You are about to delete wiki page{" "}
          <NewLink
            primitiveType="cyberstormLink"
            linkId="PackageWikiPage"
            community={communityId}
            namespace={namespaceId}
            package={packageId}
            wikipageslug={page.slug}
            csVariant="cyber"
          >
            {page.title}
          </NewLink>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <NewButton
          csVariant="danger"
          onClick={() =>
            deleteWikiPageAction({
              config: config,
              params: { namespace_id: namespaceId, package_name: packageId },
              queryParams: {},
              data: { id: page.id },
            })
          }
        >
          Delete
        </NewButton>
      </Modal.Footer>
    </Modal>
  );
}

DeletePackageWikiPageForm.displayName = "DeletePackageWikiPageForm";
