import React from "react";
import styles from "./HomeLayout.module.css";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { PackageCard } from "../../PackageCard/PackageCard";

/**
 * Cyberstorm Home Layout
 */
export const HomeLayout: React.FC = () => {
  return (
    <div>
      <div className={styles.content}>
        <div className={styles.specialContent} />
        <div className={styles.cardContent}>
          <CommunityCard />
          <CommunityCard />
          <CommunityCard />
          <CommunityCard />
          <CommunityCard />
          <CommunityCard />
        </div>
        <div className={styles.smallContent} />
        <div className={styles.cardContent}>
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
        </div>
        <div className={styles.mediumContent} />
        <div className={styles.cardContent}>
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
          <PackageCard {...packageCardArgs} />
        </div>
        <div className={styles.mediumContent} />
      </div>
    </div>
  );
};

HomeLayout.displayName = "HomeLayout";
HomeLayout.defaultProps = {};

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
