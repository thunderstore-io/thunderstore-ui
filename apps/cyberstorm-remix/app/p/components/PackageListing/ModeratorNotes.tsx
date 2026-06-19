import { NewAlert, RelativeTime } from "@thunderstore/cyberstorm";
import { type ModeratorNote } from "@thunderstore/dapper/types";

import "./ModeratorNotes.css";

export interface ModeratorNotesProps {
  notes?: ModeratorNote[];
}

/**
 * Public, read-only display of the active moderator notes shown to everyone (mod
 * authors and players). Renders one alert per note, nothing when there are none.
 */
export function ModeratorNotes({ notes }: ModeratorNotesProps) {
  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <div className="moderator-notes">
      {notes.map((note) => (
        <ModeratorNoteAlert key={note.id} note={note} />
      ))}
    </div>
  );
}

function ModeratorNoteAlert({ note }: { note: ModeratorNote }) {
  // Only treat as edited when the update is meaningfully after creation: on
  // creation the backend's auto_now_add/auto_now timestamps can land a few
  // microseconds apart, which a raw inequality would misread as an edit.
  const wasEdited =
    new Date(note.datetime_updated).getTime() -
      new Date(note.datetime_created).getTime() >
    1000;

  return (
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
  );
}
