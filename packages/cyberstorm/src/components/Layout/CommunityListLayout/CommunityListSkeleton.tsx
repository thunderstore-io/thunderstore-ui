import styles from "./CommunityList.module.css";
import { CommunityCardSkeleton } from "../../CommunityCard/CommunityCardSkeleton";
import { range } from "../../../utils/utils";

export const CommunityListSkeleton = () => {
  return (
    <div className={styles.root}>
      {range(1, 18).map((community) => (
        <CommunityCardSkeleton key={community} />
      ))}
    </div>
  );
};
