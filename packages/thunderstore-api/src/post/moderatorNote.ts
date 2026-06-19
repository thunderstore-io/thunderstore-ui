import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import { moderatorNoteSchema } from "../schemas/objectSchemas";
import type { ModeratorNote } from "../schemas/objectSchemas";
import { moderatorNoteWriteRequestDataSchema } from "../schemas/requestSchemas";
import type {
  CommunityModeratorNoteCreateRequestParams,
  ListingModeratorNoteCreateRequestParams,
  ModeratorNoteWriteRequestData,
  VersionModeratorNoteCreateRequestParams,
} from "../schemas/requestSchemas";

export function createCommunityModeratorNote(
  props: ApiEndpointProps<
    CommunityModeratorNoteCreateRequestParams,
    object,
    ModeratorNoteWriteRequestData
  >
): Promise<ModeratorNote> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/community/${params.community}/notes/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: moderatorNoteWriteRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: moderatorNoteSchema,
  });
}

export function createListingModeratorNote(
  props: ApiEndpointProps<
    ListingModeratorNoteCreateRequestParams,
    object,
    ModeratorNoteWriteRequestData
  >
): Promise<ModeratorNote> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/notes/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: moderatorNoteWriteRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: moderatorNoteSchema,
  });
}

export function createVersionModeratorNote(
  props: ApiEndpointProps<
    VersionModeratorNoteCreateRequestParams,
    object,
    ModeratorNoteWriteRequestData
  >
): Promise<ModeratorNote> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/listing/${params.community}/${params.namespace}/${params.package}/v/${params.version_number}/notes/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: moderatorNoteWriteRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: moderatorNoteSchema,
  });
}
