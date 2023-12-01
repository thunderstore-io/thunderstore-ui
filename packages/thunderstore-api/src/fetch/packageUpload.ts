import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type PackageUploadApiArgs = {
  // author_name: string;
  // upload_uuid: string;
  team: string;
  community_categories: { [key: string]: string[] };
  communities: string[];
  has_nsfw_content?: boolean;
};

export function packageUpload(
  config: RequestConfig,
  data: PackageUploadApiArgs
) {
  const path = "api/experimental/submission/submit/";

  // TODO: Add these datas in form
  const todoData = {
    ...data,
    upload_uuid: "123",
    author_name: "root",
  };

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(todoData),
    },
  });
}
