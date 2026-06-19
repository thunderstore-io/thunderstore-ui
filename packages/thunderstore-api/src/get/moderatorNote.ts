import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type {
  CommunityModeratorNoteCreateRequestParams,
  ListingModeratorNoteCreateRequestParams,
  VersionModeratorNoteCreateRequestParams,
} from "../schemas/requestSchemas";
import {
  type ModeratorNoteListResponseData,
  moderatorNoteListResponseDataSchema,
} from "../schemas/responseSchemas";

// Moderator-only reads: unlike the public listing/community detail (which embed
// only the ACTIVE note), these return the resource's current note even when it
// is inactive, so the management UI can offer "Activate". Session + no-store.
const noStore = { cache: "no-store" as RequestCache };

export function getCommunityModeratorNote(
  props: ApiEndpointProps<
    CommunityModeratorNoteCreateRequestParams,
    object,
    object
  >
): Promise<ModeratorNoteListResponseData> {
  const { config, params } = props;
  const path = `/api/cyberstorm/community/${params.community}/notes/`;

  return apiFetch({
    args: { config, path, request: noStore, useSession: true },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: moderatorNoteListResponseDataSchema,
  });
}

export function getListingModeratorNote(
  props: ApiEndpointProps<
    ListingModeratorNoteCreateRequestParams,
    object,
    object
  >
): Promise<ModeratorNoteListResponseData> {
  const { config, params } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/notes/`;

  return apiFetch({
    args: { config, path, request: noStore, useSession: true },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: moderatorNoteListResponseDataSchema,
  });
}

export function getVersionModeratorNote(
  props: ApiEndpointProps<
    VersionModeratorNoteCreateRequestParams,
    object,
    object
  >
): Promise<ModeratorNoteListResponseData> {
  const { config, params } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/v/${params.version_number}/notes/`;

  return apiFetch({
    args: { config, path, request: noStore, useSession: true },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: moderatorNoteListResponseDataSchema,
  });
}
