import { SkeletonBox } from "@thunderstore/cyberstorm";
import { SkeletonBoxes } from "@thunderstore/cyberstorm/src/components/SkeletonBoxes/SkeletonBoxes";
import styles from "./PackageList.module.css";

export function PackageListSkeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <SkeletonBox className={styles.packageCountSkeletonBar} />
        <SkeletonBox className={styles.packageOrderBySkeletonBar} />
      </div>

      <div className={styles.packages}>
        <SkeletonBoxes className={styles.packageCardSkeleton} count={20} />
      </div>

      <div className={styles.packagePaginationSkeletonContainer}>
        <SkeletonBox className={styles.packagePaginationSkeletonBar} />
      </div>
    </div>
  );
}

PackageListSkeleton.displayName = "PackageListSkeleton";
