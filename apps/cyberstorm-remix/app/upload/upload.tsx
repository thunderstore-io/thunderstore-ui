import "./Upload.css";
import {
  NewBreadCrumbs,
  NewButton,
  NewIcon,
  // Select,
  NewSelectSearch,
  NewSelectOption,
  NewSwitch,
  Heading,
  NewLink,
  NewTable,
  NewTableSort,
  NewTag,
} from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageHeader } from "../commonComponents/PageHeader/PageHeader";
import { DnDFileInput } from "@thunderstore/react-dnd";
import { useCallback, useEffect, useRef, useState } from "react";
import { MultipartUpload, IBaseUploadHandle } from "@thunderstore/ts-uploader";
import {
  useUploadProgress,
  useUploadStatus,
  useUploadError,
  useUploadControls,
} from "@thunderstore/ts-uploader-react";
// import { useOutletContext } from "@remix-run/react";
// import { OutletContextShape } from "../../root";
import { useSession } from "@thunderstore/ts-api-react";
import {
  faFileZip,
  faTreasureChest,
  faUsers,
  faArrowUpRight,
} from "@fortawesome/pro-solid-svg-icons";
import { UserMedia } from "@thunderstore/ts-uploader/src/client/types";
import { DapperTs, PackageSubmissionResponse } from "@thunderstore/dapper-ts";
import { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  packageSubmissionErrorSchema,
  packageSubmissionStatusSchema,
} from "@thunderstore/dapper-ts/src/methods/package";
import { PackageSubmissionStatus } from "@thunderstore/dapper/types";

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
  const dapper = new DapperTs(() => {
    return {
      apiHost: process.env.PUBLIC_API_URL,
      sessionId: undefined,
    };
  });
  return await dapper.getCommunities();
}

export async function clientLoader() {
  const dapper = window.Dapper;
  return await dapper.getCommunities();
}

