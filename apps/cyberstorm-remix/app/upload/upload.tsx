import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Link, useLoaderData, useOutletContext } from "react-router";

import { NewAlert } from "@thunderstore/cyberstorm";
import {
  DapperTs,
  postPackageSubmissionMetadata,
} from "@thunderstore/dapper-ts";
import { type PackageSubmissionStatus } from "@thunderstore/dapper/types";
import { type PackageSubmissionRequestData } from "@thunderstore/thunderstore-api";
import { useUploadProgress } from "@thunderstore/ts-uploader-react";

import { RouteErrorBoundary } from "../commonComponents/ErrorBoundary/RouteErrorBoundary";
import {
  FormSectionSeparator,
  FormSections,
} from "../commonComponents/FormSection/FormSection";
import { PageHeader } from "../commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "../root";
import type { Route } from "./+types/upload";
import "./Upload.css";
import { UploadCategoriesSection } from "./components/UploadCategoriesSection";
import { UploadCommunitiesSection } from "./components/UploadCommunitiesSection";
import { UploadFileSection } from "./components/UploadFileSection";
import { UploadNsfwSection } from "./components/UploadNsfwSection";
import { UploadSubmissionStatus } from "./components/UploadSubmissionStatus";
import { UploadSubmitSection } from "./components/UploadSubmitSection";
import { UploadTeamSection } from "./components/UploadTeamSection";
import {
  usePackageFileUpload,
  useSubmissionStatusPolling,
  useUploadCategoryOptions,
} from "./uploadHooks";
import UploadPreview from "./uploadPreview";
import {
  type UploadFormFieldAction,
  buildCommunityOptions,
  getSubmissionErrorMessages,
  getSubmissionErrorsBySection,
  getUploadProgressPercent,
  initialUploadFormInputs,
  isUploadSubmitDisabled,
  pruneCommunityCategories,
  uploadFormFieldReducer,
} from "./uploadUtils";

export const loader = ssrLoader(async () => {
  const dapper = new DapperTs(() => {
    return {
      apiHost: getApiHostForSsr(),
      sessionId: undefined,
    };
  });
  const communities = await dapper.getCommunities();
  return {
    ...communities,
    seo: createSeo({
      descriptors: [
        { title: "Upload package | Thunderstore" },
        {
          name: "description",
          content: "Upload a package to Thunderstore.",
        },
      ],
    }),
  };
});

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const tools = getSessionTools();
  const currentUser = await tools?.getSessionCurrentUser(true);

  if (!currentUser?.username) {
    const url = new URL(request.url);
    return redirectToLogin(url.pathname + url.search + url.hash);
  }

  const dapper = new DapperTs(() => {
    return {
      apiHost: tools?.getConfig().apiHost,
      sessionId: tools?.getConfig().sessionId,
    };
  });
  const communities = await dapper.getCommunities();
  return communities;
}

