import { NewAlert, RelativeTime } from "@thunderstore/cyberstorm";
import { type ModeratorNote } from "@thunderstore/dapper/types";

export interface ModeratorNotesProps {
  note?: ModeratorNote | null;
}

/**
 * Public, read-only display of the single active moderator note shown to
 * everyone (mod authors and players). Renders nothing when there is no note.
 */
export function ModeratorNotes({ note }: ModeratorNotesProps) {
  if (!note) {
    return null;
  }

  const wasEdited = note.datetime_updated !== note.datetime_created;

  return (
    <div className="moderator-notes">
      <NewAlert csVariant="info">
        <strong>Note from moderators</strong>
        {note.version_number ? ` (v${note.version_number})` : ""}
        <pre className="moderator-notes__content">{note.content}</pre>
        <div className="moderator-notes__meta">
          Posted{" "}
          <RelativeTime time={note.datetime_created} suppressHydrationWarning />
          {wasEdited ? (
            <>
              {" · updated "}
              <RelativeTime
                time={note.datetime_updated}
                suppressHydrationWarning
              />
            </>
          ) : null}
        </div>
      </NewAlert>
    </div>
  );
}
