import { useCallback, useEffect, useRef, useState } from "react";

import { type PackageSubmissionStatus } from "@thunderstore/dapper/types";
import {
  type IBaseUploadHandle,
  MultipartUpload,
  type UserMedia,
} from "@thunderstore/ts-uploader";

import type { OutletContextShape } from "../root";
import type { CategoryOption } from "./uploadUtils";

export function usePackageFileUpload(
  requestConfig: OutletContextShape["requestConfig"]
) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [handle, setHandle] = useState<IBaseUploadHandle>();
  const [isDone, setIsDone] = useState(false);
  const [usermedia, setUsermedia] = useState<UserMedia>();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const startUpload = useCallback(async () => {
    if (!file) return;

    setUploadError(null);

    const config = requestConfig();
    if (!config.apiHost) {
      setUploadError("API host is not configured");
      return;
    }

    const upload = new MultipartUpload({ file }, requestConfig);

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
      void startUpload();
    }
  }, [file, startUpload]);

  const clearFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handle?.abort();
    setHandle(undefined);
    setUsermedia(undefined);
    setIsDone(false);
    setUploadError(null);
  }, [handle]);

  return {
    file,
    setFile,
    fileInputRef,
    handle,
    isDone,
    usermedia,
    uploadError,
    clearFile,
  };
}

async function pollSubmission(
  dapper: OutletContextShape["dapper"],
  submissionId: string,
  noSleep?: boolean
): Promise<PackageSubmissionStatus> {
  if (!noSleep) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  return await dapper.getPackageSubmissionStatus(submissionId);
}

export function useSubmissionStatusPolling(
  dapper: OutletContextShape["dapper"],
  submissionStatus: PackageSubmissionStatus | undefined,
  setSubmissionStatus: (status: PackageSubmissionStatus | undefined) => void
) {
  const [pollingError, setPollingError] = useState<string | null>(null);
  const submissionStatusRef = useRef<PackageSubmissionStatus | undefined>(
    submissionStatus
  );

  useEffect(() => {
    if (
      submissionStatus &&
      submissionStatusRef.current !== submissionStatus &&
      submissionStatus.status === "PENDING"
    ) {
      pollSubmission(dapper, submissionStatus.id)
        .then((data) => {
          setPollingError(null);
          submissionStatusRef.current = data;
          setSubmissionStatus(data);
        })
        .catch((error) => {
          setPollingError(
            `Error polling submission status: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        });
    }
  }, [dapper, submissionStatus, setSubmissionStatus]);

  const retryPolling = () => {
    if (!submissionStatus?.id) return;

    setPollingError(null);
    pollSubmission(dapper, submissionStatus.id, true).then((data) => {
      setSubmissionStatus(data);
    });
  };

  return { pollingError, setPollingError, retryPolling };
}

export function useUploadCategoryOptions(
  dapper: OutletContextShape["dapper"],
  selectedCommunities: string[]
) {
  const [categoryOptions, setCategoryOptions] = useState<
    { communityId: string; categories: CategoryOption[] }[]
  >([]);

  useEffect(() => {
    for (const community of selectedCommunities) {
      dapper.getCommunityFilters(community).then((filters) => {
        setCategoryOptions((prev) => {
          if (prev.some((opt) => opt.communityId === community)) {
            return prev;
          }

          return [
            ...prev,
            {
              communityId: community,
              categories: filters.package_categories.map((cat) => ({
                value: cat.slug,
                label: cat.name,
              })),
            },
          ];
        });
      });
    }
  }, [dapper, selectedCommunities]);

  return categoryOptions;
}
