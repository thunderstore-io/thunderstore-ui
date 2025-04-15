import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageDeprecateRequestData,
  packageDeprecateRequestDataSchema,
  PackageDeprecateRequestParams,
  packageRateRequestDataSchema,
} from "../schemas/requestSchemas";
import { PackageRateRequestData } from "../schemas/requestSchemas";
import { PackageRateRequestParams } from "../schemas/requestSchemas";
import { z } from "zod";
import {
  PackageDeprecateResponseData,
  packageDeprecateResponseDataSchema,
  packageRateResponseDataSchema,
  PackageRateResponseData,
} from "../schemas/responseSchemas";

export function packageRate(
  config: () => RequestConfig,
  params: PackageRateRequestParams,
  data: PackageRateRequestData
): Promise<PackageRateResponseData> {
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
      useSession: true,
    },
    requestSchema: packageRateRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: packageRateResponseDataSchema,
  });
}

export function packageDeprecate(
  config: () => RequestConfig,
  params: PackageDeprecateRequestParams,
  data: PackageDeprecateRequestData
): Promise<PackageDeprecateResponseData> {
  const path = `/api/cyberstorm/package/${params.namespace}/${params.package}/deprecate/`;

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
    requestSchema: packageDeprecateRequestDataSchema,
    queryParamsSchema: z.object({}),
    responseSchema: packageDeprecateResponseDataSchema,
  });
}
