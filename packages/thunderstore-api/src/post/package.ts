import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import {
  type PackageDeprecateRequestData,
  type PackageDeprecateRequestParams,
  type PackageUnlistRequestData,
  type PackageUnlistRequestParams,
  packageDeprecateRequestDataSchema,
  packageRateRequestDataSchema,
  packageUnlistRequestDataSchema,
} from "../schemas/requestSchemas";
import { type PackageRateRequestData } from "../schemas/requestSchemas";
import { type PackageRateRequestParams } from "../schemas/requestSchemas";
import {
  type PackageDeprecateResponseData,
  type PackageRateResponseData,
  type PackageUnlistResponseData,
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
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    useSession: props.useSession,
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
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    useSession: props.useSession,
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
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    useSession: props.useSession,
    requestSchema: packageUnlistRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageUnlistResponseDataSchema,
  });
}
