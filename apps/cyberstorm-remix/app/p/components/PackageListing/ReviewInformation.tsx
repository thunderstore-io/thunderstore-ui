import { type PackageListingStatus } from "@thunderstore/dapper/types";

export interface ReviewInformationProps {
  status: PackageListingStatus;
}

export const InternalNotes = ({ status }: ReviewInformationProps) => {
  const notes = status.internal_notes || "";

  if (!notes) {
    return null;
  }

  return (
    <div className="review-information-card">
      <h4 className="review-package__label">Internal notes</h4>
      <p>{notes}</p>
    </div>
  );
};

export const RejectionReason = ({ status }: ReviewInformationProps) => {
  const isRejected = status.review_status === "rejected";
  const reason = status.rejection_reason || "";

  if (!reason || !isRejected) {
    return null;
  }

  return (
    <div className="review-information-card review-information-card--danger">
      <h4 className="review-package__label">Package rejected</h4>
      <p>{reason}</p>
    </div>
  );
};
