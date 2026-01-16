import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  packageDeprecateRequestDataSchema,
  packageRateRequestDataSchema,
  packageUnlistRequestDataSchema,
} from "../schemas/requestSchemas";
import type {
  PackageDeprecateRequestData,
  PackageDeprecateRequestParams,
  PackageUnlistRequestData,
  PackageUnlistRequestParams,
} from "../schemas/requestSchemas";
import type { PackageRateRequestData } from "../schemas/requestSchemas";
import type { PackageRateRequestParams } from "../schemas/requestSchemas";
import {
  packageDeprecateResponseDataSchema,
  packageRateResponseDataSchema,
  packageUnlistResponseDataSchema,
} from "../schemas/responseSchemas";
import type {
  PackageDeprecateResponseData,
  PackageRateResponseData,
  PackageUnlistResponseData,
} from "../schemas/responseSchemas";

export function packageRate(
  props: ApiEndpointProps<
    PackageRateRequestParams,
    object,
    PackageRateRequestData
  >
): Promise<PackageRateResponseData> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/rate/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: props.useSession,
    },
    requestSchema: packageRateRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageRateResponseDataSchema,
  });
}

export function packageDeprecate(
  props: ApiEndpointProps<
    PackageDeprecateRequestParams,
    object,
    PackageDeprecateRequestData
  >
): Promise<PackageDeprecateResponseData> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/deprecate/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: props.useSession,
    },
    requestSchema: packageDeprecateRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageDeprecateResponseDataSchema,
  });
}

export function packageUnlist(
  props: ApiEndpointProps<
    PackageUnlistRequestParams,
    object,
    PackageUnlistRequestData
  >
): Promise<PackageUnlistResponseData> {
  const { config, params, data } = props;
  const baseUrl = "/api/cyberstorm/listing/";
  const path = `${baseUrl}${params.community}/${params.namespace}/${params.package}/unlist/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: props.useSession,
    },
    requestSchema: packageUnlistRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageUnlistResponseDataSchema,
  });
}
