"use client";

import rootStyles from "../RootLayout.module.css";
import styles from "./CommunitiesLayout.module.css";
import { TextInput, Select } from "@thunderstore/cyberstorm";
import { Suspense, startTransition, useState } from "react";
import { useDebounce } from "use-debounce";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownAZ,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faFire } from "@fortawesome/pro-solid-svg-icons";
import { CommunityList } from "./CommunityList";
import { CommunityListSkeleton } from "./CommunityListSkeleton";

enum SortOptions {
  Name = "name",
  Latest = "-datetime_created",
  Popular = "-aggregated_fields__download_count",
}

export default function Page() {
  // TODO: Split the search to be in its own client component
  // And implement an global provider for storing search values
  const [order, setOrder] = useState(SortOptions.Popular);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  const changeOrder = (v: SortOptions) => startTransition(() => setOrder(v));

  return (
    <main className={rootStyles.main}>
      <div className={styles.filters}>
        <div className={styles.searchTextInput}>
          <TextInput
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder="Search communities..."
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
      <Suspense fallback={<CommunityListSkeleton />}>
        <CommunityList order={order} search={debouncedSearchValue} />
      </Suspense>
    </main>
  );
}

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
  {
    value: SortOptions.Popular,
    label: "Popular",
    leftIcon: <FontAwesomeIcon icon={faFire} />,
  },
];
