"use client";
import { useState } from "react";
import styles from "./PackageListLayout.module.css";
import { PackageCard } from "../../PackageCard/PackageCard";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faSearch,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { Select } from "../../Select/Select";
import { CommunitiesLink, CommunityLink } from "../../Links/Links";
import { FilterItemList } from "../../FilterItemList/FilterItemList";
import { SearchFilter } from "../../SearchFilter/SearchFilter";
import { Pagination } from "../../Pagination/Pagination";
import {
  getCommunityDummyData,
  getListOfIds,
  getPackagePreviewDummyData,
} from "../../../dummyData";
import { PackagePreview } from "../../../schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { Title } from "../../Title/Title";
import { TextInput } from "../../TextInput/TextInput";
import { Button } from "../../Button/Button";
import { faGrid, faList } from "@fortawesome/pro-light-svg-icons";
import { MetaItem } from "../../MetaItem/MetaItem";
import { formatInteger } from "../../../utils/utils";
import {
  faBoxOpen,
  faDownload,
  faServer,
} from "@fortawesome/pro-regular-svg-icons";
import { Link } from "../../Link/Link";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { CommunityImage } from "../../CommunityImage/CommunityImage";

export interface PackageListLayoutProps {
  isLoading: boolean;
  communityId: string;
  packageData?: PackagePreview[];
}

/**
 * Cyberstorm PackageList Layout
 */
export function PackageListLayout(props: PackageListLayoutProps) {
  const { communityId, packageData, isLoading } = props;

  const [order, setOrder] = useState("1");
  const [page, setPage] = useState(1);

  const packagesData: PackagePreview[] = packageData
    ? packageData
    : getPackageData();
  const communityData = getCommunityData(communityId);

  return (
    <BaseLayout
      backGroundImageSource={
        communityData.backgroundImageSource
          ? communityData.backgroundImageSource
          : "/images/community_bg.png"
      }
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={communityData.name}>
            {communityData.name}
          </CommunityLink>
        </BreadCrumbs>
      }
      header={
        <PageHeader
          title={communityData.name}
          description={communityData.description}
          image={
            <CommunityImage
              src={
                communityData.imageSource
                  ? communityData.imageSource
                  : "/images/game.png"
              }
            />
          }
          meta={[
            <MetaItem
              label={formatInteger(communityData.packageCount) + " Packages"}
              icon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
              colorScheme="tertiary"
              size="large"
            />,
            <MetaItem
              label={formatInteger(communityData.downloadCount) + " Downloads"}
              icon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
              colorScheme="tertiary"
              size="large"
            />,
            <MetaItem
              label={formatInteger(communityData.serverCount) + " Servers"}
              icon={<FontAwesomeIcon icon={faServer} fixedWidth />}
              colorScheme="tertiary"
              size="large"
            />,
            <Link
              leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
              label="Join our community"
              externalUrl="https://discord.gg/5MbXZvd"
            />,
          ]}
        />
      }
      leftSidebarContent={<FilterItemList filterData={filterData} />}
      search={
        <TextInput
          placeHolder="Filter mods..."
          leftIcon={<FontAwesomeIcon icon={faSearch} fixedWidth />}
        />
      }
      mainContent={
        <div className={styles.content}>
          <div className={styles.listTopNavigation}>
            <div className={styles.showing}>
              Showing <strong>1-20</strong> of <strong>327</strong>
            </div>

            <SearchFilter tags={topFilterTags} />

            <div className={styles.displayAndSort}>
              <div className={styles.displayButtons}>
                <Button
                  leftIcon={<FontAwesomeIcon icon={faGrid} fixedWidth />}
                />
                <Button
                  leftIcon={<FontAwesomeIcon icon={faList} fixedWidth />}
                />
              </div>
              <div className={styles.sort}>
                <div className={styles.sortLabel}>Sort By</div>
                <Select
                  onChange={setOrder}
                  options={selectOptions}
                  value={order}
                />
              </div>
            </div>
          </div>

          <div className={styles.packageCardList}>
            {isLoading ? (
              <Title size={"smaller"} text="Loading..." />
            ) : (
              packagesData.map((packageData) => {
                return (
                  <PackageCard
                    key={packageData.name}
                    packageData={packageData}
                  />
                );
              })
            )}
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

PackageListLayout.displayName = "PackageListLayout";

function getPackageData() {
  return getListOfIds(20).map((packageId) => {
    return getPackagePreviewDummyData(packageId);
  });
}
function getCommunityData(communityId: string) {
  return getCommunityDummyData(communityId);
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
