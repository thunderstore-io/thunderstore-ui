import styles from "./CommunityCardSkeleton.module.css";

/**
 * Cyberstorm CommunityCardSkeleton component
 */

export const CommunityCardSkeleton = () => {
  return (
    <div className={styles.root}>
      <div className={styles.imageWrapper}></div>
      <div className={styles.title}></div>
      <div className={styles.metaItemList}></div>
    </div>
  );
};
