"use client";
import { useState } from "react";
import styles from "./CommunityListLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faSearch,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "../../TextInput/TextInput";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { Select } from "../../Select/Select";
import { getCommunityPreviewDummyData, getListOfIds } from "../../../dummyData";
// import { CommunityPreview } from "../../../schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { GetDapperSingleton } from "@thunderstore/dapper/src/singleton";
import usePromise from "react-promise-suspense";
import { CommunityPreview } from "../../../schema";

/**
 * Cyberstorm CommunityList Layout
 */
export function CommunityListLayout() {
  const [order, setOrder] = useState("1");
  const [searchValue, setSearchValue] = useState("");

  const communities = getCommunities();
  // const communitiesData: CommunityPreview[] = getCommunityDummyData();

  return (
    <BaseLayout
      breadCrumb={<BreadCrumbs>Communities</BreadCrumbs>}
      header={<PageHeader title="Communities" />}
      search={
        <div className={styles.filters}>
          <div className={styles.searchTextInput}>
            <TextInput
              setValue={setSearchValue}
              value={searchValue}
              placeHolder="Search communities..."
              leftIcon={<FontAwesomeIcon icon={faSearch} fixedWidth />}
            />
          </div>
          <div className={styles.searchFilters}>
            <div className={styles.searchFiltersSortLabel}>Sort by</div>
            <Select onChange={setOrder} options={selectOptions} value={order} />
          </div>
        </div>
      }
      mainContent={
        <div className={styles.communityCardList}>
          {communities.results.map((community) => {
            // TODO: Remove once project-wide types are fixed
            const remapped: CommunityPreview = {
              name: community.name,
              namespace: community.identifier,
              imageSource: community.background_image_url,
              packageCount: community.total_package_count,
              downloadCount: community.total_download_count,
              serverCount: -1,
            };
            return (
              <CommunityCard key={community.name} communityData={remapped} />
            );
          })}
        </div>
      }
    />
  );
}

CommunityListLayout.displayName = "CommunityListLayout";

function getCommunities() {
  const dapper = GetDapperSingleton();
  return usePromise(() => dapper.getCommunities(), []);
}

// function getCommunityDummyData() {
//   return getListOfIds(20).map((communityId) => {
//     return getCommunityPreviewDummyData(communityId);
//   });
// }

const selectOptions = [
  {
    value: "1",
    label: "Latest",
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
