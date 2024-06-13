import {
  CopyButton,
  CyberstormLink,
  MetaInfoItemList,
} from "@thunderstore/cyberstorm";
import styles from "./Meta.module.css";
import { RelativeTime } from "@thunderstore/cyberstorm/src/components/RelativeTime/RelativeTime";
import {
  formatInteger,
  formatFileSize,
} from "@thunderstore/cyberstorm/src/utils/utils";
import { PackageListingDetails } from "@thunderstore/dapper/types";
import { useHydrated } from "remix-utils/use-hydrated";
import { useEffect, useRef, useState } from "react";

export default function Meta(props: { listing: PackageListingDetails }) {
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);
  const [lastUpdated, setLastUpdated] = useState<JSX.Element | undefined>(
    <RelativeTime time={props.listing.last_updated} suppressHydrationWarning />
  );
  const [firstUploaded, setFirstUploaded] = useState<JSX.Element | undefined>(
    <RelativeTime
      time={props.listing.datetime_created}
      suppressHydrationWarning
    />
  );

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;
    setLastUpdated(
      <RelativeTime
        time={props.listing.last_updated}
        suppressHydrationWarning
      />
    );
    setFirstUploaded(
      <RelativeTime
        time={props.listing.datetime_created}
        suppressHydrationWarning
      />
    );
  }, []);

  return (
    <MetaInfoItemList
      items={[
        {
          key: "last-updated",
          label: "Last Updated",
          content: lastUpdated,
        },
        {
          key: "first-uploaded",
          label: "First Uploaded",
          content: firstUploaded,
        },
        {
          key: "downloads",
          label: "Downloads",
          content: formatInteger(props.listing.download_count),
        },
        {
          key: "likes",
          label: "Likes",
          content: formatInteger(props.listing.rating_count),
        },
        {
          key: "file-size",
          label: "Size",
          content: formatFileSize(props.listing.size),
        },
        {
          key: "dependency-string",
          label: "Dependency string",
          content: (
            <div className={styles.dependencyStringWrapper}>
              <div
                title={props.listing.full_version_name}
                className={styles.dependencyString}
              >
                {props.listing.full_version_name}
              </div>
              <CopyButton text={props.listing.full_version_name} />
            </div>
          ),
        },
        {
          key: "dependants",
          label: "Dependants",
          content: (
            <CyberstormLink
              linkId="PackageDependants"
              community={props.listing.community_identifier}
              namespace={props.listing.namespace}
              package={props.listing.name}
            >
              <div className={styles.dependantsLink}>
                {props.listing.dependant_count} other mods
              </div>
            </CyberstormLink>
          ),
        },
      ]}
    />
  );
}
