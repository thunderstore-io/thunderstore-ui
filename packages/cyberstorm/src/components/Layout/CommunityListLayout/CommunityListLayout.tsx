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
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

/**
 * Cyberstorm CommunityList Layout
 */
export function CommunityListLayout() {
  const [order, setOrder] = useState("1");
  const [searchValue, setSearchValue] = useState("");

  const dapper = useDapper();
  const communities = usePromise(dapper.getCommunities, []);

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
          {communities.results.map((community) => (
            <CommunityCard key={community.identifier} community={community} />
          ))}
        </div>
      }
    />
  );
}

CommunityListLayout.displayName = "CommunityListLayout";

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
