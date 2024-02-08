import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamAddServiceAccountMetaArgs = {
  teamIdentifier: string;
};

export type teamAddServiceAccountApiArgs = {
  nickname: string;
};

export function teamAddServiceAccount(
  config: RequestConfig,
  data: teamAddServiceAccountApiArgs,
  meta: teamAddServiceAccountMetaArgs
) {
  const path = `api/cyberstorm/team/${meta.teamIdentifier}/service-accounts/create/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
