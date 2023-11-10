import { StoryFn, Meta } from "@storybook/react";
import { DnDFileInput } from "@thunderstore/react-dnd";
import { FC, useCallback, useState } from "react";
import styles from "./FileUpload.module.css";
import { initMultipartUpload, IUploadHandle } from "@thunderstore/ts-uploader";
import { useUploadProgress } from "@thunderstore/ts-uploader-react";

const UploadProgressDisplay = (props: { handle?: IUploadHandle }) => {
  const progress = useUploadProgress(props.handle);
  if (!progress) return <p>Upload not started</p>;
  return (
    <p>
      Progress: {progress.complete} / {progress.total}
    </p>
  );
};

const FileUpload: FC<{ apiHost: string; apiAuth: string }> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [handle, setHandle] = useState<IUploadHandle>();
  const [lock, setLock] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const startUpload = useCallback(() => {
    if (!file) return;
    setLock(true);
    initMultipartUpload(file, {
      api: {
        domain: props.apiHost,
        authorization: props.apiAuth,
      },
    }).then((handle) => {
      setHandle(handle);
      handle.startUpload().then(() => setIsDone(true));
    });
  }, [file, props.apiHost, props.apiAuth]);

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <DnDFileInput
          name={"file"}
          baseState={{
            title: file ? file.name : "Choose or drag file here",
            className: styles.inputBase,
          }}
          dragState={{
            title: "Drag file here",
            className: styles.inputDrag,
          }}
          onChange={(files) => {
            setFile(files.item(0));
          }}
          readonly={!!handle}
        />
        <button
          className={styles.button}
          disabled={!file || !!handle || lock}
          onClick={startUpload}
        >
          Start upload
        </button>
        <UploadProgressDisplay handle={handle} />
        <p>Upload success: {isDone.toString()}</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof FileUpload> = {
  title: "File Upload",
  component: FileUpload,
  args: {
    apiHost: "http://thunderstore.localhost",
    apiAuth: "Bearer {YOUR_SA_TOKEN}",
  },
  argTypes: {
    apiHost: {
      control: "text",
      description: "API host",
    },
    apiAuth: {
      control: "text",
      description: "API request authorization header",
    },
  },
};

const FileUploadStory: StoryFn<typeof FileUpload> = (args) => {
  return <FileUpload {...args} />;
};

export { meta as default, FileUpload };
