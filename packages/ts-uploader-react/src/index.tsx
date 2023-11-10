import { IUploadHandle, UploadProgress } from "@thunderstore/ts-uploader";
import { useSyncExternalStore } from "react";

export const useUploadProgress = (
  handle?: IUploadHandle
): UploadProgress | undefined => {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (handle) {
        return handle.onProgress.addListener(() => onStoreChange());
      } else {
        return () => {};
      }
    },
    () => {
      if (handle) {
        return handle.progress;
      } else {
        return undefined;
      }
    }
  );
};
