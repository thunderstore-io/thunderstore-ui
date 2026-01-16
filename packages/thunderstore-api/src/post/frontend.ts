import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import { markdownRenderRequestDataSchema } from "../schemas/requestSchemas";
import type { MarkdownRenderRequestData } from "../schemas/requestSchemas";
import { markdownRenderResponseDataSchema } from "../schemas/responseSchemas";
import type { MarkdownRenderResponseData } from "../schemas/responseSchemas";

export interface toolsMarkdownPreviewApiArgs {
  markdown: string;
}

export function toolsMarkdownPreview(
  props: ApiEndpointProps<object, object, MarkdownRenderRequestData>
): Promise<MarkdownRenderResponseData> {
  const { config, data } = props;
  const path = `/api/experimental/frontend/render-markdown/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        body: JSON.stringify(data),
      },
    },
    requestSchema: markdownRenderRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: markdownRenderResponseDataSchema,
  });
}
