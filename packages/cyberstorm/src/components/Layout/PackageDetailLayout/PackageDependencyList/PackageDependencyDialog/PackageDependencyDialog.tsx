import { PackageDependency } from "@thunderstore/dapper/types";

import styles from "../PackageDependencyDialog/PackageDependencyDialog.module.css";
import { PackageLink, PackageVersionLink } from "../../../../Links/Links";

export interface Props {
  packages: PackageDependency[];
}

export const PackageDependencyDialog = (props: Props) => (
  <div className={styles.root}>
    {props.packages.map((packageData, index) => (
      <div key={index} className={styles.item}>
        <img
          className={styles.image}
          src={packageData.icon_url ?? undefined}
          alt=""
        />
        <div>
          <div className={styles.title}>
            <PackageLink
              community={packageData.community_identifier}
              namespace={packageData.namespace}
              package={packageData.name}
            >
              {packageData.name}
            </PackageLink>
          </div>
          <div className={styles.description}>{packageData.description}</div>
          <p className={styles.preferredVersion}>
            Preferred version:{" "}
            <span className={styles.preferredVersion__version}>
              <PackageVersionLink
                community={packageData.community_identifier}
                namespace={packageData.namespace}
                package={packageData.name}
                version={packageData.version_number}
              >
                {packageData.version_number}
              </PackageVersionLink>
            </span>
          </p>
        </div>
      </div>
    ))}
  </div>
);

PackageDependencyDialog.displayName = "PackageDependencyDialog";
