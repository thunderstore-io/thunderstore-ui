import { IUploadHandle, UploadProgress } from "@thunderstore/ts-uploader";
import { useEffect, useState } from "react";

export const useUploadProgress = (
  handle?: IUploadHandle
): UploadProgress | undefined => {
  const [progress, setProgress] = useState<UploadProgress>();
  useEffect(() => {
    if (!handle) {
      setProgress(undefined);
      return () => {};
    } else {
      setProgress(handle.progress);
      return handle.onProgress.addListener(setProgress);
    }
  }, [handle]);

  return progress;
};
