import styles from "./CommunityListSkeleton.module.css";
import { CommunityCardSkeleton } from "../../CommunityCard/ComunityCardSkeleton";

export const CommunityListSkeleton = () => {
  return (
    <div className={styles.root}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((community) => (
        <CommunityCardSkeleton key={community} />
      ))}
    </div>
  );
};
