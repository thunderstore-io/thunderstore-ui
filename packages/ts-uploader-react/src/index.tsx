import { useEffect, useState } from "react";

import {
  IBaseUploadHandle,
  UploadError,
  UploadProgress,
  UploadStatus,
} from "@thunderstore/ts-uploader";

export const useUploadProgress = (
  handle?: IBaseUploadHandle
): UploadProgress | undefined => {
  const [progress, setProgress] = useState<UploadProgress>();
  useEffect(() => {
    if (!handle) {
      setProgress(undefined);
      return () => {};
    } else {
      setProgress(handle.progress);
      return handle.onProgress.addListener((progress) => {
        setProgress(progress);
      });
    }
  }, [handle]);

  return progress;
};

export const useUploadStatus = (
  handle?: IBaseUploadHandle
): UploadStatus | undefined => {
  const [status, setStatus] = useState<UploadStatus>();
  useEffect(() => {
    if (!handle) {
      setStatus(undefined);
      return () => {};
    } else {
      setStatus(handle.progress.status);
      return handle.onStatusChange.addListener((status) => {
        setStatus(status);
      });
    }
  }, [handle]);

  return status;
};

export const useUploadError = (
  handle?: IBaseUploadHandle
): UploadError | undefined => {
  const [error, setError] = useState<UploadError>();
  useEffect(() => {
    if (!handle) {
      setError(undefined);
      return () => {};
    } else {
      setError(handle.progress.error);
      return handle.onError.addListener((error) => {
        setError(error);
      });
    }
  }, [handle]);

  return error;
};

export const useUploadControls = (
  handle?: IBaseUploadHandle
): {
  start: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  abort: () => Promise<void>;
  retry: () => Promise<void>;
} => {
  if (!handle) {
    return {
      start: async () => {},
      pause: async () => {},
      resume: async () => {},
      abort: async () => {},
      retry: async () => {},
    };
  }

  return {
    start: () => handle.start(),
    pause: () => handle.pause(),
    resume: () => handle.resume(),
    abort: () => handle.abort(),
    retry: () => handle.retry(),
  };
};
