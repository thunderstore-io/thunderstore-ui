import styles from "../PackageDependencyDialog/PackageDependencyDialog.module.css";
import { PackageDependency } from "../../../../../schema";
import { PackageLink, PackageVersionLink } from "../../../../Links/Links";

export interface PackageDependencyDialogProps {
  packages: PackageDependency[];
}

export function PackageDependencyDialog(props: PackageDependencyDialogProps) {
  const { packages = [] } = props;
  return (
    <div className={styles.root}>
      {packages.map((packageData, index) => {
        return (
          <div key={index} className={styles.item}>
            <img
              className={styles.image}
              src={packageData.imageSource}
              alt={`Thumbnail of the package ${packageData.name}`}
            />
            <div>
              <div className={styles.title}>
                <PackageLink
                  community={packageData.community}
                  namespace={packageData.namespace}
                  package={packageData.name}
                >
                  {packageData.name}
                </PackageLink>
              </div>
              <div className={styles.description}>
                {packageData.shortDescription}
              </div>
              <p className={styles.preferredVersion}>
                Preferred version:{" "}
                <span className={styles.preferredVersion__version}>
                  <PackageVersionLink
                    community={packageData.community}
                    namespace={packageData.namespace}
                    package={packageData.name}
                    version={packageData.version}
                  >
                    {packageData.version}
                  </PackageVersionLink>
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

PackageDependencyDialog.displayName = "PackageDependencyDialog";
