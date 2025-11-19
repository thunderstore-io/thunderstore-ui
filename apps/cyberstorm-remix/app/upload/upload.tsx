import "./Upload.css";
import {
  NewButton,
  NewIcon,
  NewSelectSearch,
  NewSwitch,
  Heading,
  NewLink,
  NewTable,
  NewTableSort,
  NewTag,
  useToast,
} from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageHeader } from "../commonComponents/PageHeader/PageHeader";
import { DnDFileInput } from "@thunderstore/react-dnd";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  MultipartUpload,
  type IBaseUploadHandle,
} from "@thunderstore/ts-uploader";
import {
  faFileZip,
  faTreasureChest,
  faUsers,
  faArrowUpRight,
} from "@fortawesome/pro-solid-svg-icons";
import { type UserMedia } from "@thunderstore/ts-uploader/src/uploaders/types";
import { DapperTs } from "@thunderstore/dapper-ts";
import { type MetaFunction } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import {
  type PackageSubmissionResult,
  type PackageSubmissionStatus,
} from "@thunderstore/dapper/types";
import { type PackageSubmissionRequestData } from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "../root";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { postPackageSubmissionMetadata } from "@thunderstore/dapper-ts/src/methods/package";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";

interface CommunityOption {
  value: string;
  label: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Upload | Thunderstore" },
    {
      name: "description",
      content: "Upload a package to Thunderstore",
    },
  ];
};

export async function loader() {
  const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
  const dapper = new DapperTs(() => {
    return {
      apiHost: publicEnvVariables.VITE_API_URL,
      sessionId: undefined,
    };
  });
  return await dapper.getCommunities();
}

export async function clientLoader() {
  // console.log("clientloader context", getSessionTools(context));
  const tools = getSessionTools();
  const dapper = new DapperTs(() => {
    return {
      apiHost: tools?.getConfig().apiHost,
      sessionId: tools?.getConfig().sessionId,
    };
  });
  return await dapper.getCommunities();
}

