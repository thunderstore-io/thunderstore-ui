import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamAddServiceAccountMetaData = {
  teamIdentifier: string;
};

export type teamAddServiceAccountApiArgs = {
  nickname: string;
};

export function teamAddServiceAccount(
  config: RequestConfig,
  data: teamAddServiceAccountApiArgs,
  metaData: teamAddServiceAccountMetaData
) {
  const path = `api/cyberstorm/team/${metaData.teamIdentifier}/service-accounts/create/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
