import React, { useState } from "react";
import styles from "./PackageListLayout.module.css";
import { PackageCard } from "../../PackageCard/PackageCard";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Select } from "../../Select/Select";
import { ContentTop } from "../ContentTop";
import { CommunityInfo } from "../../CommunityInfo/CommunityInfo";
import { LeftColumn } from "../LeftColumn";
import { CommunityLink, CommunityPackagesLink } from "../../Links/Links";
import { BackgroundImage } from "../../BackgroundImage/BackgroundImage";
import { FilterItemList } from "../../FilterItemList/FilterItemList";
import { SearchFilter } from "../../SearchFilter/SearchFilter";
import { Pagination } from "../../Pagination/Pagination";
import { getListOfIds } from "../../../dummyData/generate";
import { CommunityCard } from "../../CommunityCard/CommunityCard";

export interface PackageListLayoutProps {
  title?: string;
}

/**
 * Cyberstorm PackageList Layout
 */
export const PackageListLayout: React.FC<PackageListLayoutProps> = (props) => {
  const { title } = props;

  const [order, setOrder] = useState("1");
  const [page, setPage] = useState(1);

  return (
    <div className={styles.root}>
      <BackgroundImage src={"/images/page_bg.png"} />

      <BreadCrumbs>
        <CommunityLink community={"V-Rising"}>V Rising</CommunityLink>
        <CommunityPackagesLink community={"V-Rising"}>
          Packages
        </CommunityPackagesLink>
      </BreadCrumbs>

      <CommunityInfo title={title} />

      <div>
        <div className={styles.contentWrapper}>
          <LeftColumn content={<FilterItemList filterData={filterData} />} />

          <div className={styles.content}>
            <ContentTop content={<SearchFilter tags={topFilterTags} />} />

            <div className={styles.listTopNavigation}>
              <div className={styles.showing}>
                Showing <strong>1-20</strong> of <strong>327</strong>
              </div>
              <Pagination
                currentPage={page}
                onPageChange={setPage}
                pageSize={20}
                siblingCount={2}
                totalCount={327}
              />
              <Select
                onChange={setOrder}
                options={selectOptions}
                value={order}
              />
            </div>

            <div className={styles.packageCardList}>
              {getListOfIds(20).map((id) => {
                return <PackageCard key={id} packageId={id} />;
              })}
            </div>
            <Pagination
              currentPage={page}
              onPageChange={setPage}
              pageSize={20}
              siblingCount={2}
              totalCount={327}
            />
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

const filterData = [
  { key: "1", label: "Mods", count: 248 },
  { key: "2", label: "Tools", count: 18 },
  { key: "3", label: "Libraries", count: 84 },
  { key: "4", label: "Modpacks", count: 16 },
  { key: "5", label: "Skins", count: 127 },
  { key: "6", label: "Maps", count: 98 },
  { key: "7", label: "Tweaks", count: 227 },
  { key: "8", label: "Items", count: 235 },
  { key: "9", label: "Language", count: 5 },
  { key: "10", label: "Audio", count: 22 },
  { key: "11", label: "Enemies", count: 76 },
];

const topFilterTags: string[] = [
  "Search...",
  "My search term",
  "Skins",
  "Tweaks",
  "Tools",
];
