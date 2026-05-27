import { NewAlert, NewButton } from "@thunderstore/cyberstorm";
import type { PackageSubmissionStatus } from "@thunderstore/dapper/types";

import { FormSectionSeparator } from "../../commonComponents/FormSection/FormSection";
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
        {submitSectionErrors.length > 0 ? (
          <NewAlert csVariant="danger" rootClasses="upload__alert">
            <ul>
              {submitSectionErrors.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </NewAlert>
        ) : null}
        {submissionStatus.result ? (
          <SubmissionResult submissionStatusResult={submissionStatus.result} />
        ) : null}
        <NewButton onClick={onRetryPolling}>Retry Status Check</NewButton>
        {pollingError ? (
          <NewAlert csVariant="danger" rootClasses="upload__alert">
            {pollingError}
          </NewAlert>
        ) : null}
      </div>
    </>
  );
}
