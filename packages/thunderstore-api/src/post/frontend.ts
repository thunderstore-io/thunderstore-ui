import { ApiEndpointProps } from "../index";
import { apiFetch } from "../apiFetch";
import {
  MarkdownRenderRequestData,
  markdownRenderRequestDataSchema,
} from "../schemas/requestSchemas";
import {
  MarkdownRenderResponseData,
  markdownRenderResponseDataSchema,
} from "../schemas/responseSchemas";

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
