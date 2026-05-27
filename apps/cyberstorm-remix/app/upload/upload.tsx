import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  faCircleXmark,
  faFileZip,
  faTreasureChest,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  NewAlert,
  NewButton,
  NewIcon,
  NewLink,
  NewSelectSearch,
  NewSwitch,
  classnames,
} from "@thunderstore/cyberstorm";
import {
  DapperTs,
  postPackageSubmissionMetadata,
} from "@thunderstore/dapper-ts";
import { type PackageSubmissionStatus } from "@thunderstore/dapper/types";
import { DnDFileInput } from "@thunderstore/react-dnd";
import { type PackageSubmissionRequestData } from "@thunderstore/thunderstore-api";
import {
  type IBaseUploadHandle,
  MultipartUpload,
  type UserMedia,
} from "@thunderstore/ts-uploader";

import { RouteErrorBoundary } from "../commonComponents/ErrorBoundary/RouteErrorBoundary";
import {
  FormSection,
  FormSectionSeparator,
  FormSections,
} from "../commonComponents/FormSection/FormSection";
import { PageHeader } from "../commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "../root";
import type { Route } from "./+types/upload";
import "./Upload.css";
import { UploadSubmissionStatus } from "./components/UploadSubmissionStatus";
import { UploadSubmitSection } from "./components/UploadSubmitSection";
import { formatBytes } from "./utils/formatBytes";
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

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Upload package
      </PageHeader>
      <section className="container container--y container--full upload">
        <FormSections rootClasses="upload">
          <FormSection
            title="Team"
            description="Select the team you want your package to be associated with."
          >
            <NewSelectSearch
              placeholder="Select team"
              options={availableTeams?.map((team) => ({
                value: team.name,
                label: team.name,
              }))}
              onChange={(val) => {
                if (val) {
                  updateFormFieldState({
                    field: "author_name",
                    value: val.value,
                  });
                } else {
                  updateFormFieldState({
                    field: "author_name",
                    value: "",
                  });
                }
              }}
              value={
                formInputs.author_name
                  ? {
                      value: formInputs.author_name,
                      label: formInputs.author_name,
                    }
                  : undefined
              }
            />
            <span className="upload__no-teams">
              <p className="upload__no-teams-text">No teams available?</p>
              <NewLink
                key="create-team-link"
                primitiveType="cyberstormLink"
                linkId="Teams"
                csVariant="cyber"
                rootClasses="community__item"
              >
                <span>Create team</span>
              </NewLink>
            </span>
          </FormSection>
          <FormSectionSeparator />
          {formInputs.author_name ? (
            <>
              <FormSection
                title="Upload file"
                description="Upload your package as a ZIP file."
              >
                <DnDFileInput
                  rootClasses={classnames(
                    "drag-n-drop",
                    uploadError ? "drag-n-drop--error" : null,
                    file && !uploadError ? "drag-n-drop--success" : null
                  )}
                  name="file"
                  baseState={
                    <div className="drag-n-drop__body">
                      {file ? (
                        <>
                          {uploadError ? (
                            <>
                              <NewIcon
                                wrapperClasses="drag-n-drop__icon"
                                csVariant="danger"
                              >
                                <FontAwesomeIcon icon={faCircleXmark} />
                              </NewIcon>
                              <span className="drag-n-drop__main-text">
                                {file.name}{" "}
                                {`(${
                                  file.size > 0
                                    ? formatBytes(file.size)
                                    : "0 Bytes"
                                })`}
                              </span>
                            </>
                          ) : (
                            <>
                              <NewIcon
                                wrapperClasses="drag-n-drop__icon"
                                csVariant="success"
                              >
                                <FontAwesomeIcon icon={faCheckCircle} />
                              </NewIcon>
                              <span className="drag-n-drop__main-text">
                                {file.name}{" "}
                                {`(${
                                  file.size > 0
                                    ? formatBytes(file.size)
                                    : "0 Bytes"
                                })`}
                              </span>
                            </>
                          )}
                          <button
                            className="drag-n-drop__remove-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                              handle?.abort();
                              setHandle(undefined);
                              setUsermedia(undefined);
                              setIsDone(false);
                              setUploadError(null);
                            }}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <NewIcon
                            wrapperClasses="drag-n-drop__icon"
                            csVariant="accent"
                          >
                            <FontAwesomeIcon icon={faFileZip} />
                          </NewIcon>
                          <span className="drag-n-drop__main-text">
                            Drag and drop your ZIP file here
                          </span>
                          <span className="drag-n-drop__sub-text">5GB max</span>
                        </>
                      )}
                    </div>
                  }
                  dragState={
                    <div className="drag-n-drop__body">
                      <NewIcon
                        wrapperClasses="drag-n-drop__icon"
                        csVariant="accent"
                      >
                        <FontAwesomeIcon icon={faTreasureChest} />
                      </NewIcon>
                      {file ? (
                        <span>{file.name}</span>
                      ) : (
                        <span className="drag-n-drop__main-text">
                          Drag file here
                        </span>
                      )}
                    </div>
                  }
                  onChange={(files) => {
                    setFile(files.item(0));
                  }}
                  readonly={!!handle}
                  fileInputRef={fileInputRef}
                />
                {uploadError ? (
                  <NewAlert csVariant="danger" rootClasses="upload__alert">
                    {uploadError}
                  </NewAlert>
                ) : null}
                {handle && !isDone ? (
                  <p className="upload__processing">Uploading…</p>
                ) : null}
                {submissionErrorsBySection.uploadFile.length > 0 ? (
                  <NewAlert csVariant="danger" rootClasses="upload__alert">
                    <ul>
                      {submissionErrorsBySection.uploadFile.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  </NewAlert>
                ) : null}
              </FormSection>
              <FormSectionSeparator />
            </>
          ) : null}
          {isDone && usermedia?.uuid ? (
            <>
              <FormSection
                title="Communities"
                description="Select communities you want your package to be listed under."
              >
                <NewSelectSearch
                  placeholder="Select communities"
                  multiple
                  options={communityOptions}
                  onChange={(val) => {
                    if (val) {
                      updateFormFieldState({
                        field: "communities",
                        value: val.map((c) => c.value),
                      });
                    } else {
                      updateFormFieldState({
                        field: "communities",
                        value: [],
                      });
                    }
                  }}
                  value={formInputs.communities?.map((communityId) => ({
                    value: communityId,
                    label:
                      communityOptions.find((c) => c.value === communityId)
                        ?.label || "",
                  }))}
                />
                {submissionErrorsBySection.communities.length > 0 ? (
                  <NewAlert csVariant="danger" rootClasses="upload__alert">
                    <ul>
                      {submissionErrorsBySection.communities.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  </NewAlert>
                ) : null}
              </FormSection>
              {formInputs.communities &&
                formInputs.communities.length !== 0 && (
                  <FormSection
                    title="Categories"
                    description="Select descriptive categories to help people discover your package."
                  >
                    {submissionErrorsBySection.categories.length > 0 ? (
                      <NewAlert csVariant="danger" rootClasses="upload__alert">
                        <ul>
                          {submissionErrorsBySection.categories.map((msg) => (
                            <li key={msg}>{msg}</li>
                          ))}
                        </ul>
                      </NewAlert>
                    ) : null}
                    {formInputs.communities.map((community) => {
                      const communityData = uploadData.results.find(
                        (c) => c.identifier === community
                      );
                      const categories =
                        categoryOptions.find((c) => c.communityId === community)
                          ?.categories || [];

                      return (
                        <div key={community} className="upload__category">
                          <p className="upload__category-label">
                            {communityData?.name}
                          </p>
                          <NewSelectSearch
                            placeholder="Select categories"
                            multiple
                            options={categories}
                            onChange={(val) => {
                              if (val) {
                                updateFormFieldState({
                                  field: "community_categories",
                                  value: {
                                    ...formInputs.community_categories,
                                    [community]: val
                                      ? val.map((v) => v.value)
                                      : [],
                                  },
                                });
                              } else {
                                if (
                                  formInputs.community_categories &&
                                  formInputs.community_categories[community]
                                ) {
                                  const temp = formInputs.community_categories;
                                  delete temp[community];
                                  updateFormFieldState({
                                    field: "community_categories",
                                    value: {
                                      ...temp,
                                    },
                                  });
                                }
                              }
                            }}
                            value={
                              formInputs.community_categories
                                ? formInputs.community_categories[
                                    community
                                  ]?.map((categoryId) => ({
                                    value: categoryId,
                                    label:
                                      categories.find(
                                        (c) => c.value === categoryId
                                      )?.label || "",
                                  }))
                                : []
                            }
                          />
                        </div>
                      );
                    })}
                  </FormSection>
                )}
              <FormSectionSeparator />
              <FormSection
                title="Contains NSFW content"
                description='Select if your package contains NSFW material. An "NSFW" -tag will be applied to your package.'
              >
                <div className="upload__nsfw-switch">
                  No
                  <NewSwitch
                    value={formInputs.has_nsfw_content}
                    onChange={(checked) => {
                      updateFormFieldState({
                        field: "has_nsfw_content",
                        value: checked,
                      });
                    }}
                  />
                  Yes
                </div>
              </FormSection>
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