export default function Upload() {
  const uploadData = useLoaderData<typeof loader | typeof clientLoader>();

  const communityOptions: CommunityOption[] = [];
  const [categoryOptions, setCategoryOptions] = useState<
    { communityId: string; categories: CategoryOption[] }[]
  >([]);
  const [availableTeams, setAvailableTeams] = useState<
    {
      name: string;
      role: string;
      member_count: number;
    }[]
  >([]);

  for (const community of uploadData.results) {
    communityOptions.push({
      value: community.identifier,
      label: community.name,
    });
  }

  // const outletContext = useOutletContext() as OutletContextShape;
  const session = useSession();

  // Teams do not have a separate identifier, the team name is the identifier
  useEffect(() => {
    setAvailableTeams(session.getSessionCurrentUser()?.teams ?? []);
  }, [session]);

  const [NSFW, setNSFW] = useState<boolean>(false);
  const [team, setTeam] = useState<string>();
  const [selectedCommunities, setSelectedCommunities] = useState<
    NewSelectOption[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: string[];
  }>({});

  const handleCategoryChange = useCallback(
    (val: NewSelectOption[] | undefined, communityId: string) => {
      setSelectedCategories((prev) => {
        const newCategories = { ...prev };
        if (val) {
          newCategories[communityId] = val.map((v) => v.value);
        } else {
          delete newCategories[communityId];
        }
        return newCategories;
      });
    },
    []
  );

  const [file, setFile] = useState<File | null>(null);
  const [handle, setHandle] = useState<IBaseUploadHandle>();
  const [lock, setLock] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const error = useUploadError(handle);
  const controls = useUploadControls(handle);

  const [usermedia, setUsermedia] = useState<UserMedia>();

  const [submissionStatus, setSubmissionStatus] =
    useState<PackageSubmissionStatus>();
  const [submissionError, setSubmissionError] =
    useState<PackageSubmissionResponse>({});

  const startUpload = useCallback(async () => {
    // console.log("Starting upload");
    if (!file) return;

    try {
      const config = session.getConfig();
      if (!config.apiHost) {
        throw new Error("API host is not configured");
      }
      const upload = new MultipartUpload({
        file,
        api: {
          domain: config.apiHost,
          authorization: config.sessionId
            ? `Session ${config.sessionId}`
            : undefined,
        },
      });

      setLock(true);
      setHandle(upload);
      await upload.start();
      setUsermedia(upload.uploadHandle);
      setIsDone(true);
    } catch (error) {
      console.error("Upload failed:", error);
      if (error instanceof Error) {
        alert(`Upload failed: ${error.message}`);
      }
      setHandle(undefined);
    } finally {
      setLock(false);
    }
  }, [file, session]);

  const submit = useCallback(async () => {
    // console.log("Submitting package");
    if (!usermedia?.uuid) {
      setSubmissionError({
        __all__: ["Upload not completed"],
      });
      return;
    }

    setSubmissionError({});
    const config = session.getConfig();
    const dapper = new DapperTs(() => config);
    const result = await dapper.postPackageSubmissionMetadata(
      team ?? "",
      selectedCommunities.map(
        (community) => (community as NewSelectOption).value
      ),
      NSFW,
      usermedia.uuid,
      [],
      selectedCategories
    );

    const sub = packageSubmissionStatusSchema.safeParse(result);
    // console.log("Submission statuaaas:", sub);
    if (sub.success) {
      setSubmissionStatus(sub.data);
      // Start polling immediately when we get a submission status
      // pollSubmission(sub.data.id);
      // console.log("Submission status:", sub.data);
    } else {
      // Check if the submission request had an error
      // console.log("Submission error:", result);
      if (packageSubmissionErrorSchema.safeParse(result).success) {
        setSubmissionError(result);
        return;
      }
    }

    // Handle successful submission
    if ("task_error" in result && result.task_error) {
      setSubmissionError({
        __all__: [`Submission failed: ${result.result}`],
      });
      return;
    }
  }, [usermedia, NSFW, team, selectedCommunities, selectedCategories, session]);

  useEffect(() => {
    if (selectedCommunities) {
      for (const community of selectedCommunities) {
        // Skip if we already have categories for this community
        if (
          categoryOptions.some((opt) => opt.communityId === community.value)
        ) {
          continue;
        }
        window.Dapper.getCommunityFilters(community.value).then((filters) => {
          setCategoryOptions((prev) => [
            ...prev,
            {
              communityId: community.value,
              categories: filters.package_categories.map((cat) => ({
                value: cat.slug,
                label: cat.name,
              })),
            },
          ]);
        });
      }
    }
  }, [selectedCommunities]);

  const pollSubmission = async (submissionId: string) => {
    console.log("Polling submission status");
    // Wait 5 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // console.log("Polling submission status for:", submissionId);
    const result = await window.Dapper.getPackageSubmissionStatus(submissionId);
    // console.log("Result:", result);
    const parsedResult = packageSubmissionStatusSchema.safeParse(result);
    // console.log("Parsed result:", parsedResult);
    if (parsedResult.success) {
      return { success: true, data: parsedResult.data };
    } else {
      return { success: false, data: parsedResult.data };
    }
  };

  // const [errorFetchedChecker, setErrorFetchedChecker] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const [data, setData] = useState(null);

  // const updateState = (jsonData) => {
  //   setIsloading(false);
  //   setData(jsonData);
  // };

  const submissionStatusRef = useRef<PackageSubmissionStatus | undefined>(
    submissionStatus
  );

  useEffect(() => {
    //console.log('EXECUTING');
    if (
      submissionStatus &&
      submissionStatusRef.current !== submissionStatus &&
      submissionStatus.status === "PENDING"
    ) {
      pollSubmission(submissionStatus.id).then(
        (data) => {
          if (data.success) {
            submissionStatusRef.current = data.data;
            setSubmissionStatus(data.data);
          } else {
            if (data.data) {
              setSubmissionError(data.data);
            } else {
              setSubmissionError({
                __all__: ["Unable to check submission status"],
              });
            }
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_error) => {
          setSubmissionError({
            __all__: ["Unable to check submission status"],
          });
          // setErrorFetchedChecker((c) => !c);
          //console.log('LOG__FROM_CountriesTable: Executed');
        }
      );
    }
  }, [submissionStatus]);

  // useEffect(() => {
  //   const pollSubmissionStatus = () => {
  //     while (isPolling && submissionStatus?.status === "PENDING") {
  //       try {
  //         (async () => {
  //           await pollSubmission(submissionStatus.id);
  //         })();
  //         setPollingRetriesLeft(3);
  //         setPollingError(false);
  //         // Stop polling if status is no longer PENDING
  //         if (submissionStatus?.status !== "PENDING") {
  //           setIsPolling(false);
  //           break;
  //         }
  //       } catch {
  //         setPollingRetriesLeft(pollingRetriesLeft - 1);
  //         if (pollingRetriesLeft < 0) {
  //           setPollingError(true);
  //           setIsPolling(false);
  //           break;
  //         }
  //       }
  //     }
  //   };

  //   if (submissionStatus?.status === "PENDING") {
  //     console.log("Submission status:", submissionStatus?.status);
  //     setIsPolling(true);
  //     pollSubmissionStatus();
  //   }

  //   // Cleanup function to stop polling when component unmounts or status changes
  //   return () => {
  //     setIsPolling(false);
  //   };
  // }, [submissionStatus]);

  const retryPolling = () => {
    if (submissionStatus?.id) {
      pollSubmission(submissionStatus.id).then(
        (data) => {
          if (data.success) {
            setSubmissionStatus(data.data);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_error) => {
          setSubmissionError({
            __all__: ["Unable to check submission status"],
          });
        }
      );
    }
  };

  // Helper function to format field names for display
  const formatFieldName = (field: string) => {
    return field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // console.log(submissionError);

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <span>
          <span>Upload</span>
        </span>
      </NewBreadCrumbs>
      <PageHeader headingLevel="1" headingSize="2">
        Upload package
      </PageHeader>
      <section className="container container--y container--full upload">
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Upload file</p>
            <p className="upload__description">
              Upload your package as a ZIP file.
            </p>
          </div>
          <div className="upload__content">
            <DnDFileInput
              rootClasses="drag-n-drop"
              name="file"
              baseState={
                <div className="drag-n-drop__body">
                  <NewIcon
                    wrapperClasses="drag-n-drop__icon"
                    csVariant="accent"
                  >
                    <FontAwesomeIcon icon={faFileZip} />
                  </NewIcon>
                  {file ? (
                    <span>{file.name}</span>
                  ) : (
                    <>
                      <span className="drag-n-drop__main-text">
                        Drag and drop your ZIP file here
                      </span>
                      <span className="drag-n-drop__sub-text">or browse</span>
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
            />
          </div>
        </div>
        <div className="upload__divider" />
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Team</p>
            <p className="upload__description">
              Select the team you want your package to be associated with.
            </p>
          </div>
          <div className="upload__content">
            <NewSelectSearch
              options={availableTeams?.map((team) => ({
                value: team.name,
                label: team.name,
              }))}
              onChange={(val) => setTeam(val?.value)}
              value={team ? { value: team, label: team } : undefined}
            />
          </div>
        </div>
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Communities</p>
            <p className="upload__description">
              Select communities you want your package to be listed under.
              Current community is selected by default.
            </p>
          </div>
          <div className="upload__content">
            <NewSelectSearch
              placeholder="Select communities"
              multiple
              options={communityOptions}
              onChange={(val) => {
                if (val) {
                  const newCommunities = Array.isArray(val) ? val : [val];
                  setSelectedCommunities(newCommunities);
                  // Remove categories for communities that are no longer selected
                  setSelectedCategories((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).filter(([communityId]) =>
                        newCommunities.some((c) => c.value === communityId)
                      )
                    )
                  );
                } else {
                  setSelectedCommunities([]);
                  setSelectedCategories({});
                }
              }}
              value={selectedCommunities}
            />
          </div>
        </div>
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Categories</p>
            <p className="upload__description">
              Select descriptive categories to help people discover your
              package.
            </p>
          </div>
          <div className="upload__content">
            {selectedCommunities.map((community) => {
              const communityData = uploadData.results.find(
                (c) => c.identifier === community.value
              );
              const categories =
                categoryOptions.find((c) => c.communityId === community.value)
                  ?.categories || [];

              return (
                <div key={community.value} className="upload__category-select">
                  <p className="upload__category-label">
                    {communityData?.name} categories
                  </p>
                  <NewSelectSearch
                    placeholder="Select categories"
                    multiple
                    options={categories}
                    onChange={(val) => {
                      handleCategoryChange(
                        val ? (Array.isArray(val) ? val : [val]) : undefined,
                        community.value
                      );
                    }}
                    value={selectedCategories[community.value]?.map(
                      (categoryId) => ({
                        value: categoryId,
                        label:
                          categories.find((c) => c.value === categoryId)
                            ?.label || "",
                      })
                    )}
                  />
                </div>
              );
            })}
            {(!selectedCommunities || selectedCommunities.length === 0) && (
              <p className="upload__category-placeholder">
                Select a community to choose categories
              </p>
            )}
          </div>
        </div>
        <div className="upload__divider" />
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Contains NSFW content</p>
            <p className="upload__description">
              Select if your package contains NSFW material. An
              &ldquo;NSFW&rdquo; -tag will be applied to your package.
            </p>
          </div>
          <div className="upload__content">
            <NewSwitch
              value={NSFW}
              onChange={(checked) => {
                setNSFW(checked);
              }}
            />
          </div>
        </div>
        <div className="upload__divider" />
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
                  setHandle(undefined);
                  setUsermedia(undefined);
                  setIsDone(false);
                  setSelectedCommunities([]);
                  setSelectedCategories({});
                  setTeam(undefined);
                  setNSFW(false);
                  setSubmissionStatus(undefined);
                }}
                csVariant="secondary"
                csSize="big"
              >
                Reset
              </NewButton>
              {isDone ? (
                <NewButton
                  disabled={!usermedia?.uuid || !selectedCommunities.length}
                  onClick={submit}
                  csVariant="accent"
                  csSize="big"
                  rootClasses="upload__submit"
                >
                  Submit Package
                </NewButton>
              ) : (
                <NewButton
                  disabled={!file || !!handle || lock}
                  onClick={startUpload}
                  csVariant="accent"
                  csSize="big"
                  rootClasses="upload__submit"
                >
                  Upload File
                </NewButton>
              )}
            </div>
            <UploadProgressDisplay handle={handle} />
            {submissionStatus && (
              <div className="upload__status">
                <p>Submission Status: {submissionStatus.status}</p>
                {submissionStatus.form_errors &&
                  Object.keys(submissionStatus.form_errors).length > 0 && (
                    <div className="upload__error">
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
                  <div className="container container--y container--full island">
                    <PageHeader
                      headingLevel="1"
                      headingSize="3"
                      image={submissionStatus.result.package_version.icon}
                      description={
                        submissionStatus.result.package_version.description
                      }
                      variant="detailed"
                      meta={
                        <>
                          <span>
                            <NewIcon csMode="inline" noWrapper>
                              <FontAwesomeIcon icon={faUsers} />
                            </NewIcon>
                            By{" "}
                            {submissionStatus.result.package_version.namespace}
                          </span>
                          {submissionStatus.result.package_version
                            .website_url ? (
                            <NewLink
                              primitiveType="link"
                              href={
                                submissionStatus.result.package_version
                                  .website_url
                              }
                              csVariant="cyber"
                              rootClasses="page-header__meta-item"
                            >
                              {
                                submissionStatus.result.package_version
                                  .website_url
                              }
                              <NewIcon csMode="inline" noWrapper>
                                <FontAwesomeIcon icon={faArrowUpRight} />
                              </NewIcon>
                            </NewLink>
                          ) : null}
                        </>
                      }
                    >
                      {submissionStatus.result.package_version.name}
                    </PageHeader>

                    <NewTable
                      titleRowContent={
                        <>
                          <Heading csLevel="3" csSize="3">
                            Success!
                          </Heading>
                          <p>
                            The package is listed in{" "}
                            {
                              submissionStatus.result.available_communities
                                .length
                            }{" "}
                            {submissionStatus.result.available_communities
                              .length !== 1
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
                      rows={submissionStatus.result.available_communities.map(
                        (v) => [
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
                            sortValue: v.categories
                              .map((c) => c.name)
                              .join(", "),
                          },
                        ]
                      )}
                      sortDirection={NewTableSort.ASC}
                      csModifiers={["alignLastColumnRight"]}
                    />
                  </div>
                )}
                <NewButton onClick={retryPolling}>Retry Status Check</NewButton>
              </div>
            )}
            {error && (
              <div className="upload__error">
                <p>{error.message}</p>
                {error.retryable && (
                  <NewButton onClick={controls.retry}>Retry</NewButton>
                )}
              </div>
            )}
            {isDone && !usermedia?.uuid && (
              <div className="upload__error">
                <p>
                  Upload completed but no UUID was received. Please try again.
                </p>
              </div>
            )}
            {isDone && usermedia?.uuid && !selectedCommunities.length && (
              <div className="upload__error">
                <p>Please select at least one community.</p>
              </div>
            )}
            {Object.keys(submissionError).length > 0 && (
              <div className="upload__error">
                {Object.entries(submissionError).map(([field, errors]) => (
                  <div key={field}>
                    {field !== "__all__" && (
                      <strong>{formatFieldName(field)}: </strong>
                    )}
                    {Array.isArray(errors) ? errors.join(", ") : String(errors)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <div className="upload-form">
          <NewButton
            disabled={!file || !!handle || lock}
            onClick={startUpload}
            csVariant="special"
            csSize="big"
          >
            Start upload
          </NewButton>
          <UploadProgressDisplay handle={handle} />
          <p>Upload success: {isDone.toString()}</p>
        </div> */}
      </section>
      <span>usermedia: {usermedia?.uuid}</span>
      <span>NSFW: {NSFW.toString()}</span>
      <span>team: {team}</span>
      <span>
        selectedCommunities: {selectedCommunities.map((c) => c.value)}
      </span>
      <span>
        selectedCategories:{" "}
        {Object.entries(selectedCategories)
          .map(
            ([communityId, categoryIds]) =>
              `${communityId}: ${categoryIds.join(", ")}`
          )
          .join(" | ")}
      </span>
    </div>
  );
}

const UploadProgressDisplay = (props: { handle?: IBaseUploadHandle }) => {
  const progress = useUploadProgress(props.handle);
  const status = useUploadStatus(props.handle);
  const error = useUploadError(props.handle);
  const controls = useUploadControls(props.handle);

  if (!progress) return <p>Upload not started</p>;

  const percent = Math.round((progress.complete / progress.total) * 100);
  const speed = Math.round(progress.metrics.bytesPerSecond / 1024 / 1024); // MB/s

  return (
    <div className="upload__progress">
      <div className="upload__progress-bar">
        <div
          className="upload__progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="upload__progress-info">
        <span>{percent}%</span>
        <span>{speed} MB/s</span>
        <span>{status}</span>
      </div>
      {error && (
        <div className="upload__error">
          <p>{error.message}</p>
          {error.retryable && (
            <NewButton onClick={controls.retry}>Retry</NewButton>
          )}
        </div>
      )}
      {status === "running" && (
        <NewButton onClick={controls.pause}>Pause</NewButton>
      )}
      {status === "paused" && (
        <NewButton onClick={controls.resume}>Resume</NewButton>
      )}
      {(status === "running" || status === "paused") && (
        <NewButton onClick={controls.abort}>Cancel</NewButton>
      )}
    </div>
  );
};
