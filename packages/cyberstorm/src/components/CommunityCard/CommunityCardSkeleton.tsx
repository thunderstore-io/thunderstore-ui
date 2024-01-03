import styles from "./CommunityCardSkeleton.module.css";

/**
 * Cyberstorm CommunityCardSkeleton component
 */

export const CommunityCardSkeleton = () => {
  return (
    <div className={styles.root}>
      <div className={styles.image} />
      <div className={styles.title} />
      <div className={styles.meta} />
    </div>
  );
};
