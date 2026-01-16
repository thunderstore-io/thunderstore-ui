import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  packageSubmissionRequestDataSchema,
  submissionValidateManifestRequestDataSchema,
} from "../schemas/requestSchemas";
import type {
  PackageSubmissionRequestData,
  SubmissionValidateManifestRequestData,
} from "../schemas/requestSchemas";
import {
  packageSubmissionResponseDataSchema,
  submissionValidateManifestResponseDataSchema,
} from "../schemas/responseSchemas";
import type {
  PackageSubmissionResponseData,
  SubmissionValidateManifestResponseData,
} from "../schemas/responseSchemas";

export function postPackageSubmission(
  props: ApiEndpointProps<object, object, PackageSubmissionRequestData>
): Promise<PackageSubmissionResponseData> {
  const { config, data } = props;
  const path = `/api/experimental/submission/submit-async/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      bodyRaw: data,
      useSession: true,
    },
    requestSchema: packageSubmissionRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageSubmissionResponseDataSchema,
  });
}

export function toolsManifestValidate(
  props: ApiEndpointProps<object, object, SubmissionValidateManifestRequestData>
): Promise<SubmissionValidateManifestResponseData> {
  const { config, data } = props;
  const path = `/api/experimental/submission/validate/manifest-v1/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: submissionValidateManifestRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: submissionValidateManifestResponseDataSchema,
  });
}
