import { apiFetch } from "../apiFetch";
import type {
  ApiEndpointProps,
  TeamDetailsEditRequestData,
  TeamDetailsEditRequestParams,
  TeamDetailsEditResponseData,
} from "../index";
import {
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
    args: {
      config,
      path,
      request: {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: teamDetailsEditRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: teamDetailsEditResponseSchema,
  });
}
