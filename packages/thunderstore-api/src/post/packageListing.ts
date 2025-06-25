import { ApiEndpointProps } from "../index";
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
  props: ApiEndpointProps<
    PackageListingUpdateRequestParams,
    object,
    PackageListingUpdateRequestData
  >
): Promise<PackageListingUpdateResponseData> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/update/`;

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
    requestSchema: packageListingUpdateRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageListingUpdateResponseDataSchema,
  });
}

export function packageListingApprove(
  props: ApiEndpointProps<
    PackageListingApproveRequestParams,
    object,
    PackageListingApproveRequestData
  >
) {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/approve/`;

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
    requestSchema: packageListingApproveRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}

export function packageListingReject(
  props: ApiEndpointProps<
    PackageListingRejectRequestParams,
    object,
    PackageListingRejectRequestData
  >
) {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/approve/`;

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
    requestSchema: packageListingRejectRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
