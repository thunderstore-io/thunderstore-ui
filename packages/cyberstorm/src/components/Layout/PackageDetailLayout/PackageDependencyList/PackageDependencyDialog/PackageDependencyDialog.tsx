import { PackageDependency } from "@thunderstore/dapper/types";

import styles from "../PackageDependencyDialog/PackageDependencyDialog.module.css";
import { CyberstormLink } from "../../../../Links/Links";
import { ImageWithFallback } from "../../../../ImageWithFallback/ImageWithFallback";

export interface Props {
  packages: PackageDependency[];
}

export const PackageDependencyDialog = (props: Props) => (
  <div className={styles.root}>
    {props.packages.map((packageData, index) => (
      <div key={index} className={styles.item}>
        <div className={styles.image}>
          <ImageWithFallback src={packageData.icon_url} type="package" square />
        </div>
        <div>
          <div className={styles.title}>
            <CyberstormLink
              linkId="Package"
              community={packageData.community_identifier}
              namespace={packageData.namespace}
              package={packageData.name}
            >
              {packageData.name}
            </CyberstormLink>
          </div>
          <div className={styles.description}>{packageData.description}</div>
          <p className={styles.preferredVersion}>
            Preferred version:{" "}
            <span className={styles.preferredVersion__version}>
              <CyberstormLink
                linkId="PackageVersion"
                community={packageData.community_identifier}
                namespace={packageData.namespace}
                package={packageData.name}
                version={packageData.version_number}
              >
                {packageData.version_number}
              </CyberstormLink>
            </span>
          </p>
        </div>
      </div>
    ))}
  </div>
);

PackageDependencyDialog.displayName = "PackageDependencyDialog";
