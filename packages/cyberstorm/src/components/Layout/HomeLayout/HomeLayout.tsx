import React from "react";
import styles from "./HomeLayout.module.css";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { PackageCard } from "../../PackageCard/PackageCard";
import {
  getCommunityPreviewDummyData,
  getListOfIds,
  getPackagePreviewDummyData,
} from "../../../dummyData/generate";
import { strToHashInt } from "../../../utils/utils";

/**
 * Cyberstorm Home Layout
 */
export const HomeLayout: React.FC = () => {
  return (
    <div>
      <div className={styles.content}>
        <div className={styles.specialContent} />
        <div className={styles.cardContent}>
          {getListOfIds(5, 1).map((id) => {
            return (
              <CommunityCard key={id} communityData={getCommunityData(id)} />
            );
          })}
        </div>
        <div className={styles.smallContent} />
        <div className={styles.cardContent}>
          {getListOfIds(5, 2).map((id) => {
            return (
              <PackageCard
                key={id}
                packageData={getPackageData(id)}
                {...packageCardArgs}
              />
            );
          })}
        </div>
        <div className={styles.mediumContent} />
        <div className={styles.cardContent}>
          {getListOfIds(5, 3).map((id) => {
            return (
              <PackageCard
                key={id}
                packageData={getPackageData(id)}
                {...packageCardArgs}
              />
            );
          })}
        </div>
        <div className={styles.mediumContent} />
      </div>
    </div>
  );
};

HomeLayout.displayName = "HomeLayout";
HomeLayout.defaultProps = {};

function getPackageData(packageId: string) {
  return getPackagePreviewDummyData(strToHashInt(packageId));
}

function getCommunityData(communityId: string) {
  return getCommunityPreviewDummyData(strToHashInt(communityId));
}

const packageCardArgs = {
  imageSrc: "/images/thomas.jpg",
  packageName: "MinisterAPI DeLuxe",
  author: "Gigamies5000",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel ullamcorper sem, in lacinia velit. Maecenas sed augue in tortor fermentum hendrerit.",
  lastUpdated: "3 days ago",
  downloadCount: "4,5M",
  likes: "1,342",
  size: "13 MB",
  categories: ["tweaks", "mods", "client-side"],
  link: "",
  isPinned: true,
};
