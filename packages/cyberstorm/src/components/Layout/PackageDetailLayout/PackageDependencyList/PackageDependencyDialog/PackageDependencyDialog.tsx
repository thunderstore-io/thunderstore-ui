import styles from "../PackageDependencyDialog/PackageDependencyDialog.module.css";
import { Package } from "../../../../../schema";

export interface PackageDependencyDialogProps {
  packages: Package[];
}

export function PackageDependencyDialog(props: PackageDependencyDialogProps) {
  const { packages = [] } = props;
  return (
    <div className={styles.root}>
      {packages.map((packageData, index) => {
        return (
          <div className={styles.item}>
            <img className={styles.image} src={packageData.imageSource} />
            <div>
              <div className={styles.title}>{packageData.name}</div>
              <div className={styles.description}>
                {packageData.shortDescription}
              </div>
              <p className={styles.preferredVersion}>
                Preferred version:{" "}
                <span className={styles.preferredVersion__version}>5.0.2</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

PackageDependencyDialog.displayName = "PackageDependencyDialog";
