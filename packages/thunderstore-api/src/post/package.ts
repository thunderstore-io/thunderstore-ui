import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageDeprecateRequestData,
  packageDeprecateRequestDataSchema,
  PackageDeprecateRequestParams,
  packageRateRequestDataSchema,
} from "../schemas/requestSchemas";
import { PackageRateRequestData } from "../schemas/requestSchemas";
import { PackageRateRequestParams } from "../schemas/requestSchemas";
import {
  PackageDeprecateResponseData,
  packageDeprecateResponseDataSchema,
  packageRateResponseDataSchema,
  PackageRateResponseData,
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
