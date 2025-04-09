import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
import {
  DynamicHTMLResponseData,
  dynamicHTMLResponseDataSchema,
} from "../schemas/responseSchemas";
import { DynamicHTMLRequestParams } from "../schemas/requestSchemas";

export async function fetchDynamicHTML(
  config: () => RequestConfig,
  params: DynamicHTMLRequestParams
): Promise<DynamicHTMLResponseData> {
  const path = `api/cyberstorm/dynamichtml/${params.placement}`;

  return await apiFetch({
    args: { config, path, request: { cache: "no-store" as RequestCache } },
    requestSchema: z.object({}),
    queryParamsSchema: z.object({}),
    responseSchema: dynamicHTMLResponseDataSchema,
  });
}
