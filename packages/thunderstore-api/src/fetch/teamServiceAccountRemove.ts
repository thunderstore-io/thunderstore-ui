import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamServiceAccountRemoveMetaArgs = {
  serviceAccountIdentifier: string;
  teamName: string;
};

export function teamServiceAccountRemove(
  config: RequestConfig,
  _data: object,
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
    useSession: true,
  });
}
