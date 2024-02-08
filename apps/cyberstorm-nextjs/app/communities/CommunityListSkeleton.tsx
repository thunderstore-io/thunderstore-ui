import { range } from "@thunderstore/cyberstorm/src/utils/utils";
import styles from "./CommunityList.module.css";
import { CommunityCardSkeleton } from "@thunderstore/cyberstorm/src/components/CommunityCard/CommunityCardSkeleton";

export const CommunityListSkeleton = () => {
  return (
    <div className={styles.root}>
      {range(1, 18).map((community) => (
        <CommunityCardSkeleton key={community} />
      ))}
    </div>
  );
};
