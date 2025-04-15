import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageListingApproveRequestData,
  PackageListingApproveRequestParams,
  PackageListingRejectRequestData,
  PackageListingRejectRequestParams,
  PackageListingUpdateRequestData,
  PackageListingUpdateRequestParams,
  packageListingUpdateRequestDataSchema,
  packageListingApproveRequestDataSchema,
  packageListingRejectRequestDataSchema,
} from "../schemas/requestSchemas";
import { z } from "zod";
import {
  PackageListingUpdateResponseData,
  packageListingUpdateResponseDataSchema,
} from "../schemas/responseSchemas";

export function packageListingUpdate(
  config: () => RequestConfig,
  params: PackageListingUpdateRequestParams,
  data: PackageListingUpdateRequestData
): Promise<PackageListingUpdateResponseData> {
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/update/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: packageListingUpdateRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: packageListingUpdateResponseDataSchema,
  });
}

export function packageListingApprove(
  config: () => RequestConfig,
  params: PackageListingApproveRequestParams,
  data: PackageListingApproveRequestData
) {
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/approve/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: packageListingApproveRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: z.object({}),
  });
}

export function packageListingReject(
  config: () => RequestConfig,
  params: PackageListingRejectRequestParams,
  data: PackageListingRejectRequestData
) {
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/approve/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: packageListingRejectRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: z.object({}),
  });
}
