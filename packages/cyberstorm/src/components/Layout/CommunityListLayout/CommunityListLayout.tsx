"use client";
import { startTransition, useState } from "react";
import styles from "./CommunityListLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownAZ,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "../../TextInput/TextInput";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { Select } from "../../Select/Select";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

type sortOptions = "name" | "datetime_created";

/**
 * Cyberstorm CommunityList Layout
 */
export function CommunityListLayout() {
  const [order, setOrder] = useState<sortOptions>("name");
  const [searchValue, setSearchValue] = useState("");

  const dapper = useDapper();

  // TODO: the page doesn't currently support pagination, while this
  // only returns the first 100 items (we don't have 100 communities).
  const communities = usePromise(dapper.getCommunities, [
    undefined,
    undefined,
    order,
  ]);

  const changeOrder = (v: sortOptions) => startTransition(() => setOrder(v));

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
            {/* TODO: Select only accepts strings as val, could string
                literals be supported in some neat manner?*/}
            <Select
              onChange={changeOrder as (val: string) => null}
              options={selectOptions}
              value={order}
            />
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
    value: "name",
    label: "Name",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faArrowDownAZ} />,
  },
  {
    value: "datetime_created",
    label: "Latest",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faStar} />,
  },
];
