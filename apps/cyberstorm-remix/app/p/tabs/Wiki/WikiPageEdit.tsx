import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { useReducer, useState } from "react";
import {
  type LoaderFunctionArgs,
  useNavigate,
  useOutletContext,
  useRevalidator,
} from "react-router";
import { useLoaderData } from "react-router";
import { Markdown } from "~/commonComponents/Markdown/Markdown";
import { type OutletContextShape } from "~/root";

import {
  Heading,
  Modal,
  NewButton,
  NewLink,
  NewTextInput,
  Tabs,
  classnames,
  useToast,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  type PackageWikiPageEditRequestData,
  type PackageWikiPageResponseData,
  type RequestConfig,
  deletePackageWikiPage,
  postPackageWikiPageEdit,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import "./Wiki.css";

export async function loader({ params }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const dapper = new DapperTs(() => {
      return {
        apiHost: getApiHostForSsr(),
        sessionId: undefined,
      };
    });
    const wiki = await dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );
    const pageId = wiki.pages.find((p) => p.slug === params.slug)?.id;
    if (!pageId) {
      throw new Error("Page not found");
    }
    const page = await dapper.getPackageWikiPage(pageId);

    return {
      page: page,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.slug
  ) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const wiki = await dapper.getPackageWiki(
      params.namespaceId,
      params.packageId
    );
    const pageId = wiki.pages.find((p) => p.slug === params.slug)?.id;
    if (!pageId) {
      throw new Error("Page not found");
    }
    const page = await dapper.getPackageWikiPage(pageId);

    return {
      page: page,
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function WikiEdit() {
  const { page, communityId, namespaceId, packageId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  const toast = useToast();

  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  async function moveToWikiPage(slug?: string) {
    revalidator.revalidate();
    toast.addToast({
      csVariant: "info",
      children: `Moving to wiki page`,
      duration: 4000,
    });
    navigate(
      `/c/${communityId}/p/${namespaceId}/${packageId}/wiki/${
        slug || page.slug
      }`
    );
  }

  async function moveToWiki() {
    revalidator.revalidate();
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
    Error,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: (result) => {
      toast.addToast({
        csVariant: "success",
        children: `Page ${result.title} has been updated`,
        duration: 4000,
      });
      moveToWikiPage(result.slug);
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
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
        {/* <div className="markdown-wrapper">
              <div
                dangerouslySetInnerHTML={{ __html: page.markdown_content }}
                className="markdown"
              />
            </div> */}
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
        children: `Error occurred: ${error.message || "Unknown error"}`,
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
