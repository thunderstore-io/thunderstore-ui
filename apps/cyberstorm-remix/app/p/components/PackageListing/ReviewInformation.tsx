import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode, useState } from "react";

import { NewIcon, classnames } from "@thunderstore/cyberstorm";
import { type PackageListingStatus } from "@thunderstore/dapper/types";

export interface ReviewInformationProps {
  status?: PackageListingStatus;
}

/**
 * A note card shown above the page header alongside the deprecation notice
 * (styled by packageListing.css), used for the rejection reason and mod
 * internal notes. When `collapsible`, its header becomes a full-width button
 * that toggles the note body.
 */
function BannerNote(props: {
  label: string;
  text: string;
  danger?: boolean;
  footer?: ReactNode;
  collapsible?: boolean;
}) {
  const { label, text, danger, footer, collapsible } = props;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={classnames(
        "package-listing__banner-note",
        danger ? "package-listing__banner-note--danger" : undefined
      )}
    >
      {collapsible ? (
        <button
          type="button"
          className="package-listing__banner-note-header package-listing__banner-note-header--bar"
          aria-expanded={!collapsed}
          aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
          onClick={() => setCollapsed((value) => !value)}
        >
          <span className="review-package__label">{label}</span>
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={collapsed ? faCaretDown : faCaretUp} />
          </NewIcon>
        </button>
      ) : (
        <div className="package-listing__banner-note-header">
          <span className="review-package__label">{label}</span>
        </div>
      )}
      {collapsed ? null : (
        <>
          <pre className="package-listing__banner-note-text">{text}</pre>
          {footer}
        </>
      )}
    </div>
  );
}

export const InternalNotes = ({ status }: ReviewInformationProps) => {
  const notes = status?.internal_notes || "";

  if (!notes) {
    return null;
  }

  return <BannerNote label="Internal notes" text={notes} collapsible />;
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
