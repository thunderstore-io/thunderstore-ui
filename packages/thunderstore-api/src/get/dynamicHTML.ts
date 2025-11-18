import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  DynamicHTMLResponseData,
  dynamicHTMLResponseDataSchema,
} from "../schemas/responseSchemas";
import { DynamicHTMLRequestParams } from "../schemas/requestSchemas";

export function fetchDynamicHTML(
  props: ApiEndpointProps<DynamicHTMLRequestParams, object, object>
): Promise<DynamicHTMLResponseData> {
  const { config, params } = props;
  const path = `api/cyberstorm/dynamichtml/${params.placement}`;

  return apiFetch({
    args: { config, path, request: { cache: "no-store" as RequestCache } },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: dynamicHTMLResponseDataSchema,
  });
}
