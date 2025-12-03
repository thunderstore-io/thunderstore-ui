import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import {
  type PackageWikiPageCreateRequestData,
  type PackageWikiPageCreateRequestParams,
  type PackageWikiPageEditRequestData,
  type PackageWikiPageEditRequestParams,
  packageWikiPageCreateRequestDataSchema,
  packageWikiPageEditRequestDataSchema,
} from "../schemas/requestSchemas";
import {
  type PackageWikiPageCreateResponseData,
  type PackageWikiPageEditResponseData,
  packageWikiPageCreateResponseDataSchema,
  packageWikiPageEditResponseDataSchema,
} from "../schemas/responseSchemas";

export function postPackageWikiPageCreate(
  props: ApiEndpointProps<
    PackageWikiPageCreateRequestParams,
    object,
    PackageWikiPageCreateRequestData
  >
): Promise<PackageWikiPageCreateResponseData> {
  const { config, params, data } = props;
  const path = `api/experimental/package/${params.namespace_id}/${params.package_name}/wiki/`;

  return apiFetch({
    config: config,
    path: path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    requestSchema: packageWikiPageCreateRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageWikiPageCreateResponseDataSchema,
  });
}

export function postPackageWikiPageEdit(
  props: ApiEndpointProps<
    PackageWikiPageEditRequestParams,
    object,
    PackageWikiPageEditRequestData
  >
): Promise<PackageWikiPageEditResponseData> {
  const { config, params, data } = props;
  const path = `api/experimental/package/${params.namespace_id}/${params.package_name}/wiki/`;

  return apiFetch({
    config: config,
    path: path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    requestSchema: packageWikiPageEditRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: packageWikiPageEditResponseDataSchema,
  });
}
