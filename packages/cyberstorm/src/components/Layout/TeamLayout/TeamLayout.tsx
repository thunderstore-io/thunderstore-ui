"use client";
import { useState } from "react";
import styles from "./TeamLayout.module.css";
import { PackageCard } from "../../PackageCard/PackageCard";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Select } from "../../Select/Select";
import { TeamLink } from "../../Links/Links";
import { FilterItemList } from "../../FilterItemList/FilterItemList";
import { SearchFilter } from "../../SearchFilter/SearchFilter";
import { Pagination } from "../../Pagination/Pagination";
import {
  getListOfIds,
  getPackagePreviewDummyData,
  getTeamDummyData,
} from "../../../dummyData";
import { PackagePreview, Team } from "../../../schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { TeamInfo } from "./TeamInfo/TeamInfo";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { Avatar } from "../../Avatar/Avatar";

export interface TeamLayoutProps {
  teamId: string;
}

/**
 * Cyberstorm team's landing page Layout
 */
export function TeamLayout(props: TeamLayoutProps) {
  const { teamId } = props;

  const [order, setOrder] = useState("1");
  const [page, setPage] = useState(1);

  const packagesData: PackagePreview[] = getPackageData();
  const teamData: Team = getTeamData(teamId);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamLink team={teamData.name}>{teamData.name}</TeamLink>
        </BreadCrumbs>
      }
      header={
        <PageHeader
          title={teamData.name}
          image={<Avatar size="large" src={teamData.imageSource} />}
          description={teamData.description}
        />
      }
      leftSidebarContent={<FilterItemList filterData={filterData} />}
      mainContent={
        <div className={styles.content}>
          <SearchFilter tags={topFilterTags} />

          <div className={styles.listTopNavigation}>
            <div className={styles.showing}>
              Showing <strong>1-20</strong> of <strong>327</strong>
            </div>
            <Select onChange={setOrder} options={selectOptions} value={order} />
          </div>

          <div className={styles.packageCardList}>
            {packagesData.map((packageData) => {
              return (
                <PackageCard key={packageData.name} packageData={packageData} />
              );
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
      }
    />
  );
}

TeamLayout.displayName = "TeamLayout";

function getPackageData() {
  return getListOfIds(20).map((packageId) => {
    return getPackagePreviewDummyData(packageId);
  });
}
function getTeamData(teamId: string) {
  return getTeamDummyData(teamId);
}

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
