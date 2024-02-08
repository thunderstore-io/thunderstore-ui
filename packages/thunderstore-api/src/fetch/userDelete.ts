import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type userDeleteMetaArgs = {
  username: string;
};

export interface userDeleteApiArgs {
  verification: string;
}

export function userDelete(
  config: RequestConfig,
  data: userDeleteApiArgs,
  meta: userDeleteMetaArgs
) {
  const path = `/api/cyberstorm/user/${meta.username}/delete/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
