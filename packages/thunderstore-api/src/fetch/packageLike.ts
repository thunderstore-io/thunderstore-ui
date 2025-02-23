import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type packageLikeMetaArgs = {
  namespace_id: string;
  package_name: string;
  useSession: boolean;
};

export type packageLikeApiArgs = {
  target_state: "rated" | "unrated";
};

export function packageLike(
  config: () => RequestConfig,
  data: packageLikeApiArgs,
  meta: packageLikeMetaArgs
) {
  const path = `/api/cyberstorm/package/${meta.namespace_id}/${meta.package_name}/rate/`;

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
