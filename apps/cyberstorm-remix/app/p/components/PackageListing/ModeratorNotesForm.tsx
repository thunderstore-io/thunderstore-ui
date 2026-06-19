import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
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
  createListingModeratorNote,
  extractApiErrorMessage,
  extractApiFieldErrorMessage,
  updateModeratorNote,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

const TOAST_SUCCESS_DURATION_MS = 4000;
const TOAST_ERROR_DURATION_MS = 8000;

export interface ModeratorNotesFormProps {
  communityId: string;
  namespaceId: string;
  packageId: string;
  // The single note resolved for this page (may be a listing-wide note, a
  // version fallback note, or null).
  note: ModeratorNote | null;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}

export function ModeratorNotesForm({
  communityId,
  namespaceId,
  packageId,
  note,
  config,
  toast,
}: ModeratorNotesFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActionInProgressRef = useRef(false);
  const { revalidate } = useRevalidator();

  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // This form manages the listing-wide note only. A version-fallback note shown
  // on the page is managed from its own version's page.
  const listingNote = note && note.target_type === "listing" ? note : null;
  const isBusy = isCreating || isDeactivating;

  const handleOpenChange = (open: boolean) => {
    if (!open && isActionInProgressRef.current) return;
    setIsOpen(open);
  };

  const createAction = ApiAction({
    endpoint: createListingModeratorNote,
    onSubmitSuccess: () => {
      setContent("");
      setContentError(null);
      toast.addToast({
        csVariant: "success",
        children: "Moderator note saved",
        duration: TOAST_SUCCESS_DURATION_MS,
      });
      revalidate();
    },
    onSubmitError: (error) => {
      const fieldError = extractApiFieldErrorMessage(error, "content");
      if (fieldError) {
        setContentError(fieldError);
        return;
      }
      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error),
        duration: TOAST_ERROR_DURATION_MS,
      });
    },
  });

  const deactivateAction = ApiAction({
    endpoint: updateModeratorNote,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: "Moderator note turned off",
        duration: TOAST_SUCCESS_DURATION_MS,
      });
      revalidate();
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error),
        duration: TOAST_ERROR_DURATION_MS,
      });
    },
  });

  const handleCreate = async () => {
    if (isActionInProgressRef.current) return;

    isActionInProgressRef.current = true;
    setIsCreating(true);
    try {
      await createAction({
        config,
        params: {
          community: communityId,
          namespace: namespaceId,
          package: packageId,
        },
        queryParams: {},
        data: { content },
      });
    } finally {
      isActionInProgressRef.current = false;
      setIsCreating(false);
    }
  };

  const handleDeactivate = async () => {
    if (!listingNote || isActionInProgressRef.current) return;

    isActionInProgressRef.current = true;
    setIsDeactivating(true);
    try {
      await deactivateAction({
        config,
        params: { note_id: listingNote.id },
        queryParams: {},
        data: { is_active: false },
      });
    } finally {
      isActionInProgressRef.current = false;
      setIsDeactivating(false);
    }
  };

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
      titleContent="Moderator notes"
      disableBody
    >
      {isOpen ? (
        <>
          <Modal.Body className="review-package__body">
            <NewAlert csVariant="info">
              These notes are public. Changes might take a few minutes to show
              publicly.
            </NewAlert>

            {listingNote ? (
              <div className="review-package__block">
                <p className="review-package__label">Current note</p>
                <div className="review-information-card">
                  <pre className="review-information-card__text">
                    {listingNote.content}
                  </pre>
                  <p className="review-information-card__text">
                    Posted{" "}
                    <RelativeTime
                      time={listingNote.datetime_created}
                      suppressHydrationWarning
                    />
                  </p>
                  <NewButton
                    csSize="small"
                    csVariant="danger"
                    disabled={isBusy}
                    onClick={handleDeactivate}
                  >
                    {isDeactivating ? "Turning off…" : "Turn off"}
                  </NewButton>
                </div>
              </div>
            ) : null}

            <div className="review-package__block">
              <p className="review-package__label">
                {listingNote ? "Replace note" : "Add a note"}
              </p>
              {listingNote ? (
                <NewAlert csVariant="warning" csSize="small">
                  A note already exists for this listing. Saving a new one will
                  turn off the current note.
                </NewAlert>
              ) : null}
              <NewTextInput
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setContentError(null);
                }}
                placeholder="Known bug after the latest game update; fix in progress."
                csSize="textarea"
                rootClasses="review-package__textarea"
                disabled={isCreating}
              />
              {contentError ? (
                <NewAlert csVariant="danger" csSize="small">
                  {contentError}
                </NewAlert>
              ) : null}
            </div>
          </Modal.Body>

          <Modal.Footer className="review-package__footer">
            <NewButton
              csVariant="success"
              disabled={isBusy || content.trim() === ""}
              onClick={handleCreate}
            >
              {isCreating ? "Saving…" : "Save note"}
            </NewButton>
          </Modal.Footer>
        </>
      ) : null}
    </Modal>
  );
}
