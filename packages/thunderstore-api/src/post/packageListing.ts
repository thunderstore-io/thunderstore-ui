import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import {
  type PackageListingApproveRequestData,
  type PackageListingApproveRequestParams,
  type PackageListingRejectRequestData,
  type PackageListingRejectRequestParams,
  type PackageListingReportRequestData,
  type PackageListingReportRequestParams,
  type PackageListingUpdateRequestData,
  type PackageListingUpdateRequestParams,
  packageListingApproveRequestDataSchema,
  packageListingRejectRequestDataSchema,
  packageListingReportRequestDataSchema,
  packageListingUpdateRequestDataSchema,
} from "../schemas/requestSchemas";
import {
  type PackageListingUpdateResponseData,
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
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/reject/`;

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

export function packageListingReport(
  props: ApiEndpointProps<
    PackageListingReportRequestParams,
    object,
    PackageListingReportRequestData
  >
) {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/report/`;
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
    requestSchema: packageListingReportRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
