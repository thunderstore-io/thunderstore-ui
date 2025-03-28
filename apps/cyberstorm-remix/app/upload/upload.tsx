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
import { initMultipartUpload, IUploadHandle } from "@thunderstore/ts-uploader";
import { useUploadProgress } from "@thunderstore/ts-uploader-react";
// import { useOutletContext } from "@remix-run/react";
// import { OutletContextShape } from "../../root";
import { useSession } from "@thunderstore/ts-api-react";
import { faFileZip, faTreasureChest } from "@fortawesome/pro-solid-svg-icons";
import { UserMedia } from "@thunderstore/ts-uploader/src/client/types";
import { DapperTs } from "@thunderstore/dapper-ts";
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
  const [handle, setHandle] = useState<IUploadHandle>();
  const [lock, setLock] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const [usermedia, setUsermedia] = useState<UserMedia>();

  const startUpload = useCallback(() => {
    if (!file) return;
    const config = session.getConfig();
    setLock(true);
    initMultipartUpload(file, {
      api: {
        domain: config.apiHost ?? "https://thunderstore.io",
        authorization: `Session ${config.sessionId}`,
      },
    }).then((handle) => {
      setHandle(handle);
      handle.startUpload().then(
        (value) => {
          setUsermedia(value);
          setIsDone(true);
        },
        (reason) => {
          console.log(reason);
        }
      );
    });
  }, [file, session]);

  const submit = useCallback(() => {
    const config = session.getConfig();
    const dapper = new DapperTs(() => config);
    dapper.postPackageSubmissionMetadata(
      team ?? "",
      selectedCategories.map((cat) => cat.categoryId),
      selectedCommunities.map(
        (community) => (community as NewSelectOption).value
      ),
      NSFW,
      usermedia?.uuid ?? "",
      [] // TODO: wth are community categories??
    );
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
                { value: "team1", label: "Team 1" },
                { value: "team2", label: "Team 2" },
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
                // onClick={startUpload}
                csVariant="secondary"
                csSize="big"
              >
                Reset
              </NewButton>
              {isDone ? (
                <NewButton
                  // disabled={!file || !!handle || lock}
                  onClick={submit}
                  csVariant="accent"
                  csSize="big"
                  rootClasses="upload__submit"
                >
                  Submit
                </NewButton>
              ) : (
                <NewButton
                  disabled={!file || !!handle || lock}
                  onClick={startUpload}
                  csVariant="accent"
                  csSize="big"
                  rootClasses="upload__submit"
                >
                  Start upload
                </NewButton>
              )}
            </div>
            <UploadProgressDisplay handle={handle} />
            <p>Upload success: {isDone.toString()}</p>
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

const UploadProgressDisplay = (props: { handle?: IUploadHandle }) => {
  const progress = useUploadProgress(props.handle);
  if (!progress) return <p>Upload not started</p>;
  return (
    <p>
      Progress: {progress.complete} / {progress.total}
    </p>
  );
};
