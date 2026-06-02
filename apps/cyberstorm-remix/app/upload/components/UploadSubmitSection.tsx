import { NewAlert, NewButton } from "@thunderstore/cyberstorm";
import type { PackageSubmissionStatus } from "@thunderstore/dapper/types";

import { FormSection } from "../../commonComponents/FormSection/FormSection";
import { isUploadResetDisabled } from "../uploadUtils";
import { UploadProgressBar } from "./UploadProgressBar";

export interface UploadSubmitSectionProps {
  submitError: string | null;
  strongFormSubmitting: boolean;
  submissionStatus?: PackageSubmissionStatus;
  hasSubmissionFormErrors: boolean;
  submitDisabled: boolean;
  isUploading: boolean;
  uploadProgressPercent: number;
  onReset: () => void;
  onSubmit: () => void;
}

export function UploadSubmitSection({
  submitError,
  strongFormSubmitting,
  submissionStatus,
  hasSubmissionFormErrors,
  submitDisabled,
  isUploading,
  uploadProgressPercent,
  onReset,
  onSubmit,
}: UploadSubmitSectionProps) {
  const resetDisabled = isUploadResetDisabled({
    submitting: strongFormSubmitting,
    submissionPending: submissionStatus?.status === "PENDING",
  });
  const displayUploadProgressPercent = Math.min(
    100,
    Math.max(0, Math.trunc(uploadProgressPercent))
  );

  return (
    <FormSection
      title="Submit"
      description='Double-check your selections and hit "Submit" when you&apos;re ready!'
    >
      {submitError ? (
        <NewAlert csVariant="danger" rootClasses="upload__alert">
          {submitError}
        </NewAlert>
      ) : null}
      {!strongFormSubmitting &&
      submissionStatus?.status !== "PENDING" &&
      hasSubmissionFormErrors ? (
        <NewAlert csVariant="danger" rootClasses="upload__alert">
          Please review the form errors above and submit again.
        </NewAlert>
      ) : null}
      <div className="upload__buttons">
        <NewButton
          onClick={onReset}
          disabled={resetDisabled}
          csVariant="secondary"
          csSize="big"
        >
          Reset
        </NewButton>
        <NewButton
          disabled={submitDisabled}
          onClick={onSubmit}
          csVariant="accent"
          csSize="big"
          rootClasses="upload__submit"
        >
          {strongFormSubmitting
            ? "Submitting…"
            : submissionStatus?.status === "PENDING"
              ? "Processing…"
              : "Submit"}
        </NewButton>
      </div>
      {isUploading ? (
        <div className="upload__upload-indicator">
          <UploadProgressBar
            progress={displayUploadProgressPercent}
            labelId="upload-progress-label"
          />
          <p
            id="upload-progress-label"
            className="upload__upload-indicator-label"
          >
            Uploading… {displayUploadProgressPercent}%
          </p>
        </div>
      ) : null}
    </FormSection>
  );
}
