import { type ReactNode, useEffect, useRef, useState } from "react";

import { classnames } from "@thunderstore/cyberstorm";
import { type PackageListingStatus } from "@thunderstore/dapper/types";

export interface ReviewInformationProps {
  status?: PackageListingStatus;
}

/**
 * A collapsible note card overlaid on the community banner (positioned by
 * packageListing.css), used for the rejection reason and mod internal notes so
 * neither costs sidebar space nor shifts the page. The Show more/less toggle
 * appears only when the text overflows the collapsed height.
 */
function BannerNote(props: {
  label: string;
  text: string;
  danger?: boolean;
  footer?: ReactNode;
}) {
  const { label, text, danger, footer } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();
    // ResizeObserver may be missing in older/edge environments; skip the live
    // observer there (the expand toggle still re-measures via this effect).
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div
      ref={cardRef}
      className={classnames(
        "package-listing__banner-note",
        danger ? "package-listing__banner-note--danger" : undefined,
        expanded ? "package-listing__banner-note--expanded" : undefined
      )}
    >
      <div className="package-listing__banner-note-header">
        <span className="review-package__label">{label}</span>
        {overflowing || expanded ? (
          <button
            type="button"
            className="package-listing__banner-note-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        ) : null}
      </div>
      <pre className="package-listing__banner-note-text">{text}</pre>
      {footer}
    </div>
  );
}

export const InternalNotes = ({ status }: ReviewInformationProps) => {
  const notes = status?.internal_notes || "";

  if (!notes) {
    return null;
  }

  return <BannerNote label="Internal notes" text={notes} />;
};

export const RejectionReason = ({ status }: ReviewInformationProps) => {
  const isRejected = status?.review_status === "rejected";
  const reason = status?.rejection_reason || "";

  if (!reason || !isRejected) {
    return null;
  }

  return (
    <BannerNote
      label="Package rejected"
      text={reason}
      danger
      footer={
        <p className="package-listing__banner-note-text">
          If you think this is a mistake, please reach out to the moderators in{" "}
          <a href="https://discord.thunderstore.io/">our Discord server</a>.
        </p>
      }
    />
  );
};
