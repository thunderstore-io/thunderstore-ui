import "./Wiki.css";

import {
  LoaderFunctionArgs,
  useNavigate,
  useOutletContext,
} from "react-router";
import { useLoaderData } from "react-router";
import {
  Heading,
  NewButton,
  NewTextInput,
  Tabs,
} from "@thunderstore/cyberstorm";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { useReducer, useState } from "react";
import {
  PackageWikiPageCreateRequestData,
  postPackageWikiPageCreate,
} from "@thunderstore/thunderstore-api";
import { OutletContextShape } from "~/root";
import { Markdown } from "~/commonComponents/Markdown/Markdown";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
    };
  } else {
    throw new Error("Namespace ID or Package ID is missing");
  }
}

export default function Wiki() {
  const { communityId, namespaceId, packageId } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const outletContext = useOutletContext() as OutletContextShape;

  const toast = useToast();

  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  async function moveToWikiPage(slug: string) {
    toast.addToast({
      csVariant: "info",
      children: `Moving to the created wiki page`,
      duration: 4000,
    });
    navigate(`/c/${communityId}/p/${namespaceId}/${packageId}/wiki/${slug}`);
  }

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
    Error,
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
        children: `Error occurred: ${error.message || "Unknown error"}`,
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
