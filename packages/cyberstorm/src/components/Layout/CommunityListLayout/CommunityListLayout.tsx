"use client";
import { Suspense, startTransition, useState } from "react";
import styles from "./CommunityListLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownAZ,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "../../TextInput/TextInput";
import { Select } from "../../Select/Select";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDebounce } from "use-debounce";
import { CommunityList } from "./CommunityList";
import { Loading } from "./Loading";

export enum SortOptions {
  Name = "name",
  Latest = "-datetime_created",
}

/**
 * Cyberstorm CommunityList Layout
 */
export function CommunityListLayout() {
  const [order, setOrder] = useState(SortOptions.Name);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  const changeOrder = (v: SortOptions) => startTransition(() => setOrder(v));

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
              leftIcon={<FontAwesomeIcon icon={faSearch} />}
            />
          </div>
          <div className={styles.searchFilters}>
            <div className={styles.searchFiltersSortLabel}>Sort by</div>
            <Select
              onChange={changeOrder}
              options={selectOptions}
              value={order}
            />
          </div>
        </div>
      }
      mainContent={
        <Suspense fallback={<Loading />}>
          <CommunityList order={order} search={debouncedSearchValue} />
        </Suspense>
      }
    />
  );
}

CommunityListLayout.displayName = "CommunityListLayout";

const selectOptions = [
  {
    value: SortOptions.Name,
    label: "Name",
    leftIcon: <FontAwesomeIcon icon={faArrowDownAZ} />,
  },
  {
    value: SortOptions.Latest,
    label: "Latest",
    leftIcon: <FontAwesomeIcon icon={faStar} />,
  },
];
