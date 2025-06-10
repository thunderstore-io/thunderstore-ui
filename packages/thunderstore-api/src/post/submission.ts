import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageSubmissionRequestData,
  packageSubmissionRequestDataSchema,
  SubmissionValidateManifestRequestData,
  submissionValidateManifestRequestDataSchema,
} from "../schemas/requestSchemas";
import { z } from "zod";
import {
  PackageSubmissionResponseData,
  packageSubmissionResponseDataSchema,
  submissionValidateManifestResponseDataSchema,
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
      useSession: true,
    },
    requestSchema: packageSubmissionRequestDataSchema,
    queryParamsSchema: z.object({}),
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
    queryParamsSchema: z.object({}),
    responseSchema: submissionValidateManifestResponseDataSchema,
  });
}
