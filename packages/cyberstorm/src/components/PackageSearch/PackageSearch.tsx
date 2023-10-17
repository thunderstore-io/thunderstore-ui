"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
          <CategoryTagCloud
            categories={categories}
            setCategories={setCategories}
          />

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
