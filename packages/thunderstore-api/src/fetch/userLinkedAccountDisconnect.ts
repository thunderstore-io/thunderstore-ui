import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export interface userLinkedAccountDisconnectApiArgs {
  provider: "discord" | "github" | "overwolf";
}

export function userLinkedAccountDisconnect(
  config: RequestConfig,
  data: userLinkedAccountDisconnectApiArgs
) {
  const path = `/api/cyberstorm/current-user/linked-account-disconnect/`;

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
