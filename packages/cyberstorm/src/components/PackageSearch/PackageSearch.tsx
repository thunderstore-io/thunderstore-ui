"use client";
import {
  faClock,
  faDownload,
  faSearch,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PackageCategory } from "@thunderstore/dapper/types";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { CategoryMenu } from "./CategoryMenu/CategoryMenu";
import { CategoryTagCloud } from "./CategoryTagCloud/CategoryTagCloud";
import styles from "./PackageSearch.module.css";
import { CategorySelection } from "./types";
import { Icon } from "../Icon/Icon";
import { Pagination } from "../Pagination/Pagination";
import { PackageList } from "../PackageList/PackageList";
import { Select } from "../Select/Select";
import { TextInput } from "../TextInput/TextInput";

interface Props {
  communityId?: string;
  packageCategories: PackageCategory[];
  teamId?: string;
  userId?: string;
}

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const {
    communityId,
    packageCategories: allCategories,
    teamId,
    userId,
  } = props;

  const [order, setOrder] = useState(SortOptions.Updated);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);
  const [categories, setCategories] = useState<CategorySelection[]>(
    allCategories
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((c) => ({ ...c, selection: "off" }))
  );

  return (
    <div className={styles.root}>
      <TextInput
        placeHolder="Filter Mods..."
        value={searchValue}
        setValue={setSearchValue}
        leftIcon={
          <Icon>
            <FontAwesomeIcon icon={faSearch} />
          </Icon>
        }
      />

      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <CategoryMenu categories={categories} setCategories={setCategories} />
        </div>

        <div className={styles.content}>
          <div className={styles.listTopNavigation}>
            <CategoryTagCloud
              categories={categories}
              setCategories={setCategories}
            />

            <div className={styles.showing}>
              {/* TODO: use real values */}
              Showing <strong>1-20</strong> of <strong>327</strong> results
              {debouncedSearchValue !== ""
                ? ` for "${debouncedSearchValue}"`
                : ""}
            </div>

            <div className={styles.displayAndSort}>
              <div className={styles.displayButtons}></div>
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

          <PackageList
            communityId={communityId}
            userId={userId}
            teamId={teamId}
            searchQuery={debouncedSearchValue}
            categories={categories}
          />

          {/* TODO: use real totalCount */}
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
  );
}

PackageSearch.displayName = "PackageSearch";

enum SortOptions {
  Created = "-datetime_created",
  Downloaded = "-downloads",
  Rated = "-rating_score",
  Updated = "-datetime_updated",
}

const selectOptions = [
  {
    value: SortOptions.Updated,
    label: "Last updated",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faClock} />
      </Icon>
    ),
  },
  {
    value: SortOptions.Created,
    label: "Newest",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faSparkles} />
      </Icon>
    ),
  },
  {
    value: SortOptions.Downloaded,
    label: "Most downloaded",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faDownload} />
      </Icon>
    ),
  },
  {
    value: SortOptions.Rated,
    label: "Top rated",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faThumbsUp} />
      </Icon>
    ),
  },
];
