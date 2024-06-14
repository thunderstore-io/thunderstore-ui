import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type packageLikeMetaArgs = {
  uuid4: string;
};

export type packageLikeApiArgs = {
  target_state: "rated" | "unrated";
};

export function packageLike(
  config: RequestConfig,
  data: packageLikeApiArgs,
  meta: packageLikeMetaArgs
) {
  const path = `/api/v1/package/${meta.uuid4}/rate/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
  });
}
