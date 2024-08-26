import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export interface toolsMarkdownPreviewApiArgs {
  markdown: string;
}

export function toolsMarkdownPreview(
  config: RequestConfig,
  data: toolsMarkdownPreviewApiArgs
) {
  const path = `/api/experimental/frontend/render-markdown/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