clientLoader.hydrate = true;

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default function Upload() {
  const uploadData = useLoaderData<typeof loader | typeof clientLoader>();

  const outletContext = useOutletContext() as OutletContextShape;
  const requestConfig = outletContext.requestConfig;
  const currentUser = outletContext.currentUser;
  const dapper = outletContext.dapper;

  const communityOptions = useMemo(
    () => buildCommunityOptions(uploadData.results),
    [uploadData.results]
  );

  const [availableTeams, setAvailableTeams] = useState<
    {
      name: string;
      role: string;
      member_count: number;
    }[]
  >([]);
  useEffect(() => {
    setAvailableTeams(currentUser?.teams_full ?? []);
  }, [currentUser?.teams_full]);

  const [submissionStatus, setSubmissionStatus] =
    useState<PackageSubmissionStatus>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    file,
    startUpload,
    selectFile,
    fileInputRef,
    handle,
    isDone,
    usermedia,
    uploadError,
    clearFile,
  } = usePackageFileUpload(requestConfig);

  const uploadProgress = useUploadProgress(handle);
  const isUploading = !!handle && !isDone;
  const uploadProgressPercent = getUploadProgressPercent(uploadProgress);

  const { pollingError, setPollingError, retryPolling } =
    useSubmissionStatusPolling(dapper, submissionStatus, setSubmissionStatus);

  const submissionErrorMessages = useMemo(
    () => getSubmissionErrorMessages(submissionStatus?.form_errors),
    [submissionStatus?.form_errors]
  );

  const submissionErrorsBySection = useMemo(
    () => getSubmissionErrorsBySection(submissionErrorMessages),
    [submissionErrorMessages]
  );

  const [formInputs, dispatchForm] = useReducer(
    uploadFormFieldReducer,
    initialUploadFormInputs
  );

  const updateFormFieldState = (action: UploadFormFieldAction) => {
    dispatchForm(action);
  };

  const categoryOptions = useUploadCategoryOptions(
    dapper,
    formInputs.communities
  );

  type SubmitorOutput = Awaited<
    ReturnType<typeof postPackageSubmissionMetadata>
  >;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    let uploadUuid = data.upload_uuid;

    if (!uploadUuid) {
      const uploadedMedia = await startUpload();
      uploadUuid = uploadedMedia?.uuid;

      if (!uploadUuid) {
        throw new Error("Upload failed before submission.");
      }

      updateFormFieldState({
        field: "upload_uuid",
        value: uploadUuid,
      });
    }

    const config = requestConfig();
    const submitDapper = new DapperTs(() => config);

    return await submitDapper.postPackageSubmissionMetadata(
      data.author_name,
      data.communities,
      data.has_nsfw_content,
      uploadUuid,
      data.categories,
      data.community_categories
    );
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    PackageSubmissionRequestData,
    Error,
    SubmitorOutput,
    Error,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      setSubmitError(null);
    },
    onSubmitError: (error) => {
      setSubmitError(error.message || "Unknown error");
    },
  });

  useEffect(() => {
    if (usermedia?.uuid) {
      updateFormFieldState({
        field: "upload_uuid",
        value: usermedia.uuid,
      });
    }
  }, [usermedia?.uuid]);

  useEffect(() => {
    setSubmissionStatus(strongForm.submitOutput);
  }, [strongForm.submitOutput]);

  const hasSubmissionFormErrors =
    !!submissionStatus?.form_errors &&
    Object.keys(submissionStatus.form_errors).length > 0;

  const submitDisabled = isUploadSubmitDisabled({
    submitting: strongForm.submitting,
    submissionPending: submissionStatus?.status === "PENDING",
    authorName: formInputs.author_name,
    hasSelectedFile: !!file,
    communitiesCount: formInputs.communities.length,
  });

  const handleReset = () => {
    clearFile();
    setSubmitError(null);
    setSubmissionStatus(undefined);
    dispatchForm("reset");
  };

  const handleSubmit = () => {
    setSubmitError(null);
    setPollingError(null);
    setSubmissionStatus(undefined);
    strongForm.submit();
  };

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Upload package
      </PageHeader>
      <section className="container container--y container--full upload">
        <div className="upload__helper-alerts">
          <NewAlert csVariant="info">
            <p className="upload__helper-text">
              Need help formatting your package? Check out the{" "}
              <a
                href="https://wiki.thunderstore.io/mods/creating-a-package"
                target="_blank"
                rel="noreferrer"
              >
                Thunderstore wiki
              </a>
              .
            </p>
            <p className="upload__helper-text">
              Review your readme before upload using the{" "}
              <Link to="/tools/markdown-preview">markdown preview tool</Link>.
            </p>
            <p className="upload__helper-text">
              Uploading a large file? Check your package manifest first with the{" "}
              <Link to="/tools/manifest-validator">
                package manifest validator
              </Link>
              .
            </p>
          </NewAlert>
        </div>
        <FormSections>
          <UploadFileSection
            file={file}
            uploadError={uploadError}
            handle={handle}
            sectionErrors={submissionErrorsBySection.uploadFile}
            fileInputRef={fileInputRef}
            onFileChange={(nextFile) => {
              selectFile(nextFile);
              updateFormFieldState({
                field: "upload_uuid",
                value: "",
              });
            }}
            onRemoveFile={() => {
              clearFile();
              updateFormFieldState({
                field: "upload_uuid",
                value: "",
              });
            }}
          />
          <FormSectionSeparator />
          <UploadTeamSection
            availableTeams={availableTeams}
            authorName={formInputs.author_name}
            onAuthorNameChange={(authorName) => {
              updateFormFieldState({
                field: "author_name",
                value: authorName,
              });
            }}
          />
          <FormSectionSeparator />
          <UploadCommunitiesSection
            communityOptions={communityOptions}
            communities={formInputs.communities}
            sectionErrors={submissionErrorsBySection.communities}
            onCommunitiesChange={(communities) => {
              updateFormFieldState({
                field: "communities",
                value: communities,
              });
              updateFormFieldState({
                field: "community_categories",
                value: pruneCommunityCategories(
                  formInputs.community_categories,
                  communities
                ),
              });
            }}
          />
          <FormSectionSeparator />
          <UploadCategoriesSection
            communities={formInputs.communities}
            communityCategories={formInputs.community_categories}
            categoryOptions={categoryOptions}
            communityResults={uploadData.results}
            sectionErrors={submissionErrorsBySection.categories}
            onCommunityCategoriesChange={(communityCategories) => {
              updateFormFieldState({
                field: "community_categories",
                value: communityCategories,
              });
            }}
          />
          <FormSectionSeparator />
          <UploadNsfwSection
            hasNsfwContent={formInputs.has_nsfw_content}
            onHasNsfwContentChange={(hasNsfwContent) => {
              updateFormFieldState({
                field: "has_nsfw_content",
                value: hasNsfwContent,
              });
            }}
          />
          <FormSectionSeparator />
          <UploadSubmitSection
            submitError={submitError}
            strongFormSubmitting={strongForm.submitting}
            submissionStatus={submissionStatus}
            hasSubmissionFormErrors={hasSubmissionFormErrors}
            submitDisabled={submitDisabled}
            isUploading={isUploading}
            uploadProgressPercent={uploadProgressPercent}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
          {submissionStatus || strongForm.submitting ? (
            <UploadSubmissionStatus
              submitting={strongForm.submitting}
              submissionStatus={submissionStatus}
              pollingError={pollingError}
              submitSectionErrors={submissionErrorsBySection.submit}
              onRetryPolling={retryPolling}
            />
          ) : null}
        </FormSections>
        <UploadPreview file={file} />
      </section>
    </>
  );
}
