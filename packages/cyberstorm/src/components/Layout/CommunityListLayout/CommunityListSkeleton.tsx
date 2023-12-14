import styles from "./CommunityListSkeleton.module.css";
import { CommunityCardSkeleton } from "../../CommunityCard/CommunityCardSkeleton";
import { range } from "../../../utils/utils";

export const CommunityListSkeleton = () => {
  return (
    <div className={styles.root}>
      {range(1, 12).map((community) => (
        <CommunityCardSkeleton key={community} />
      ))}
    </div>
  );
};
