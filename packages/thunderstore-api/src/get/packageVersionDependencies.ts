import { apiFetch } from "../apiFetch";
import {
  type ApiEndpointProps,
  type PackageVersionDependenciesRequestParams,
  type PackageVersionDependenciesRequestQueryParams,
  type PackageVersionDependenciesResponseData,
  packageVersionDependenciesRequestQueryParamsSchema,
  packageVersionDependenciesResponseDataSchema,
} from "../index";

export async function fetchPackageVersionDependencies(
  props: ApiEndpointProps<
    PackageVersionDependenciesRequestParams,
    PackageVersionDependenciesRequestQueryParams,
    object
  >
): Promise<PackageVersionDependenciesResponseData> {
  const {
    config,
    params,
    queryParams = [{ key: "page", value: 1, impotent: 1 }],
  } = props;
  const path = `api/cyberstorm/package/${params.namespace_id}/${params.package_name}/v/${params.version_number}/dependencies/`;

  return await apiFetch({
    args: {
      config,
      path,
      queryParams,
    },
    requestSchema: undefined,
    queryParamsSchema: packageVersionDependenciesRequestQueryParamsSchema,
    responseSchema: packageVersionDependenciesResponseDataSchema,
  });
}
