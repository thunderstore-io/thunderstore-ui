import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type userDeleteMetaData = {
  username: string;
};

export interface userDeleteApiArgs {
  verification: string;
}

export function userDelete(
  config: RequestConfig,
  data: userDeleteApiArgs,
  metaData: userDeleteMetaData
) {
  const path = `/api/cyberstorm/user/${metaData.username}/delete/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}