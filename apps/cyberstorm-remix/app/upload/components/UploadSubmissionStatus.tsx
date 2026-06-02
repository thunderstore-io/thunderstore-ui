import { NewAlert, NewButton } from "@thunderstore/cyberstorm";
import type { PackageSubmissionStatus } from "@thunderstore/dapper/types";

import { FormSectionSeparator } from "../../commonComponents/FormSection/FormSection";
import { SectionErrors } from "./SectionErrors";
import { SubmissionProcessingSkeleton } from "./SubmissionProcessingSkeleton";
import { SubmissionResult } from "./SubmissionResult";

export interface UploadSubmissionStatusProps {
  submitting: boolean;
  submissionStatus?: PackageSubmissionStatus;
  pollingError: string | null;
  submitSectionErrors: string[];
  onRetryPolling: () => void;
}

export function UploadSubmissionStatus({
  submitting,
  submissionStatus,
  pollingError,
  submitSectionErrors,
  onRetryPolling,
}: UploadSubmissionStatusProps) {
  const showProcessing =
    submitting ||
    (submissionStatus?.status === "PENDING" && !submissionStatus.result);

  return (
    <>
      <FormSectionSeparator />
      <div className="submission__status">
        <SectionErrors errors={submitSectionErrors} />
        {submissionStatus?.result ? (
          <SubmissionResult submissionStatusResult={submissionStatus.result} />
        ) : null}
        {showProcessing ? <SubmissionProcessingSkeleton /> : null}
        {!showProcessing && pollingError != null ? (
          <NewButton onClick={onRetryPolling}>Retry Status Check</NewButton>
        ) : null}
        {!showProcessing && pollingError ? (
          <NewAlert csVariant="danger" rootClasses="upload__alert">
            {pollingError}
          </NewAlert>
        ) : null}
      </div>
    </>
  );
}
