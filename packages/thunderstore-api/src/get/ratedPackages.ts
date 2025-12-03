import { apiFetch } from "../apiFetch";
import { type ApiEndpointProps } from "../index";
import { ratedPackagesResponseDataSchema } from "../schemas/responseSchemas";
import { type RatedPackagesResponseData } from "../schemas/responseSchemas";

export function fetchRatedPackages(
  props: ApiEndpointProps<object, object, object>
): Promise<RatedPackagesResponseData> {
  const { config } = props;
  const path = "api/experimental/current-user/rated-packages/";
  const request = { cache: "no-store" as RequestCache };

  return apiFetch({
    config: config,
    path: path,
    request: request,
    useSession: true,
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: ratedPackagesResponseDataSchema,
  });
}
