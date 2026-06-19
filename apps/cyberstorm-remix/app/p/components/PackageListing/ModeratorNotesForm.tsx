import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useRef, useState } from "react";
import { useRevalidator } from "react-router";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewTextInput,
  RelativeTime,
  useToast,
} from "@thunderstore/cyberstorm";
import { type ModeratorNote } from "@thunderstore/dapper/types";
import {
  type RequestConfig,
  createCommunityModeratorNote,
  createListingModeratorNote,
  createVersionModeratorNote,
  deleteModeratorNote,
  extractApiErrorMessage,
  extractApiFieldErrorMessage,
  getCommunityModeratorNote,
  getListingModeratorNote,
  getVersionModeratorNote,
  updateModeratorNote,
} from "@thunderstore/thunderstore-api";

import "./ModeratorNotesForm.css";

const TOAST_SUCCESS_DURATION_MS = 4000;
const TOAST_ERROR_DURATION_MS = 8000;

// Which resource a note is attached to. A discriminated union keeps the required
// identifiers type-safe per target (e.g. only version notes carry a version).
export type ModeratorNotesTarget =
  | { type: "community"; communityId: string }
  | {
      type: "listing";
      communityId: string;
      namespaceId: string;
      packageId: string;
    }
  | {
      type: "version";
      communityId: string;
      namespaceId: string;
      packageId: string;
      versionNumber: string;
    };

const TITLES: Record<ModeratorNotesTarget["type"], string> = {
  community: "Community moderator notes",
  listing: "Listing moderator notes",
  version: "Package version moderator notes",
};

function readNotes(target: ModeratorNotesTarget, config: () => RequestConfig) {
  const base = { config, queryParams: {}, data: {} } as const;
  switch (target.type) {
    case "community":
      return getCommunityModeratorNote({
        ...base,
        params: { community: target.communityId },
      });
    case "listing":
      return getListingModeratorNote({
        ...base,
        params: {
          community: target.communityId,
          namespace: target.namespaceId,
          package: target.packageId,
        },
      });
    case "version":
      return getVersionModeratorNote({
        ...base,
        params: {
          community: target.communityId,
          namespace: target.namespaceId,
          package: target.packageId,
          version_number: target.versionNumber,
        },
      });
  }
}

function createNote(
  target: ModeratorNotesTarget,
  config: () => RequestConfig,
  content: string
) {
  const data = { content };
  switch (target.type) {
    case "community":
      return createCommunityModeratorNote({
        config,
        queryParams: {},
        params: { community: target.communityId },
        data,
      });
    case "listing":
      return createListingModeratorNote({
        config,
        queryParams: {},
        params: {
          community: target.communityId,
          namespace: target.namespaceId,
          package: target.packageId,
        },
        data,
      });
    case "version":
      return createVersionModeratorNote({
        config,
        queryParams: {},
        params: {
          community: target.communityId,
          namespace: target.namespaceId,
          package: target.packageId,
          version_number: target.versionNumber,
        },
        data,
      });
  }
}

function wasEdited(note: ModeratorNote): boolean {
  // Sub-second deltas are the backend's auto_now_add/auto_now skew, not an edit.
  return (
    new Date(note.datetime_updated).getTime() -
      new Date(note.datetime_created).getTime() >
    1000
  );
}

export interface ModeratorNotesFormProps {
  target: ModeratorNotesTarget;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}

