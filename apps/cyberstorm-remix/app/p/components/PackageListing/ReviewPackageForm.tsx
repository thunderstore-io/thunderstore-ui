import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

import {
  Modal,
  NewAlert,
  NewButton,
  NewIcon,
  NewTag,
  NewTextInput,
  useToast,
} from "@thunderstore/cyberstorm";
import { type PackageListingStatus } from "@thunderstore/dapper/types";
import { faScaleBalanced } from "@thunderstore/icons";
import { type RequestConfig } from "@thunderstore/thunderstore-api";

import {
  type ReviewPackageFormBodyProps,
  type ReviewPackageFormFooterProps,
  useReviewPackageForm,
} from "./useReviewPackageForm";

export interface ReviewPackageFormProps {
  communityId: string;
  namespaceId: string;
  packageId: string;
  packageListingStatus?: PackageListingStatus;
  config: () => RequestConfig;
  toast: ReturnType<typeof useToast>;
}

export function ReviewPackageForm({
  communityId,
  namespaceId,
  packageId,
  packageListingStatus,
  config,
  toast,
}: ReviewPackageFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActionInProgressRef = useRef(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && isActionInProgressRef.current) return;
    setIsOpen(open);
  };

  const { bodyProps, footerProps } = useReviewPackageForm({
    communityId,
    namespaceId,
    packageId,
    packageListingStatus,
    config,
    toast,
    isActionInProgressRef,
    enabled: isOpen,
  });

  return (
    <Modal
      csSize="small"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <NewButton csSize="small">
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faScaleBalanced} />
          </NewIcon>
          Review Package
        </NewButton>
      }
      titleContent="Review Package"
      disableBody
    >
      {isOpen ? (
        <>
          <ReviewPackageFormBody {...bodyProps} />
          <ReviewPackageFormFooter {...footerProps} />
        </>
      ) : null}
    </Modal>
  );
}

function ReviewPackageFormBody({
  reviewStatus,
  reviewStatusColor,
  rejectionReason,
  internalNotes,
  fieldErrors,
  isActionInProgress,
  onRejectionReasonChange,
  onInternalNotesChange,
}: ReviewPackageFormBodyProps) {
  return (
    <Modal.Body className="review-package__body">
      <NewAlert csVariant="info">
        Changes might take several minutes to show publicly! Info shown below is
        always up to date.
      </NewAlert>

      <div className="review-package__block">
        <p className="review-package__label">Review status</p>
        <NewTag csVariant={reviewStatusColor} csModifiers={["dark"]}>
          {reviewStatus}
        </NewTag>
      </div>

      <div className="review-package__block">
        <p className="review-package__label">Reject reason (saved on reject)</p>
        <NewTextInput
          value={rejectionReason}
          onChange={(e) => onRejectionReasonChange(e.target.value)}
          placeholder="Invalid submission"
          csSize="textarea"
          rootClasses="review-package__textarea"
          disabled={isActionInProgress}
        />
        {fieldErrors?.rejection_reason?.[0] && (
          <NewAlert csVariant="danger" csSize="small">
            {fieldErrors.rejection_reason[0]}
          </NewAlert>
        )}
      </div>

      <div className="review-package__block">
        <p className="review-package__label">Internal notes</p>
        <NewTextInput
          value={internalNotes}
          onChange={(e) => onInternalNotesChange(e.target.value)}
          placeholder=".exe requires manual review"
          csSize="textarea"
          rootClasses="review-package__textarea"
          disabled={isActionInProgress}
        />
        {fieldErrors?.internal_notes?.[0] && (
          <NewAlert csVariant="danger" csSize="small">
            {fieldErrors.internal_notes[0]}
          </NewAlert>
        )}
      </div>
    </Modal.Body>
  );
}

function ReviewPackageFormFooter({
  isRejecting,
  isApproving,
  isActionInProgress,
  onReject,
  onApprove,
}: ReviewPackageFormFooterProps) {
  return (
    <Modal.Footer className="review-package__footer">
      <NewButton
        csVariant="danger"
        disabled={isActionInProgress}
        onClick={onReject}
      >
        {isRejecting ? "Rejecting…" : "Reject"}
      </NewButton>

      <NewButton
        csVariant="success"
        disabled={isActionInProgress}
        onClick={onApprove}
      >
        {isApproving ? "Approving…" : "Approve"}
      </NewButton>
    </Modal.Footer>
  );
}
