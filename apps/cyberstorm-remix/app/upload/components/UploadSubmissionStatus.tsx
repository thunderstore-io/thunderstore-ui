import { NewAlert, NewButton } from "@thunderstore/cyberstorm";
import type { PackageSubmissionStatus } from "@thunderstore/dapper/types";

import { FormSectionSeparator } from "../../commonComponents/FormSection/FormSection";
import { SectionErrors } from "./SectionErrors";
import { SubmissionResult } from "./SubmissionResult";

export interface UploadSubmissionStatusProps {
  submissionStatus: PackageSubmissionStatus;
  pollingError: string | null;
  submitSectionErrors: string[];
  onRetryPolling: () => void;
}

export function UploadSubmissionStatus({
  submissionStatus,
  pollingError,
  submitSectionErrors,
  onRetryPolling,
}: UploadSubmissionStatusProps) {
  return (
    <>
      <FormSectionSeparator />
      <div className="submission__status">
        <SectionErrors errors={submitSectionErrors} />
        {submissionStatus.result ? (
          <SubmissionResult submissionStatusResult={submissionStatus.result} />
        ) : null}
        {pollingError != null ? (
          <NewButton onClick={onRetryPolling}>Retry Status Check</NewButton>
        ) : null}
        {pollingError ? (
          <NewAlert csVariant="danger" rootClasses="upload__alert">
            {pollingError}
          </NewAlert>
        ) : null}
      </div>
    </>
  );
}
