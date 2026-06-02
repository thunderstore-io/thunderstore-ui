import { useCallback, useEffect, useRef, useState } from "react";

import { type PackageSubmissionStatus } from "@thunderstore/dapper/types";
import {
  type IBaseUploadHandle,
  MultipartUpload,
  type UserMedia,
} from "@thunderstore/ts-uploader";

import type { OutletContextShape } from "../root";
import {
  type CategoryOption,
  PACKAGE_ZIP_FILE_ERROR_MESSAGE,
  isPackageZipFile,
} from "./uploadUtils";

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

    if (!isPackageZipFile(file)) {
      setUploadError(PACKAGE_ZIP_FILE_ERROR_MESSAGE);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

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

  const selectFile = useCallback(
    (nextFile: File | null) => {
      if (!nextFile) {
        clearFile();
        return;
      }

      if (!isPackageZipFile(nextFile)) {
        setUploadError(PACKAGE_ZIP_FILE_ERROR_MESSAGE);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        handle?.abort();
        setHandle(undefined);
        setUsermedia(undefined);
        setIsDone(false);
        return;
      }

      setUploadError(null);
      setFile(nextFile);
    },
    [clearFile, handle]
  );

  return {
    file,
    selectFile,
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
  const submissionStatusRef = useRef<string | undefined>(submissionStatus?.id);

  useEffect(() => {
    if (
      !submissionStatus ||
      submissionStatusRef.current === submissionStatus.id ||
      submissionStatus.status !== "PENDING"
    ) {
      return;
    }

    let cancelled = false;
    submissionStatusRef.current = submissionStatus.id;
    pollSubmission(dapper, submissionStatus.id)
      .then((data) => {
        if (cancelled) return;

        setPollingError(null);
        submissionStatusRef.current =
          data.status === "PENDING" ? undefined : data.id;
        setSubmissionStatus(data);
      })
      .catch((error) => {
        if (cancelled) return;

        submissionStatusRef.current = undefined;
        setPollingError(
          `Error polling submission status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      });

    return () => {
      cancelled = true;
    };
  }, [dapper, submissionStatus, setSubmissionStatus]);

  const retryPolling = () => {
    if (!submissionStatus?.id) return;

    setPollingError(null);
    submissionStatusRef.current = submissionStatus.id;
    pollSubmission(dapper, submissionStatus.id, true)
      .then((data) => {
        submissionStatusRef.current =
          data.status === "PENDING" ? undefined : data.id;
        setSubmissionStatus(data);
      })
      .catch((error) => {
        submissionStatusRef.current = undefined;
        setPollingError(
          `Error polling submission status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
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
      dapper
        .getCommunityFilters(community)
        .then((filters) => {
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
        })
        .catch((error) => {
          console.error(
            `Failed to load category options for community ${community}`,
            error
          );
        });
    }
  }, [dapper, selectedCommunities]);

  return categoryOptions;
}
