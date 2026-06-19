import { apiFetch } from "../apiFetch";
import type { ApiEndpointProps } from "../index";
import type { ModeratorNoteDetailRequestParams } from "../schemas/requestSchemas";

export function deleteModeratorNote(
  props: ApiEndpointProps<ModeratorNoteDetailRequestParams, object, object>
) {
  const { config, params } = props;
  const path = `/api/cyberstorm/moderator-note/${params.note_id}/`;

  return apiFetch({
    args: {
      config,
      path,
      request: {
        method: "DELETE",
        cache: "no-store",
      },
      useSession: true,
    },
    requestSchema: undefined,
    queryParamsSchema: undefined,
    responseSchema: undefined,
  });
}
