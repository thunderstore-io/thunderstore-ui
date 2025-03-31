import "./Upload.css";
import {
  NewBreadCrumbs,
  NewButton,
  NewIcon,
  // Select,
  NewSelectSearch,
  Switch,
  NewSelectOption,
} from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageHeader } from "../commonComponents/PageHeader/PageHeader";
import { DnDFileInput } from "@thunderstore/react-dnd";
import { useCallback, useEffect, useState } from "react";
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
import { faFileZip, faTreasureChest } from "@fortawesome/pro-solid-svg-icons";
import { UserMedia } from "@thunderstore/ts-uploader/src/client/types";
import { DapperTs, PackageSubmissionResponse } from "@thunderstore/dapper-ts";
import { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

  for (const community of uploadData.results) {
    communityOptions.push({
      value: community.identifier,
      label: community.name,
    });
  }

  // const outletContext = useOutletContext() as OutletContextShape;
  const session = useSession();

  const [NSFW, setNSFW] = useState<boolean>(false);
  const [team, setTeam] = useState<string>();
  const [selectedCommunities, setSelectedCommunities] = useState<
    NewSelectOption[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<
    { communityId: string; categoryId: string }[]
  >([]);

  const handleCategoryChange = useCallback(
    (
      val: NewSelectOption[] | undefined,
      categories: CategoryOption[],
      communityId: string
    ) => {
      setSelectedCategories((prev) => {
        const filtered = prev.filter((cat) => cat.communityId !== communityId);
        if (val) {
          return [
            ...filtered,
            ...val.map((v) => ({ communityId, categoryId: v.value })),
          ];
        }
        return filtered;
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

  const [submissionError, setSubmissionError] =
    useState<PackageSubmissionResponse>({});

  const startUpload = useCallback(async () => {
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
      await upload.start();
      setHandle(upload);
      setUsermedia(upload.uploadHandle);
      setIsDone(true);
    } catch (error) {
      console.error("Upload failed:", error);
      if (error instanceof Error) {
        alert(`Upload failed: ${error.message}`);
      }
    } finally {
      setLock(false);
    }
  }, [file, session]);

  const submit = useCallback(async () => {
    if (!usermedia?.uuid) {
      setSubmissionError({
        __all__: ["Upload not completed"],
      });
      return;
    }

    try {
      setSubmissionError({});
      const config = session.getConfig();
      if (!config.apiHost) {
        throw new Error("API host is not configured");
      }
      const dapper = new DapperTs(() => config);
      const result = await dapper.postPackageSubmissionMetadata(
        team ?? "",
        selectedCommunities.map(
          (community) => (community as NewSelectOption).value
        ),
        NSFW,
        usermedia.uuid,
        selectedCategories.map((cat) => cat.categoryId),
        {}
      );

      // Check if the result is a SubmissionError
      if (
        "__all__" in result ||
        "author_name" in result ||
        "communities" in result
      ) {
        setSubmissionError(result);
        return;
      }

      // Handle successful submission
      if ("task_error" in result && result.task_error) {
        setSubmissionError({
          __all__: [`Submission failed: ${result.result}`],
        });
        return;
      }

      alert("Package submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      if (error instanceof Error) {
        setSubmissionError({
          __all__: [error.message],
        });
      } else {
        setSubmissionError({
          __all__: ["An unexpected error occurred during submission"],
        });
      }
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
                value: cat.id,
                label: cat.name,
              })),
            },
          ]);
        });
      }
    }
  }, [selectedCommunities]);

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
              options={[
                { value: "Test_Team_0", label: "Test_Team_0" },
                { value: "Test_Team_1", label: "Test_Team_1" },
                { value: "Test_Team_2", label: "Test_Team_2" },
                { value: "Test_Team_3", label: "Test_Team_3" },
                { value: "Test_Team_4", label: "Test_Team_4" },
                { value: "Test_Team_5", label: "Test_Team_5" },
                { value: "Test_Team_6", label: "Test_Team_6" },
                { value: "Test_Team_7", label: "Test_Team_7" },
                { value: "Test_Team_8", label: "Test_Team_8" },
                { value: "Test_Team_9", label: "Test_Team_9" },
                { value: "Test_Team_10", label: "Test_Team_10" },
              ]}
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
                    prev.filter((cat) =>
                      newCommunities.some((c) => c.value === cat.communityId)
                    )
                  );
                } else {
                  setSelectedCommunities([]);
                  setSelectedCategories([]);
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
                        categories,
                        community.value
                      );
                    }}
                    value={selectedCategories
                      .filter((cat) => cat.communityId === community.value)
                      .map((cat) => ({
                        value: cat.categoryId,
                        label:
                          categories.find((c) => c.value === cat.categoryId)
                            ?.label || "",
                      }))}
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
            <Switch
              value={NSFW}
              onChange={() => {
                setNSFW(!NSFW);
              }}
            ></Switch>
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
                  setSelectedCategories([]);
                  setTeam(undefined);
                  setNSFW(false);
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
      <span>NSFW: {NSFW}</span>
      <span>team: {team}</span>
      <span>
        selectedCommunities: {selectedCommunities.map((c) => c.value)}
      </span>
      <span>
        selectedCategories:{" "}
        {selectedCategories.map((c) => `${c.communityId}-${c.categoryId} `)}
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
