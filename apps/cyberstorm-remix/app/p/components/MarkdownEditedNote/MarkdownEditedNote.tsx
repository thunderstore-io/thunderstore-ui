import { LocalDateTime } from "@thunderstore/cyberstorm";

import "./MarkdownEditedNote.css";

export function MarkdownEditedNote(props: {
  doc: { is_edited?: boolean; edited_at?: string | null } | null;
  label: "README" | "CHANGELOG";
}) {
  if (!props.doc?.is_edited) return null;
  return (
    <div className="markdown-edited-note">
      <span
        className="markdown-edited-note__label"
        title={`${props.label} edited on Thunderstore.`}
      >
        Edited
      </span>
      {props.doc.edited_at ? (
        <>
          {" · "}
          <LocalDateTime time={props.doc.edited_at} timeStyle={null} />
        </>
      ) : null}
    </div>
  );
}
