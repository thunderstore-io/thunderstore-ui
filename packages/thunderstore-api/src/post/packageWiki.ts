import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import {
  packageWikiPageCreateRequestDataSchema,
  packageWikiPageEditRequestDataSchema,
} from "../schemas/requestSchemas";
import type {
  PackageWikiPageCreateRequestData,
  PackageWikiPageCreateRequestParams,
  PackageWikiPageEditRequestData,
  PackageWikiPageEditRequestParams,
} from "../schemas/requestSchemas";
import {
  packageWikiPageCreateResponseDataSchema,
  packageWikiPageEditResponseDataSchema,
} from "../schemas/responseSchemas";
import type {
  PackageWikiPageCreateResponseData,
  PackageWikiPageEditResponseData,
} from "../schemas/responseSchemas";

export async function postPackageWikiPageCreate(
  props: ApiEndpointProps<
    PackageWikiPageCreateRequestParams,
    object,
    PackageWikiPageCreateRequestData
  >
): Promise<PackageWikiPageCreateResponseData> {
  const { config, params, data } = props;
  const path = `api/experimental/package/${params.namespace_id}/${params.package_name}/wiki/`;

  return await apiFetch({
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
    requestSchema: packageWikiPageCreateRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageWikiPageCreateResponseDataSchema,
  });
}

export async function postPackageWikiPageEdit(
  props: ApiEndpointProps<
    PackageWikiPageEditRequestParams,
    object,
    PackageWikiPageEditRequestData
  >
): Promise<PackageWikiPageEditResponseData> {
  const { config, params, data } = props;
  const path = `api/experimental/package/${params.namespace_id}/${params.package_name}/wiki/`;

  return await apiFetch({
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
    requestSchema: packageWikiPageEditRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageWikiPageEditResponseDataSchema,
  });
}
