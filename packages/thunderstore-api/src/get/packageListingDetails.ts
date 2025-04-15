import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import { packageListingDetailsSchema } from "../schemas/objectSchemas";
import { PackageListingDetailsRequestParams } from "../schemas/requestSchemas";
import { PackageListingDetailsResponseData } from "../schemas/responseSchemas";

export async function fetchPackageListingDetails(
  props: ApiEndpointProps<PackageListingDetailsRequestParams, object, object>
): Promise<PackageListingDetailsResponseData> {
  const { config, params } = props;
  const c = params.community_id.toLocaleLowerCase();
  const n = params.namespace_id.toLocaleLowerCase();
  const p = params.package_name.toLocaleLowerCase();
  const path = `api/cyberstorm/listing/${c}/${n}/${p}/`;

  return await apiFetch({
    args: {
      config: config,
      path: path,
    },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: packageListingDetailsSchema,
  });
}