export function ModeratorNotesForm({
  target,
  config,
  toast,
}: ModeratorNotesFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<ModeratorNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Which note (by id) is being edited inline, and the editor's draft content.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  // The "add a new note" draft.
  const [newContent, setNewContent] = useState("");
  const [newError, setNewError] = useState<string | null>(null);
  // A single in-flight action at a time, keyed so we can label the right button.
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const isActionInProgressRef = useRef(false);
  const { revalidate } = useRevalidator();

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { moderator_notes } = await readNotes(target, config);
      setNotes(moderator_notes);
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(
          error instanceof Error ? error : new Error(String(error))
        ),
        duration: TOAST_ERROR_DURATION_MS,
      });
    } finally {
      setIsLoading(false);
    }
  }, [target, config, toast]);

  const handleOpenChange = (open: boolean) => {
    if (!open && isActionInProgressRef.current) return;
    setIsOpen(open);
    if (open) {
      setEditingId(null);
      setEditError(null);
      setNewError(null);
      loadNotes();
    }
  };

  const runAction = async (
    key: string,
    fn: () => Promise<unknown>,
    successMessage: string,
    onFieldError?: (message: string) => void
  ) => {
    if (isActionInProgressRef.current) return;
    isActionInProgressRef.current = true;
    setBusyKey(key);
    try {
      await fn();
      toast.addToast({
        csVariant: "success",
        children: successMessage,
        duration: TOAST_SUCCESS_DURATION_MS,
      });
      revalidate();
      await loadNotes();
      return true;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      if (onFieldError) {
        const fieldError = extractApiFieldErrorMessage(error, "content");
        if (fieldError) {
          onFieldError(fieldError);
          return false;
        }
      }
      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error),
        duration: TOAST_ERROR_DURATION_MS,
      });
      return false;
    } finally {
      isActionInProgressRef.current = false;
      setBusyKey(null);
    }
  };

  const handleCreate = async () => {
    if (newContent.trim() === "") return;
    const ok = await runAction(
      "new",
      () => createNote(target, config, newContent),
      "Moderator note added",
      setNewError
    );
    if (ok) setNewContent("");
  };

  const handleSaveEdit = async (note: ModeratorNote) => {
    if (editContent.trim() === "") return;
    const ok = await runAction(
      `edit:${note.id}`,
      () =>
        updateModeratorNote({
          config,
          queryParams: {},
          params: { note_id: note.id },
          data: { content: editContent },
        }),
      "Moderator note updated",
      setEditError
    );
    if (ok) setEditingId(null);
  };

  const handleToggle = (note: ModeratorNote) =>
    runAction(
      `toggle:${note.id}`,
      () =>
        updateModeratorNote({
          config,
          queryParams: {},
          params: { note_id: note.id },
          data: { is_active: !note.is_active },
        }),
      note.is_active ? "Moderator note deactivated" : "Moderator note activated"
    );

  const handleRemove = (note: ModeratorNote) =>
    runAction(
      `remove:${note.id}`,
      () =>
        deleteModeratorNote({
          config,
          queryParams: {},
          params: { note_id: note.id },
          data: {},
        }),
      "Moderator note removed"
    );

  const isBusy = busyKey !== null;

  return (
    <Modal
      csSize="small"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <NewButton csSize="small">
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faNoteSticky} />
          </NewIcon>
          Moderator notes
        </NewButton>
      }
      titleContent={TITLES[target.type]}
      disableBody
    >
      {isOpen ? (
        <Modal.Body className="moderator-note-form__body">
          <NewAlert csVariant="info">
            These notes are public. Multiple notes can be shown at once. Changes
            might take a few minutes to show publicly.
          </NewAlert>

          {isLoading ? (
            <p className="moderator-note-form__label">Loading…</p>
          ) : (
            <>
              <div className="moderator-note-form__block">
                <p className="moderator-note-form__label">
                  {notes.length > 0
                    ? `Existing notes (${notes.length})`
                    : "No notes yet"}
                </p>
                {notes.map((note) => (
                  <div key={note.id} className="moderator-note-form__card">
                    {editingId === note.id ? (
                      <>
                        <NewTextInput
                          value={editContent}
                          onChange={(e) => {
                            setEditContent(e.target.value);
                            setEditError(null);
                          }}
                          csSize="textarea"
                          rootClasses="moderator-note-form__textarea"
                          disabled={isBusy}
                        />
                        {editError ? (
                          <NewAlert csVariant="danger" csSize="small">
                            {editError}
                          </NewAlert>
                        ) : null}
                        <div className="moderator-note-form__actions">
                          <NewButton
                            csSize="small"
                            csVariant="success"
                            disabled={isBusy || editContent.trim() === ""}
                            onClick={() => handleSaveEdit(note)}
                          >
                            {busyKey === `edit:${note.id}`
                              ? "Saving…"
                              : "Save changes"}
                          </NewButton>
                          <NewButton
                            csSize="small"
                            csVariant="secondary"
                            disabled={isBusy}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </NewButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <pre className="moderator-note-form__text">
                          {note.content}
                        </pre>
                        <p className="moderator-note-form__text">
                          {note.is_active
                            ? "Active — shown publicly."
                            : "Inactive — hidden from the public."}
                          {note.version_number
                            ? ` · version ${note.version_number}`
                            : ""}
                        </p>
                        <p className="moderator-note-form__text">
                          Posted{" "}
                          <RelativeTime
                            time={note.datetime_created}
                            suppressHydrationWarning
                          />
                          {wasEdited(note) ? (
                            <>
                              {" · updated "}
                              <RelativeTime
                                time={note.datetime_updated}
                                suppressHydrationWarning
                              />
                            </>
                          ) : null}
                        </p>
                        <div className="moderator-note-form__actions">
                          <NewButton
                            csSize="small"
                            csVariant="secondary"
                            disabled={isBusy}
                            onClick={() => {
                              setEditingId(note.id);
                              setEditContent(note.content);
                              setEditError(null);
                            }}
                          >
                            Edit
                          </NewButton>
                          <NewButton
                            csSize="small"
                            csVariant={note.is_active ? "secondary" : "success"}
                            disabled={isBusy}
                            onClick={() => handleToggle(note)}
                          >
                            {busyKey === `toggle:${note.id}`
                              ? note.is_active
                                ? "Deactivating…"
                                : "Activating…"
                              : note.is_active
                                ? "Deactivate"
                                : "Activate"}
                          </NewButton>
                          <NewButton
                            csSize="small"
                            csVariant="danger"
                            disabled={isBusy}
                            onClick={() => handleRemove(note)}
                          >
                            {busyKey === `remove:${note.id}`
                              ? "Removing…"
                              : "Remove"}
                          </NewButton>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="moderator-note-form__block">
                <p className="moderator-note-form__label">Add a note</p>
                <NewTextInput
                  value={newContent}
                  onChange={(e) => {
                    setNewContent(e.target.value);
                    setNewError(null);
                  }}
                  placeholder="Known bug after the latest game update; fix in progress."
                  csSize="textarea"
                  rootClasses="moderator-note-form__textarea"
                  disabled={isBusy}
                />
                {newError ? (
                  <NewAlert csVariant="danger" csSize="small">
                    {newError}
                  </NewAlert>
                ) : null}
                <div className="moderator-note-form__actions">
                  <NewButton
                    csVariant="success"
                    disabled={isBusy || newContent.trim() === ""}
                    onClick={handleCreate}
                  >
                    {busyKey === "new" ? "Adding…" : "Add note"}
                  </NewButton>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      ) : null}
    </Modal>
  );
}
