import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type teamDetailsEditMetaData = {
  teamIdentifier: string;
};

export type teamDetailsEditApiArgs = {
  donation_link: string;
};

export function teamDetailsEdit(
  config: RequestConfig,
  data: teamDetailsEditApiArgs,
  metaData: teamDetailsEditMetaData
) {
  const path = `api/cyberstorm/team/${metaData.teamIdentifier}/edit/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
}
