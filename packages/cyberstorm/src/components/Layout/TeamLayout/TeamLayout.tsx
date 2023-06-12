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
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { Avatar } from "../../Avatar/Avatar";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface TeamLayoutProps {
  teamId: string;
}

/**
 * Cyberstorm team's landing page Layout
 */
export function TeamLayout(props: TeamLayoutProps) {
  const { teamId } = props;

  const filterItems = {
    mods: { value: undefined, label: "Mods", count: 248 },
    tools: { value: undefined, label: "Tools", count: 18 },
    libraries: { value: undefined, label: "Libraries", count: 84 },
    modpacks: { value: undefined, label: "Modpacks", count: 16 },
    skins: { value: undefined, label: "Skins", count: 127 },
    maps: { value: undefined, label: "Maps", count: 98 },
    tweaks: { value: undefined, label: "Tweaks", count: 227 },
    items: { value: undefined, label: "Items", count: 235 },
    language: { value: undefined, label: "Language", count: 5 },
    audio: { value: undefined, label: "Audio", count: 22 },
    enemies: { value: undefined, label: "Enemies", count: 76 },
  };
  const [, setFilterDummySetter] = useState<{
    [key: string]: {
      label: string;
      count: number;
      value: boolean | undefined;
    };
  }>(filterItems);

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
          image={
            <Avatar
              size="large"
              src={
                teamData.imageSource ? teamData.imageSource : defaultImageSrc
              }
            />
          }
          description={teamData.description}
        />
      }
      leftSidebarContent={
        <FilterItemList
          filterItems={filterItems}
          filterItemsSetter={setFilterDummySetter}
        />
      }
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

const topFilterTags: string[] = [
  "Search...",
  "My search term",
  "Skins",
  "Tweaks",
  "Tools",
];
