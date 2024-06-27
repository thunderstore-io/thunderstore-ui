import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamServiceAccountRemoveMetaArgs = {
  serviceAccountIdentifier: string;
  teamName: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface teamServiceAccountRemoveApiArgs {}

export function teamServiceAccountRemove(
  config: RequestConfig,
  _data: teamServiceAccountRemoveApiArgs,
  meta: teamServiceAccountRemoveMetaArgs
) {
  const path = `/api/cyberstorm/team/${meta.teamName}/service-account/delete/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify({
        service_account_uuid: meta.serviceAccountIdentifier,
      }),
    },
  });
}
