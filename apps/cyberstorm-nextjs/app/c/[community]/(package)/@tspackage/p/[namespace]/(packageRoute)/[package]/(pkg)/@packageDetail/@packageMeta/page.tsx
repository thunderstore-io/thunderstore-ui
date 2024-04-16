"use client";
import {
  CopyButton,
  CyberstormLink,
  MetaInfoItemList,
} from "@thunderstore/cyberstorm";
import styles from "./PackageMeta.module.css";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { RelativeTime } from "@thunderstore/cyberstorm/src/components/RelativeTime/RelativeTime";
import {
  formatInteger,
  formatFileSize,
} from "@thunderstore/cyberstorm/src/utils/utils";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);

  return (
    <MetaInfoItemList
      items={[
        {
          key: "last-updated",
          label: "Last Updated",
          content: <RelativeTime time={packageData.last_updated} />,
        },
        {
          key: "first-uploaded",
          label: "First Uploaded",
          content: <RelativeTime time={packageData.datetime_created} />,
        },
        {
          key: "downloads",
          label: "Downloads",
          content: formatInteger(packageData.download_count),
        },
        {
          key: "likes",
          label: "Likes",
          content: formatInteger(packageData.rating_count),
        },
        {
          key: "file-size",
          label: "Size",
          content: formatFileSize(packageData.size),
        },
        {
          key: "dependency-string",
          label: "Dependency string",
          content: (
            <div className={styles.dependencyStringWrapper}>
              <div
                title={packageData.full_version_name}
                className={styles.dependencyString}
              >
                {packageData.full_version_name}
              </div>
              <CopyButton text={packageData.full_version_name} />
            </div>
          ),
        },
        {
          key: "dependants",
          label: "Dependants",
          content: (
            <CyberstormLink
              linkId="PackageDependants"
              community={packageData.community_identifier}
              namespace={packageData.namespace}
              package={packageData.name}
            >
              <div className={styles.dependantsLink}>
                {packageData.dependant_count} other mods
              </div>
            </CyberstormLink>
          ),
        },
      ]}
    />
  );
}
