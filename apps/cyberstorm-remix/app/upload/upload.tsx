import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useLoaderData, useOutletContext } from "react-router";

import {
  DapperTs,
  postPackageSubmissionMetadata,
} from "@thunderstore/dapper-ts";
import { type PackageSubmissionStatus } from "@thunderstore/dapper/types";
import { type PackageSubmissionRequestData } from "@thunderstore/thunderstore-api";
import {
  type IBaseUploadHandle,
  MultipartUpload,
  type UserMedia,
} from "@thunderstore/ts-uploader";

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
  getSubmissionErrorMessages,
  getSubmissionErrorsBySection,
} from "./utils/submissionFormErrors";

interface CommunityOption {
  value: string;
  label: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

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

  // Category options
  const [categoryOptions, setCategoryOptions] = useState<
    { communityId: string; categories: CategoryOption[] }[]
  >([]);

  // Available teams
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

  // Community options
  const communityOptions: CommunityOption[] = [];
  for (const community of uploadData.results) {
    communityOptions.push({
      value: community.identifier,
      label: community.name,
    });
  }

  const [submissionStatus, setSubmissionStatus] =
    useState<PackageSubmissionStatus>();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [handle, setHandle] = useState<IBaseUploadHandle>();
  const [isDone, setIsDone] = useState<boolean>(false);

  const [usermedia, setUsermedia] = useState<UserMedia>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pollingError, setPollingError] = useState<string | null>(null);

  const submissionErrorMessages = useMemo(
    () => getSubmissionErrorMessages(submissionStatus?.form_errors),
    [submissionStatus?.form_errors]
  );

  const submissionErrorsBySection = useMemo(
    () => getSubmissionErrorsBySection(submissionErrorMessages),
    [submissionErrorMessages]
  );

  const startUpload = useCallback(async () => {
    if (!file) return;

    setUploadError(null);

    const config = requestConfig();
    if (!config.apiHost) {
      setUploadError("API host is not configured");
      return;
    }
    const upload = new MultipartUpload(
      {
        file,
      },
      requestConfig
    );

    setHandle(upload);
    try {
      await upload.start();
      setUsermedia(upload.handle);
      setIsDone(true);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      setHandle(undefined);
    }
  }, [file, requestConfig]);

  useEffect(() => {
    if (file) {
      startUpload();
    }
  }, [file]);

  const pollSubmission = async (
    submissionId: string,
    noSleep?: boolean
  ): Promise<PackageSubmissionStatus> => {
    if (!noSleep) {
      // Wait 5 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    return await dapper.getPackageSubmissionStatus(submissionId);
  };

  const submissionStatusRef = useRef<PackageSubmissionStatus | undefined>(
    submissionStatus
  );

  useEffect(() => {
    if (
      submissionStatus &&
      submissionStatusRef.current !== submissionStatus &&
      submissionStatus.status === "PENDING"
    ) {
      pollSubmission(submissionStatus.id)
        .then((data) => {
          setPollingError(null);
          submissionStatusRef.current = data;
          setSubmissionStatus(data);
          if (data.status !== "PENDING") {
            // Success is rendered inline via SubmissionResult
          }
        })
        .catch((error) => {
          // TODO: Add sentry logging
          setPollingError(`Error polling submission status: ${error.message}`);
        });
    }
  }, [submissionStatus]);

  const retryPolling = () => {
    if (submissionStatus?.id) {
      setPollingError(null);
      pollSubmission(submissionStatus.id, true).then((data) => {
        setSubmissionStatus(data);
      });
    }
  };

  function formFieldUpdateAction(
    state: PackageSubmissionRequestData,
    action: {
      field: keyof PackageSubmissionRequestData;
      value: PackageSubmissionRequestData[keyof PackageSubmissionRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    author_name: "",
    communities: [],
    has_nsfw_content: false,
    upload_uuid: "",
    categories: undefined,
    community_categories: undefined,
  });

  useEffect(() => {
    for (const community of formInputs.communities) {
      // Skip if we already have categories for this community
      if (categoryOptions.some((opt) => opt.communityId === community)) {
        continue;
      }
      dapper.getCommunityFilters(community).then((filters) => {
        setCategoryOptions((prev) => [
          ...prev,
          {
            communityId: community,
            categories: filters.package_categories.map((cat) => ({
              value: cat.slug,
              label: cat.name,
            })),
          },
        ]);
      });
    }
  }, [formInputs.communities]);

  type SubmitorOutput = Awaited<
    ReturnType<typeof postPackageSubmissionMetadata>
  >;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    const config = requestConfig();
    const dapper = new DapperTs(() => config);
    return await dapper.postPackageSubmissionMetadata(
      data.author_name,
      data.communities,
      data.has_nsfw_content,
      data.upload_uuid,
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

  const submitDisabled =
    strongForm.submitting ||
    submissionStatus?.status === "PENDING" ||
    !usermedia?.uuid ||
    formInputs.communities.length === 0;

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handle?.abort();
    setHandle(undefined);
    setUsermedia(undefined);
    setIsDone(false);
    setUploadError(null);
    setSubmitError(null);
    updateFormFieldState({
      field: "author_name",
      value: "",
    });
    updateFormFieldState({
      field: "communities",
      value: [],
    });
    updateFormFieldState({
      field: "has_nsfw_content",
      value: false,
    });
    updateFormFieldState({
      field: "upload_uuid",
      value: "",
    });
    updateFormFieldState({
      field: "categories",
      value: undefined,
    });
    updateFormFieldState({
      field: "community_categories",
      value: undefined,
    });
    setSubmissionStatus(undefined);
  };

  const handleSubmit = () => {
    setSubmitError(null);
    setPollingError(null);
    strongForm.submit();
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handle?.abort();
    setHandle(undefined);
    setUsermedia(undefined);
    setIsDone(false);
    setUploadError(null);
  };

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Upload package
      </PageHeader>
      <section className="container container--y container--full upload">
        <FormSections rootClasses="upload">
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
          {formInputs.author_name ? (
            <>
              <UploadFileSection
                file={file}
                uploadError={uploadError}
                handle={handle}
                isDone={isDone}
                sectionErrors={submissionErrorsBySection.uploadFile}
                fileInputRef={fileInputRef}
                onFileChange={setFile}
                onRemoveFile={handleRemoveFile}
              />
              <FormSectionSeparator />
            </>
          ) : null}
          {isDone && usermedia?.uuid ? (
            <>
              <UploadCommunitiesSection
                communityOptions={communityOptions}
                communities={formInputs.communities}
                sectionErrors={submissionErrorsBySection.communities}
                onCommunitiesChange={(communities) => {
                  updateFormFieldState({
                    field: "communities",
                    value: communities,
                  });
                }}
              />
              {formInputs.communities.length > 0 ? (
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
              ) : null}
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
            </>
          ) : null}
          <UploadSubmitSection
            submitError={submitError}
            strongFormSubmitting={strongForm.submitting}
            submissionStatus={submissionStatus}
            hasSubmissionFormErrors={hasSubmissionFormErrors}
            submitDisabled={submitDisabled}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
          {submissionStatus ? (
            <UploadSubmissionStatus
              submissionStatus={submissionStatus}
              pollingError={pollingError}
              submitSectionErrors={submissionErrorsBySection.submit}
              onRetryPolling={retryPolling}
            />
          ) : null}
        </FormSections>
      </section>
    </>
  );
}
