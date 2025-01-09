import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export interface userDeleteApiArgs {
  verification: string;
}

export function userDelete(config: RequestConfig, data: userDeleteApiArgs) {
  const path = `/api/cyberstorm/current-user/delete/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
    useSession: true,
  });
}
