import { apiFetch } from "../apiFetch";
import {
  type ApiEndpointProps,
  type TeamDetailsEditRequestData,
  type TeamDetailsEditRequestParams,
  type TeamDetailsEditResponseData,
  teamDetailsEditRequestDataSchema,
  teamDetailsEditResponseSchema,
} from "../index";

export type teamDetailsEditMetaArgs = {
  teamIdentifier: string;
};

export type teamDetailsEditApiArgs = {
  donation_link: string;
};

export function teamDetailsEdit(
  props: ApiEndpointProps<
    TeamDetailsEditRequestParams,
    object,
    TeamDetailsEditRequestData
  >
): Promise<TeamDetailsEditResponseData> {
  const { config, data, params } = props;
  const path = `api/cyberstorm/team/${params.teamIdentifier}/update/`;

  return apiFetch({
    config,
    path,
    request: {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    useSession: true,
    requestSchema: teamDetailsEditRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: teamDetailsEditResponseSchema,
  });
}
