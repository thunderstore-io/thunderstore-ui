import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageSubmissionRequestData,
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
  config: () => RequestConfig,
  data: PackageSubmissionRequestData
): Promise<PackageSubmissionResponseData> {
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
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: packageSubmissionResponseDataSchema,
  });
}

export function toolsManifestValidate(
  config: () => RequestConfig,
  data: SubmissionValidateManifestRequestData
): Promise<SubmissionValidateManifestResponseData> {
  const path = `/api/experimental/submission/validate/manifest-v1/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify(data),
      },
    },
    requestSchema: submissionValidateManifestRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: submissionValidateManifestResponseDataSchema,
  });
}
