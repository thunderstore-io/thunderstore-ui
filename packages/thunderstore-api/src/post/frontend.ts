import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";
import { z } from "zod";
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
  config: () => RequestConfig,
  data: MarkdownRenderRequestData
): Promise<MarkdownRenderResponseData> {
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
    queryParamsSchema: z.object({}),
    responseSchema: markdownRenderResponseDataSchema,
  });
}
