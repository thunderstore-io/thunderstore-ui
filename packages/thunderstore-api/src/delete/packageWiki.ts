import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  PackageWikiPageDeleteRequestData,
  packageWikiPageDeleteRequestDataSchema,
  PackageWikiPageDeleteRequestParams,
} from "../schemas/requestSchemas";

export async function deletePackageWikiPage(
  props: ApiEndpointProps<
    PackageWikiPageDeleteRequestParams,
    object,
    PackageWikiPageDeleteRequestData
  >
): Promise<undefined> {
  const { config, params, data } = props;
  const path = `api/experimental/package/${params.namespace_id}/${params.package_name}/wiki/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
      request: {
        method: "DELETE",
        cache: "no-store",
        body: JSON.stringify(data),
      },
    },
    requestSchema: packageWikiPageDeleteRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
