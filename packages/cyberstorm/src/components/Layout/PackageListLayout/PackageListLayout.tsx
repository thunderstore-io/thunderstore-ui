import React, { useState } from "react";
import styles from "./PackageListLayout.module.css";
import { PackageCard } from "../../PackageCard/PackageCard";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Select } from "../../Select/Select";
import { PackageListTopFilter } from "./PackageListTopFilter";
import { PackageListCommunityInfo } from "./PackageListCommunityInfo";
import { PackageListLeftFilter } from "./PackageListLeftFilter";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";

export interface PackageListLayoutProps {
  title?: string;
}

/**
 * Cyberstorm PackageList Layout
 */
export const PackageListLayout: React.FC<PackageListLayoutProps> = (props) => {
  const { title } = props;

  const [order, setOrder] = useState("1");

  return (
    <div>
      <BreadCrumbs>
        <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
        <CommunityPackagesLink community={"V-Rising"}>
          Packages
        </CommunityPackagesLink>
      </BreadCrumbs>

      <PackageListCommunityInfo title={title} />

      <div>
        <div className={styles.contentWrapper}>
          <PackageListLeftFilter filterData={filterData} />
          <div className={styles.content}>
            <PackageListTopFilter tags={topFilterTags} />

            <div className={styles.listTopNavigation}>
              <div className={styles.showing}>
                Showing <strong>1-20</strong> of <strong>327</strong>
              </div>
              <div className={styles.placeholder}>Pagination</div>
              <Select
                onChange={setOrder}
                options={selectOptions}
                value={order}
              />
            </div>

            <div>
              <div className={styles.packageCardList}>
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
                <PackageCard {...packageCardArgs} />
              </div>
            </div>
            <div className={styles.placeholder}>Pagination</div>
          </div>
        </div>
      </div>
    </div>
  );
};

PackageListLayout.displayName = "PackageListLayout";
PackageListLayout.defaultProps = { title: "V Rising" };

const selectOptions = [
  {
    value: "1",
    label: "Newest",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faStar} />,
  },
  {
    value: "2",
    label: "Hottest",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faFire} />,
  },
  {
    value: "3",
    label: "Top rated",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faThumbsUp} />,
  },
];

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

const filterData = [
  { key: "1", label: "Mods", count: 248 },
  { key: "2", label: "Tools", count: 18 },
  { key: "3", label: "Libraries", count: 84 },
  { key: "4", label: "Modpacks", count: 16 },
  { key: "5", label: "Skins", count: 127 },
  { key: "5", label: "Maps", count: 98 },
  { key: "5", label: "Tweaks", count: 227 },
  { key: "5", label: "Items", count: 235 },
  { key: "5", label: "Language", count: 5 },
  { key: "5", label: "Audio", count: 22 },
  { key: "5", label: "Enemies", count: 76 },
];

const topFilterTags: string[] = [
  "Search...",
  "My search term",
  "Skins",
  "Tweaks",
  "Tools",
];
