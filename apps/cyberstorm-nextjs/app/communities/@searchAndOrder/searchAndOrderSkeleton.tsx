import { SkeletonBox } from "@thunderstore/cyberstorm";
import styles from "./SearchAndOrder.module.css";

export const SearchAndOrderSkeleton = () => {
  return (
    <div className={styles.root}>
      <div className={styles.searchTextInput}>
        <SkeletonBox className={styles.skeletonSearch} />
      </div>
      <div className={styles.searchFilters}>
        <SkeletonBox className={styles.skeletonSort} />
      </div>
    </div>
  );
};
