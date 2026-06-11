import { type PackageListingStatus } from "@thunderstore/dapper/types";

export interface ReviewInformationProps {
  status?: PackageListingStatus;
}

export const InternalNotes = ({ status }: ReviewInformationProps) => {
  if (!status) {
    return null;
  }

  const notes = status.internal_notes || "";

  if (!notes) {
    return null;
  }

  return (
    <div className="review-information-card">
      <h4 className="review-package__label">Internal notes</h4>
      <pre className="review-information-card__text">{notes}</pre>
    </div>
  );
};

export const RejectionReason = ({ status }: ReviewInformationProps) => {
  if (!status) {
    return null;
  }

  const isRejected = status.review_status === "rejected";
  const reason = status.rejection_reason || "";

  if (!reason || !isRejected) {
    return null;
  }

  return (
    <div className="review-information-card review-information-card--danger">
      <h4 className="review-package__label">Package rejected</h4>
      <pre className="review-information-card__text">{reason}</pre>
      <p className="review-information-card__text">
        If you think this is a mistake, please reach out to the moderators in{" "}
        <a href="https://discord.thunderstore.io/">our Discord server</a>.
      </p>
    </div>
  );
};
