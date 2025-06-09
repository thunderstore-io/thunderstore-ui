import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import {
  CurrentUserResponseData,
  currentUserResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchCurrentUser(
  props: ApiEndpointProps<object, object, object>
): Promise<CurrentUserResponseData> {
  const { config } = props;
  const path = "api/experimental/current-user/";
  const request = { cache: "no-store" as RequestCache };

  return await apiFetch({
    args: { config, path, request, useSession: true },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: currentUserResponseDataSchema,
  });
}
