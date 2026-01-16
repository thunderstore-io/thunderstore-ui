import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { DynamicHTMLRequestParams } from "../schemas/requestSchemas";
import {
  type DynamicHTMLResponseData,
  dynamicHTMLResponseDataSchema,
} from "../schemas/responseSchemas";

export async function fetchDynamicHTML(
  props: ApiEndpointProps<DynamicHTMLRequestParams, object, object>
): Promise<DynamicHTMLResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/dynamichtml/${params.placement}`;

  return await apiFetch({
    args: { config, path, request: { cache: "no-store" as RequestCache } },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: dynamicHTMLResponseDataSchema,
  });
}
