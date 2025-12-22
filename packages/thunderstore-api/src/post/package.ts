import { apiFetch } from "../apiFetch";
import { ApiEndpointProps } from "../index";
import {
  PackageDeprecateRequestData,
  PackageDeprecateRequestParams,
  PackageUnlistRequestData,
  PackageUnlistRequestParams,
  packageDeprecateRequestDataSchema,
  packageRateRequestDataSchema,
  packageUnlistRequestDataSchema,
} from "../schemas/requestSchemas";
import { PackageRateRequestData } from "../schemas/requestSchemas";
import { PackageRateRequestParams } from "../schemas/requestSchemas";
import {
  PackageDeprecateResponseData,
  PackageRateResponseData,
  PackageUnlistResponseData,
  packageDeprecateResponseDataSchema,
  packageRateResponseDataSchema,
  packageUnlistResponseDataSchema,
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
  const path = `/c/${params.community}/${params.namespace}/${params.package}/`;

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
