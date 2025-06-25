import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageWikiPageCreateRequestData,
  PackageWikiPageCreateRequestParams,
  packageWikiPageCreateRequestDataSchema,
  PackageWikiPageEditRequestData,
  PackageWikiPageEditRequestParams,
  packageWikiPageEditRequestDataSchema,
} from "../schemas/requestSchemas";
import {
  PackageWikiPageCreateResponseData,
  packageWikiPageCreateResponseDataSchema,
  PackageWikiPageEditResponseData,
  packageWikiPageEditResponseDataSchema,
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
    },
    requestSchema: packageWikiPageEditRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageWikiPageEditResponseDataSchema,
  });
}
