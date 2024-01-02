import { SkeletonBox } from "../SkeletonBox/SkeletonBox";
import styles from "./CommunityCardSkeleton.module.css";

/**
 * Cyberstorm CommunityCardSkeleton component
 */

export const CommunityCardSkeleton = () => {
  return (
    <div className={styles.root}>
      <SkeletonBox className={styles.image} />
      <SkeletonBox className={styles.title} />
      <SkeletonBox className={styles.meta} />
    </div>
  );
};
