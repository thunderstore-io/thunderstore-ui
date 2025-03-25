import "./Upload.css";
import {
  NewBreadCrumbs,
  NewButton,
  NewIcon,
  NewSelect,
  // Select,
  // SelectSearch,
  Switch,
} from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageHeader } from "../commonComponents/PageHeader/PageHeader";
import { DnDFileInput } from "@thunderstore/react-dnd";
import { useCallback, useState } from "react";
import { initMultipartUpload, IUploadHandle } from "@thunderstore/ts-uploader";
import { useUploadProgress } from "@thunderstore/ts-uploader-react";
// import { useOutletContext } from "@remix-run/react";
// import { OutletContextShape } from "../../root";
import { useSession } from "@thunderstore/ts-api-react";
import { faFileZip, faTreasureChest } from "@fortawesome/pro-solid-svg-icons";
import { UserMedia } from "@thunderstore/ts-uploader/src/client/types";
import { DapperTs } from "@thunderstore/dapper-ts";

export default function MarkdownPreview() {
  // const outletContext = useOutletContext() as OutletContextShape;
  const session = useSession();

  const [NSFW, setNSFW] = useState<boolean>(false);
  const [team, setTeam] = useState<string>();
  const [communities, setCommunities] = useState<string[]>();
  const [categories, setCategories] = useState<string[]>();

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
    // const currentUser = session.getSessionCurrentUser();
    const dapper = new DapperTs(() => config);
    dapper.postPackageSubmissionMetadata(
      team ?? "",
      categories ? categories : [""],
      communities ? communities : [""],
      NSFW,
      usermedia?.uuid ?? "",
      [] // TODO: wth are community categories??
    );
  }, [usermedia, NSFW, team, communities, categories, session]);

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
              name={"file"}
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
                    <>
                      <span className="drag-n-drop__main-text">
                        Drag file here
                      </span>
                    </>
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
            {/* <SelectSearch></SelectSearch> */}
            <NewSelect
              options={[
                { value: "team1", label: "Team 1" },
                { value: "team2", label: "Team 2" },
              ]}
              onChange={(val) => setTeam(val)}
              value={team}
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
            {/* <SelectSearch></SelectSearch> */}
            <NewSelect
              options={[
                { value: "community1", label: "Community 1" },
                { value: "community2", label: "Community 2" },
              ]}
              onChange={(val) => setCommunities([val])}
              value={communities?.join(" ")}
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
            <NewSelect
              options={[
                { value: "cat1", label: "Cat 1" },
                { value: "cat2", label: "Cat 2" },
              ]}
              onChange={(val) => setCategories([val])}
              value={categories?.join(" ")}
            />
          </div>
        </div>
        <div className="upload__divider" />
        <div className="container container--x container--full upload__row">
          <div className="upload__meta">
            <p className="upload__title">Contains NSFW content</p>
            <p className="upload__description">
              Select if your package contains NSFW material. An “NSWF” -tag will
              be applied to your package.
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
              Double-check your selections and hit “Submit” when you’re ready!
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
                  Start upload
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
