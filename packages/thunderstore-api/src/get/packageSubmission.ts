import { apiFetch } from "../apiFetch";
import { ApiEndpointProps } from "../index";
import { PackageSubmissionStatusRequestParams } from "../schemas/requestSchemas";
import {
  PackageSubmissionStatusResponseData,
  packageSubmissionStatusResponseDataSchema,
} from "../schemas/responseSchemas";

export function fetchPackageSubmissionStatus(
  props: ApiEndpointProps<PackageSubmissionStatusRequestParams, object, object>
): Promise<PackageSubmissionStatusResponseData> {
  const { config, params } = props;
  const request = { cache: "no-store" as RequestCache };
  const path = `/api/experimental/submission/poll-async/${params.submission_id}`;

  return apiFetch({
    args: {
      config: config,
      path: path,
      useSession: true,
      request: request,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageSubmissionStatusResponseDataSchema,
  });
}
