import styles from "./CommunityList.module.css";
import { CommunityCardSkeleton, range } from "@thunderstore/cyberstorm";

export const CommunityListSkeleton = () => {
  return (
    <div className={styles.root}>
      {range(1, 18).map((community) => (
        <CommunityCardSkeleton key={community} />
      ))}
    </div>
  );
};
