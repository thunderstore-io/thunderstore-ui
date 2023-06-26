import styles from "../PackageDependencyDialog/PackageDependencyDialog.module.css";
import { Package } from "../../../../../schema";
import { PackageLink } from "../../../../Links/Links";

export interface PackageDependencyDialogProps {
  packages: Package[];
}

export function PackageDependencyDialog(props: PackageDependencyDialogProps) {
  const { packages = [] } = props;
  return (
    <div className={styles.root}>
      {packages.map((packageData, index) => {
        return (
          <PackageLink
            key={index}
            community={packageData.community}
            namespace={packageData.namespace}
            package={packageData.name}
          >
            <div className={styles.item}>
              <img
                className={styles.image}
                src={packageData.imageSource}
                alt={`Thumbnail of the package ${packageData.name}`}
              />
              <div>
                <div className={styles.title}>{packageData.name}</div>
                <div className={styles.description}>
                  {packageData.shortDescription}
                </div>
                <p className={styles.preferredVersion}>
                  Preferred version:{" "}
                  <span className={styles.preferredVersion__version}>
                    5.0.2
                  </span>
                </p>
              </div>
            </div>
          </PackageLink>
        );
      })}
    </div>
  );
}

PackageDependencyDialog.displayName = "PackageDependencyDialog";