export default function Upload() {
  const uploadData = useLoaderData<typeof loader | typeof clientLoader>();

  const outletContext = useOutletContext() as OutletContextShape;
  const requestConfig = outletContext.requestConfig;
  const currentUser = outletContext.currentUser;
  const dapper = outletContext.dapper;

  const toast = useToast();

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

  const startUpload = useCallback(async () => {
    if (!file) return;

    const config = requestConfig();
    if (!config.apiHost) {
      throw new Error("API host is not configured");
    }
    const upload = new MultipartUpload(
      {
        file,
      },
      requestConfig
    );

    setHandle(upload);
    toast.addToast({
      csVariant: "info",
      children: "Starting upload",
      duration: 4000,
    });
    try {
      await upload.start();
      setUsermedia(upload.handle);
      setIsDone(true);
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: error instanceof Error ? error.message : "Upload failed",
        duration: 8000,
      });
      setHandle(undefined);
    }
  }, [file, requestConfig, toast]);

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
    toast.addToast({
      csVariant: "info",
      children: "Polling submission status",
      duration: 4000,
    });
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
          submissionStatusRef.current = data;
          setSubmissionStatus(data);
          if (data.status === "PENDING") {
            toast.addToast({
              csVariant: "info",
              children:
                "Submission is still pending, polling again in 5 seconds",
              duration: 4000,
            });
          } else {
            if (data.form_errors || !data.result) {
              toast.addToast({
                csVariant: "danger",
                children:
                  "Submission completed, but there were issues. Please check the form errors.",
                duration: 8000,
              });
            } else {
              toast.addToast({
                csVariant: "success",
                children: `Package ${data.result?.package_version
                  .full_name} uploaded successfully! It's now available in ${
                  data.result?.available_communities.length === 1
                    ? data.result?.available_communities[0].community.name
                    : `${data.result?.available_communities.length} communities`
                }!`,
                duration: 8000,
              });
            }
          }
        })
        .catch((error) => {
          // TODO: Add sentry logging
          toast.addToast({
            csVariant: "danger",
            children: `Error polling submission status: ${error.message}`,
            duration: 8000,
          });
        });
    }
  }, [submissionStatus]);

  const retryPolling = () => {
    if (submissionStatus?.id) {
      pollSubmission(submissionStatus.id, true).then((data) => {
        setSubmissionStatus(data);
      });
    }
  };

  // Helper function to format field names for display
  const formatFieldName = (field: string) => {
    return field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
      toast.addToast({
        csVariant: "info",
        children: `Package submitted, wait for processing to complete.`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
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

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Upload package
      </PageHeader>
      <section className="container container--y container--full upload">
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Team</p>
            <p className="upload__description">
              Select the team you want your package to be associated with.
            </p>
          </div>
          <div className="upload__content">
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
                primitiveType="link"
                href={`${outletContext.domain}/settings/teams/`}
                csVariant="cyber"
                rootClasses="community__item"
              >
                <span>Create team</span>
              </NewLink>
            </span>
          </div>
        </div>
        <div className="upload__divider" />
        {formInputs.author_name ? (
          <>
            <div className="container container--x container--full upload__row">
              <div className="upload__meta">
                <p className="upload__title">Upload file</p>
                <p className="upload__description">
                  Upload your package as a ZIP file.
                </p>
              </div>
              <div className="upload__content">
                <DnDFileInput
                  rootClasses={classnames(
                    "drag-n-drop",
                    file ? "drag-n-drop--success" : null
                  )}
                  name="file"
                  baseState={
                    <div className="drag-n-drop__body">
                      {file ? (
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
                              file.size > 0 ? formatBytes(file.size) : "0 Bytes"
                            })`}
                          </span>
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
              </div>
            </div>
            <div className="upload__divider" />
          </>
        ) : null}
        {isDone && usermedia?.uuid ? (
          <>
            <div className="container container--x container--full upload__row">
              <div className="upload__meta">
                <p className="upload__title">Communities</p>
                <p className="upload__description">
                  Select communities you want your package to be listed under.
                </p>
              </div>
              <div className="upload__content">
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
              </div>
            </div>
            {formInputs.communities && formInputs.communities.length !== 0 && (
              <div className="container container--x container--full upload__row">
                <div className="upload__meta">
                  <p className="upload__title">Categories</p>
                  <p className="upload__description">
                    Select descriptive categories to help people discover your
                    package.
                  </p>
                </div>
                <div className="upload__content">
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
                              ? formInputs.community_categories[community]?.map(
                                  (categoryId) => ({
                                    value: categoryId,
                                    label:
                                      categories.find(
                                        (c) => c.value === categoryId
                                      )?.label || "",
                                  })
                                )
                              : []
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="upload__divider" />
            <div className="container container--x container--full upload__row">
              <div className="upload__meta">
                <p className="upload__title">Contains NSFW content</p>
                <p className="upload__description">
                  Select if your package contains NSFW material. An
                  &ldquo;NSFW&rdquo; -tag will be applied to your package.
                </p>
              </div>
              <div className="upload__content upload__nsfw-switch">
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
            </div>
            <div className="upload__divider" />
          </>
        ) : null}
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Submit</p>
            <p className="upload__description">
              Double-check your selections and hit &ldquo;Submit&rdquo; when
              you&rsquo;re ready!
            </p>
          </div>
          <div className="upload__content">
            <div className="upload__buttons">
              <NewButton
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  handle?.abort();
                  setHandle(undefined);
                  setUsermedia(undefined);
                  setIsDone(false);
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
                }}
                csVariant="secondary"
                csSize="big"
              >
                Reset
              </NewButton>
              <NewButton
                disabled={
                  !usermedia?.uuid || formInputs.communities.length === 0
                }
                onClick={strongForm.submit}
                csVariant="accent"
                csSize="big"
                rootClasses="upload__submit"
              >
                Submit
              </NewButton>
            </div>
          </div>
        </div>
        <div className="upload__divider" />
        {submissionStatus ? (
          <div className="submission__status">
            {submissionStatus.form_errors &&
              Object.keys(submissionStatus.form_errors).length > 0 && (
                <div className="submission__error">
                  <p>Form Errors:</p>
                  <ul>
                    {Object.entries(submissionStatus.form_errors).map(
                      ([field, error]) => (
                        <li key={field}>
                          {field !== "__all__" && (
                            <strong>{formatFieldName(field)}: </strong>
                          )}
                          {Array.isArray(error)
                            ? error.join(", ")
                            : String(error)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            {submissionStatus.result && (
              <SubmissionResult
                submissionStatusResult={submissionStatus.result}
              />
            )}
            <NewButton onClick={retryPolling}>Retry Status Check</NewButton>
          </div>
        ) : null}
      </section>
    </>
  );
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const SubmissionResult = (props: {
  submissionStatusResult: PackageSubmissionResult;
}) => {
  return (
    <div className="container container--y container--full island">
      <PageHeader
        headingLevel="1"
        headingSize="3"
        image={props.submissionStatusResult.package_version.icon}
        description={props.submissionStatusResult.package_version.description}
        variant="detailed"
        meta={
          <>
            <span className="page-header__meta-item">
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faUsers} />
              </NewIcon>
              By {props.submissionStatusResult.package_version.namespace}
            </span>
            {props.submissionStatusResult.package_version.website_url ? (
              <NewLink
                primitiveType="link"
                href={props.submissionStatusResult.package_version.website_url}
                csVariant="cyber"
                rootClasses="page-header__meta-item"
              >
                {props.submissionStatusResult.package_version.website_url}
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faArrowUpRight} />
                </NewIcon>
              </NewLink>
            ) : null}
          </>
        }
      >
        {props.submissionStatusResult.package_version.name}
      </PageHeader>

      <NewTable
        titleRowContent={
          <>
            <Heading csLevel="3" csSize="3">
              Success!
            </Heading>
            <p>
              The package is listed in{" "}
              {props.submissionStatusResult.available_communities.length}{" "}
              {props.submissionStatusResult.available_communities.length !== 1
                ? "communities"
                : "community"}
              :
            </p>
          </>
        }
        headers={[
          {
            value: "Community",
            disableSort: false,
            columnClasses: "versions__version",
          },
          {
            value: "Link",
            disableSort: true,
            columnClasses: "versions__upload-date",
          },
          {
            value: "Categories",
            disableSort: true,
            columnClasses: "versions__downloads",
          },
        ]}
        rows={props.submissionStatusResult.available_communities.map((v) => [
          {
            value: v.community.name,
            sortValue: v.community.name,
          },
          {
            value: (
              <NewLink
                primitiveType="link"
                href={v.url}
                target="_blank"
                csVariant="cyber"
              >
                View listing
              </NewLink>
            ),
            sortValue: v.url,
          },
          {
            value: v.categories.map((c) => (
              <NewTag key={c.slug} csSize="small">
                {c.name}
              </NewTag>
            )),
            sortValue: v.categories.map((c) => c.name).join(", "),
          },
        ])}
        sortDirection={NewTableSort.ASC}
        csModifiers={["alignLastColumnRight"]}
      />
    </div>
  );
};
