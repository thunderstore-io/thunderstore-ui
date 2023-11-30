import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamServiceAccountRemoveMetaData = {
  serviceAccountIdentifier: string;
  teamName: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface teamServiceAccountRemoveApiArgs {}

export function teamServiceAccountRemove(
  config: RequestConfig,
  data: teamServiceAccountRemoveApiArgs,
  metaData: teamServiceAccountRemoveMetaData
) {
  const path = `/api/cyberstorm/team/${metaData.teamName}/service-accounts/delete/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify({
        service_account_uuid: metaData.serviceAccountIdentifier,
      }),
    },
  });
}
