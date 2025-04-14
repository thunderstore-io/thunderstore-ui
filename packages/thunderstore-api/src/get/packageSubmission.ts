import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type packageSubmissionPollMetaArgs = {
  useSession: boolean;
  submissionId: string;
};

export function fetchPackageSubmissionStatus(
  config: () => RequestConfig,
  meta: packageSubmissionPollMetaArgs
) {
  const path = `/api/experimental/submission/poll-async/${meta.submissionId}`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "GET",
      cache: "no-store",
    },
    useSession: meta.useSession,
  });
}
