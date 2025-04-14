import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import { PackageSubmissionRequestParams } from "../schemas/requestSchemas";
import {
  PackageSubmissionStatusResponseData,
  packageSubmissionStatusResponseDataSchema,
} from "../schemas/responseSchemas";

export type packageSubmissionPollMetaArgs = {
  useSession: boolean;
  submissionId: string;
};

export function fetchPackageSubmissionStatus(
  config: () => RequestConfig,
  params: PackageSubmissionRequestParams
): Promise<PackageSubmissionStatusResponseData> {
  const request = { cache: "no-store" as RequestCache };
  const path = `/api/experimental/submission/poll-async/${params.submission_id}`;

  return apiFetch({
    args: {
      config: config,
      path: path,
      useSession: params.useSession,
      request: request,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: packageSubmissionStatusResponseDataSchema,
  });
}
