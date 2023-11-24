import { Package } from "@thunderstore/dapper/types";

import styles from "../PackageDetailLayout.module.css";
import { CopyButton } from "../../../CopyButton/CopyButton";
import { PackageDependantsLink } from "../../../Links/Links";
import { MetaInfoItemList } from "../../../MetaInfoItemList/MetaInfoItemList";
import { formatFileSize, formatInteger } from "../../../../utils/utils";

interface Props {
  package: Package;
}

export const PackageMetaItems = (props: Props) => (
  <MetaInfoItemList
    items={[
      {
        key: "last-updated",
        label: "Last Updated",
        content: props.package.last_updated,
      },
      {
        key: "first-uploaded",
        label: "First Uploaded",
        content: props.package.datetime_created,
      },
      {
        key: "downloads",
        label: "Downloads",
        content: formatInteger(props.package.download_count),
      },
      {
        key: "likes",
        label: "Likes",
        content: formatInteger(props.package.rating_count),
      },
      {
        key: "file-size",
        label: "Size",
        content: formatFileSize(props.package.size),
      },
      {
        key: "dependency-string",
        label: "Dependency string",
        content: (
          <div className={styles.dependencyStringWrapper}>
            <div
              title={props.package.full_version_name}
              className={styles.dependencyString}
            >
              {props.package.full_version_name}
            </div>
            <CopyButton text={props.package.full_version_name} />
          </div>
        ),
      },
      {
        key: "dependants",
        label: "Dependants",
        content: (
          <PackageDependantsLink
            community={props.package.community_identifier}
            namespace={props.package.namespace}
            package={props.package.name}
          >
            <div className={styles.dependantsLink}>
              {props.package.dependant_count} other mods
            </div>
          </PackageDependantsLink>
        ),
      },
    ]}
  />
);

PackageMetaItems.displayName = "PackageMetaItems";
