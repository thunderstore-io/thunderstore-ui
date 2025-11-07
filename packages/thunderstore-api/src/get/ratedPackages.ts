import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { ratedPackagesResponseDataSchema } from "../schemas/responseSchemas";
import { RatedPackagesResponseData } from "../schemas/responseSchemas";

export function fetchRatedPackages(
  props: ApiEndpointProps<object, object, object>
): Promise<RatedPackagesResponseData> {
  const { config } = props;
  const path = "api/experimental/current-user/rated-packages/";
  const request = { cache: "no-store" as RequestCache };

  return apiFetch({
    args: {
      config: config,
      path: path,
      request: request,
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: ratedPackagesResponseDataSchema,
  });
}
