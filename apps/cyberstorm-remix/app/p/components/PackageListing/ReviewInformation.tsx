import { useEffect, useRef, useState } from "react";

import { classnames } from "@thunderstore/cyberstorm";
import { type PackageListingStatus } from "@thunderstore/dapper/types";

export interface ReviewInformationProps {
  status?: PackageListingStatus;
}

// Internal notes are shown as an overlay on the community banner (see
// packageListing.tsx + packageListing.css), so they don't take sidebar space or
// shift the layout. Collapsed, the card is clamped to the banner's height; when
// the note is longer it can be expanded over the content below (capped at
// min(80vh, 40rem), scrolling past that). The "Show more"/"Show less" toggle
// only appears when the note actually overflows the collapsed area.
export const InternalNotes = ({ status }: ReviewInformationProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const notes = status?.internal_notes || "";

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !notes) return;
    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();
    // ResizeObserver may be missing in older/edge environments; skip the live
    // observer there (the expand toggle still re-measures via this effect).
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [notes, expanded]);

  if (!notes) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className={classnames(
        "package-listing__internal-notes",
        expanded ? "package-listing__internal-notes--expanded" : undefined
      )}
    >
      <div className="package-listing__internal-notes-header">
        <span className="review-package__label">Internal notes</span>
        {overflowing || expanded ? (
          <button
            type="button"
            className="package-listing__internal-notes-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        ) : null}
      </div>
      <pre className="package-listing__internal-notes-text">{notes}</pre>
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
