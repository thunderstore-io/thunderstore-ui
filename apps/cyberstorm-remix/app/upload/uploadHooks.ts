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
import { validatePackageZip } from "./uploadZipValidation";

export function usePackageFileUpload(
  requestConfig: OutletContextShape["requestConfig"]
) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [handle, setHandle] = useState<IBaseUploadHandle>();
  const [isDone, setIsDone] = useState(false);
  const [usermedia, setUsermedia] = useState<UserMedia>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileWarnings, setFileWarnings] = useState<string[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  // Incremented whenever the selected file changes so a slow async validation
  // for a stale file can't overwrite results for the current one.
  const validationTokenRef = useRef(0);

  // Invalidates any in-flight validation and clears the current
  // warnings/errors. Returns the new token so the caller can guard its own
  // async result against staleness.
  const resetFileValidation = useCallback(() => {
    const token = ++validationTokenRef.current;
    setFileWarnings([]);
    setFileErrors([]);
    return token;
  }, []);

  const startUpload = useCallback(async () => {
    if (!file) {
      const message = "Please choose a ZIP file before submitting.";
      setUploadError(message);
      throw new Error(message);
    }

    if (!isPackageZipFile(file)) {
      const message = PACKAGE_ZIP_FILE_ERROR_MESSAGE;
      setUploadError(message);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      throw new Error(message);
    }

    // Re-run ZIP validation at submit time so a blocking archive can't slip
    // through the async gap between selecting a file and its validation result
    // landing — the disabled submit button is otherwise the only guard.
    const validationToken = validationTokenRef.current;
    const validation = await validatePackageZip(file);
    // If the selection changed while validation was in flight (e.g. the user
    // cleared or replaced the file), abort instead of uploading a stale file.
    if (validationTokenRef.current !== validationToken) {
      throw new Error("File selection changed during validation.");
    }
    setFileWarnings(validation.warnings);
    setFileErrors(validation.errors);
    if (validation.errors.length > 0) {
      const message =
        "Please fix the problems with your .zip file before submitting.";
      setUploadError(message);
      throw new Error(message);
    }

    setUploadError(null);
    setIsDone(false);
    setUsermedia(undefined);

    const config = requestConfig();
    if (!config.apiHost) {
      const message = "API host is not configured";
      setUploadError(message);
      throw new Error(message);
    }

    const upload = new MultipartUpload({ file }, requestConfig);

    setHandle(upload);
    try {
      await upload.start();
      setUsermedia(upload.handle);
      setIsDone(true);
      return upload.handle;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setUploadError(message);
      setIsDone(false);
      setUsermedia(undefined);
      setHandle(undefined);
      throw new Error(message);
    } finally {
      setHandle(undefined);
    }
  }, [file, requestConfig]);

  const clearFile = useCallback(() => {
    resetFileValidation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handle?.abort();
    setHandle(undefined);
    setUsermedia(undefined);
    setIsDone(false);
    setUploadError(null);
  }, [handle, resetFileValidation]);

  const selectFile = useCallback(
    (nextFile: File | null) => {
      if (!nextFile) {
        clearFile();
        return;
      }

      if (!isPackageZipFile(nextFile)) {
        resetFileValidation();
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

      // Inspect the archive's contents and surface warnings/blocking errors.
      const token = resetFileValidation();
      validatePackageZip(nextFile)
        .then((result) => {
          if (validationTokenRef.current !== token) return;
          setFileWarnings(result.warnings);
          setFileErrors(result.errors);
        })
        .catch(() => {
          if (validationTokenRef.current !== token) return;
          setFileWarnings([]);
          setFileErrors([]);
        });
    },
    [clearFile, handle, resetFileValidation]
  );

  return {
    file,
    startUpload,
    selectFile,
    fileInputRef,
    handle,
    isDone,
    usermedia,
    uploadError,
    clearFile,
    fileWarnings,
    fileErrors,
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
