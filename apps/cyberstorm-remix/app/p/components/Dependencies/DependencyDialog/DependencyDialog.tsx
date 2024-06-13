import { ImageWithFallback, CyberstormLink } from "@thunderstore/cyberstorm";
import styles from "./DependencyDialog.module.css";
import { PackageListingDetails } from "@thunderstore/dapper/types";

export default function DependencyDialog(props: {
  listing: PackageListingDetails;
}) {
  return (
    <div className={styles.root}>
      {props.listing.dependencies.map((depData, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.image}>
            <ImageWithFallback src={depData.icon_url} type="package" square />
          </div>
          <div>
            <div className={styles.title}>
              <CyberstormLink
                linkId="Package"
                community={depData.community_identifier}
                namespace={depData.namespace}
                package={depData.name}
              >
                {depData.name}
              </CyberstormLink>
            </div>
            <div className={styles.description}>{depData.description}</div>
            <p className={styles.preferredVersion}>
              Preferred version:{" "}
              <span className={styles.preferredVersion__version}>
                <CyberstormLink
                  linkId="PackageVersion"
                  community={depData.community_identifier}
                  namespace={depData.namespace}
                  package={depData.name}
                  version={depData.version_number}
                >
                  {depData.version_number}
                </CyberstormLink>
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
