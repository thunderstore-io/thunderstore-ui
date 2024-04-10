import { SkeletonBox } from "../SkeletonBox/SkeletonBox";
import styles from "./PackageSearch.module.css";

export const PackageSearchSkeleton = () => {
  return (
    <div className={styles.root}>
      <SkeletonBox className={styles.skeletonSearch} />
      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <SkeletonBox className={styles.skeletonFilters} />
        </div>
        <div className={styles.content}>
          <SkeletonBox className={styles.skeletonContent} />
        </div>
      </div>
    </div>
  );
};
