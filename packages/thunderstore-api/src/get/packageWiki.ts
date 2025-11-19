import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageWikiPageRequestParams,
  PackageWikiRequestParams,
} from "../schemas/requestSchemas";
import {
  PackageWikiPageResponseData,
  packageWikiPageResponseDataSchema,
  PackageWikiResponseData,
  packageWikiResponseDataSchema,
} from "../schemas/responseSchemas";

export function fetchPackageWiki(
  props: ApiEndpointProps<PackageWikiRequestParams, object, object>
): Promise<PackageWikiResponseData> {
  const { config, params } = props;
  const path = `api/experimental/package/${params.namespace_id}/${params.package_name}/wiki/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageWikiResponseDataSchema,
  });
}

export function fetchPackageWikiPage(
  props: ApiEndpointProps<PackageWikiPageRequestParams, object, object>
): Promise<PackageWikiPageResponseData> {
  const { config, params } = props;
  const path = `api/experimental/wiki/page/${params.id}/`;

  return apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: packageWikiPageResponseDataSchema,
  });
}
