// THIS API ENDPOINT IS NOT IMPLEMENTED YET IN THE THUNDERSTORE API

import { RequestConfig } from "../index";
import { apiFetch } from "../apiFetch";

export type teamAddServiceAccountMetaArgs = {
  teamIdentifier: string;
};

export type teamAddServiceAccountApiArgs = {
  nickname: string;
};

export function teamAddServiceAccount(
  config: () => RequestConfig,
  data: teamAddServiceAccountApiArgs,
  meta: teamAddServiceAccountMetaArgs
) {
  const path = `api/cyberstorm/team/${meta.teamIdentifier}/service-account/create/`;

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
