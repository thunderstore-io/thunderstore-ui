import styles from "./CommunityListSkeleton.module.css";

export const CommunityListSkeleton = () => {
  return (
    <div className={styles.root}>
      {[1, 2, 3, 4].map((community) => (
        <div key={community} className={styles.card}>{community}</div>
      ))}
    </div>
  );
};
