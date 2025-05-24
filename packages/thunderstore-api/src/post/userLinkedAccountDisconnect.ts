// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export interface userLinkedAccountDisconnectApiArgs {
  provider: "discord" | "github" | "overwolf";
}

export function userLinkedAccountDisconnect(
  config: () => RequestConfig,
  data: userLinkedAccountDisconnectApiArgs
) {
  const path = `/api/cyberstorm/current-user/linked-account-disconnect/`;

  return apiFetch({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
    useSession: true,
  });
}
