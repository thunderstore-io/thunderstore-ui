import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode, Suspense, useState } from "react";
import { Await } from "react-router";

import { NewIcon, classnames } from "@thunderstore/cyberstorm";
import {
  type PackageListingStatus,
  type PackageScanResult,
} from "@thunderstore/dapper/types";

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
  /** Shown after the label, unbolded. */
  labelNote?: string;
  /** Shown right-aligned on the header. */
  aside?: string;
  text: string;
  danger?: boolean;
  footer?: ReactNode;
  collapsible?: boolean;
}) {
  const { label, labelNote, aside, text, danger, footer, collapsible } = props;
  const [collapsed, setCollapsed] = useState(false);
  const labelElement = (
    <span className="review-package__label">
      {label}
      {labelNote ? (
        <span className="package-listing__banner-note-label-note">
          {" "}
          {labelNote}
        </span>
      ) : null}
    </span>
  );
  const asideElement = aside ? (
    <span className="package-listing__banner-note-aside">{aside}</span>
  ) : null;

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
          {labelElement}
          {asideElement}
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={collapsed ? faCaretDown : faCaretUp} />
          </NewIcon>
        </button>
      ) : (
        <div className="package-listing__banner-note-header">
          {labelElement}
          {asideElement}
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

/** YYYY-MM-DD and the locale's own time style, in the viewer's time zone. */
function formatLocalDateTime(value: string): string {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day.map(pad).join("-")}, ${time}`;
}

/**
 * Mods only: the newest scan that found something. `otherVersionNote` marks a
 * scan that is not for `pageVersion`, the version the page shows.
 */
export const ScanResult = ({
  result,
  pageVersion,
  otherVersionNote,
}: {
  result?: PackageScanResult;
  pageVersion?: string;
  otherVersionNote: string;
}) => {
  const scan = result?.scan_result;
  const files = Object.entries(scan?.findings ?? {});

  if (!scan || !files.length) {
    return null;
  }

  const text = [
    ...(scan.context.length ? [...scan.context, ""] : []),
    ...files.flatMap(([fileName, findings]) => [
      fileName,
      ...findings.map((finding) => `  ${finding}`),
    ]),
  ].join("\n");

  const isPageVersion = !pageVersion || pageVersion === scan.version_number;

  return (
    <BannerNote
      label={`Scan Result for v${scan.version_number}`}
      labelNote={isPageVersion ? undefined : otherVersionNote}
      aside={formatLocalDateTime(scan.datetime_created)}
      text={text}
      collapsible
    />
  );
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

type Deferred<T> = Promise<T | undefined> | T | undefined;

/**
 * Rejection reason plus the mods-only internal notes and scan result, shown
 * above the page header.
 */
export function ReviewBanners(props: {
  listingStatus: Deferred<PackageListingStatus>;
  scanResult: Deferred<PackageScanResult>;
  pageVersion?: string;
  otherVersionNote: string;
}) {
  const { listingStatus, scanResult, pageVersion, otherVersionNote } = props;

  return (
    <Suspense fallback={null}>
      <Await resolve={listingStatus} errorElement={<></>}>
        {(resolvedListingStatus) => (
          <div className="package-listing__banner-notes">
            <RejectionReason status={resolvedListingStatus} />
            <InternalNotes status={resolvedListingStatus} />
            <Suspense fallback={null}>
              <Await resolve={scanResult} errorElement={<></>}>
                {(resolvedScanResult) => (
                  <ScanResult
                    result={resolvedScanResult}
                    pageVersion={pageVersion}
                    otherVersionNote={otherVersionNote}
                  />
                )}
              </Await>
            </Suspense>
          </div>
        )}
      </Await>
    </Suspense>
  );
}
