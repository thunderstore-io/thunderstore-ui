import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import { moderatorNoteSchema } from "../schemas/objectSchemas";
import type { ModeratorNote } from "../schemas/objectSchemas";
import { moderatorNoteUpdateRequestDataSchema } from "../schemas/requestSchemas";
import type {
  ModeratorNoteDetailRequestParams,
  ModeratorNoteUpdateRequestData,
} from "../schemas/requestSchemas";

export function updateModeratorNote(
  props: ApiEndpointProps<
    ModeratorNoteDetailRequestParams,
    object,
    ModeratorNoteUpdateRequestData
  >
): Promise<ModeratorNote> {
  const { config, params, data } = props;
  const path = `/api/cyberstorm/moderator-note/${params.note_id}/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "PATCH",
        cache: "no-store",
        body: JSON.stringify(data),
      },
      useSession: true,
    },
    requestSchema: moderatorNoteUpdateRequestDataSchema,
    queryParamsSchema: undefined,
    responseSchema: moderatorNoteSchema,
  });
}
