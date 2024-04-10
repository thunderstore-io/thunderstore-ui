import { SkeletonBox } from "@thunderstore/cyberstorm";
import styles from "./CommunityCard.module.css";

export const CommunityCardSkeleton = () => {
  return (
    <div className={styles.root}>
      <div className={styles.image}>
        <SkeletonBox className={styles.skeletonImage} />
      </div>
      <div className={styles.info}>
        <SkeletonBox className={styles.skeletonTitle} />
        <div className={styles.meta}>
          <SkeletonBox className={styles.skeletonMetas} />
          <SkeletonBox className={styles.skeletonMetas} />
        </div>
      </div>
    </div>
  );
};
