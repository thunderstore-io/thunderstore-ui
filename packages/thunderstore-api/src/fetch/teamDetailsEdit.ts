import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamDetailsEditMetaArgs = {
  teamIdentifier: string;
};

export type teamDetailsEditApiArgs = {
  donation_link: string;
};

export function teamDetailsEdit(
  config: RequestConfig,
  data: teamDetailsEditApiArgs,
  meta: teamDetailsEditMetaArgs
) {
  const path = `api/cyberstorm/team/${meta.teamIdentifier}/edit/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
