import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type packageSubmissionMetaArgs = {
  useSession: boolean;
};

export type packageSubmissionApiArgs = {
  author_name: string;
  communities: string[];
  has_nsfw_content: boolean;
  upload_uuid: string;
  categories?: string[];
  community_categories?: { [key: string]: string[] };
};

export function postPackageSubmission(
  config: () => RequestConfig,
  data: packageSubmissionApiArgs,
  meta: packageSubmissionMetaArgs
) {
  const path = `/api/experimental/submission/submit-async/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    useSession: meta.useSession,
  });
}
