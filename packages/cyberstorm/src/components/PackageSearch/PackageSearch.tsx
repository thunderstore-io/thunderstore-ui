"use client";
import {
  faFire,
  faSearch,
  faStar,
  faThumbsUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, lazy, useState, createContext } from "react";

import styles from "./PackageSearch.module.css";
import * as Button from "../Button/";
import { FilterItemList } from "../FilterItemList/FilterItemList";
import { Icon } from "../Icon/Icon";
import { Pagination } from "../Pagination/Pagination";
import { Select } from "../Select/Select";
import { Tag } from "../Tag/Tag";
import { TextInput } from "../TextInput/TextInput";

const PackageList = lazy(() => import("../PackageList/PackageList"));

export interface CategoriesProps {
  [key: string]: {
    label: string;
    value: boolean | undefined;
  };
}

export interface PackageSearchLayoutProps {
  communityId?: string;
  userId?: string;
  teamId?: string;
}

export interface PackageListingsProps {
  communityId: string;
  userId: string;
  teamId: string;
  keywords: { key: string; negate: boolean }[];
  categories: CategoriesProps[];
}

// TODO: OVERKILL???
export class Filters {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  availableCategories: CategoriesProps;
  setAvailableCategories: React.Dispatch<React.SetStateAction<CategoriesProps>>;

  constructor() {
    [this.keywords, this.setKeywords] = useState<string[]>([]);
    [this.availableCategories, this.setAvailableCategories] =
      useState<CategoriesProps>({});
  }
}

type ContextProps = { filters: Filters; children?: React.ReactNode };
export const FiltersContext = createContext<Filters | null>(null);

export function FiltersProvider(props: ContextProps) {
  const { filters, children } = props;
  return (
    <FiltersContext.Provider value={filters}>
      {children}
    </FiltersContext.Provider>
  );
}

const RemoveFilterIcon = (onClick: () => void) => (
  <button onClick={onClick} style={{ backgroundColor: "transparent" }}>
    <Icon>
      <FontAwesomeIcon icon={faXmark} />
    </Icon>
  </button>
);

interface TagListProps {
  filters: Filters;
}

function CurrentFilters(props: TagListProps) {
  const { filters } = props;

  function removeFilter(key: string, filterType: string) {
    if (filterType === "keyword") {
      filters.setKeywords(filters.keywords.filter((x) => x !== key));
    }

    if (filterType === "category") {
      const cats = { ...filters.availableCategories };
      Object.values(cats).forEach((c) => {
        if (c.label === key) {
          c.value = undefined;
        }
      });

      filters.setAvailableCategories(cats);
    }
  }

  return (
    <>
      {filters.keywords?.map((keyword, index) => (
        <Tag
          key={`keywordSearch_${keyword}_${index}`}
          label={`"${keyword}"`}
          rightIcon={RemoveFilterIcon(() => removeFilter(keyword, "keyword"))}
          colorScheme="borderless_removable"
        />
      ))}
      {Object.values(filters.availableCategories)
        .filter((category) => category.value !== undefined)
        .map((cat, index) => (
          <Tag
            key={`categorySearch_${cat.label}_${index}`}
            label={cat.label}
            rightIcon={RemoveFilterIcon(() =>
              removeFilter(cat.label, "category")
            )}
            colorScheme="borderless_removable"
          />
        ))}
    </>
  );
}

/**
 * Cyberstorm PackageSearch Layout
 */
export function PackageSearch(props: PackageSearchLayoutProps) {
  const { communityId, userId, teamId } = props;

  const filters = new Filters();
  const [order, setOrder] = useState("1");
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchFilterEdit = (e: string) =>
    filters.setKeywords(
      Array.from(new Set([...filters.keywords, e])).filter(Boolean)
    );

  const clearFilters = () => {
    filters.setKeywords([]);

    const cats = { ...filters.availableCategories };
    Object.values(cats).forEach((cat) => (cat.value = undefined));
    filters.setAvailableCategories(cats);
  };

  return (
    <div className={styles.content}>
      <TextInput
        placeHolder="Filter Mods..."
        leftIcon={
          <Icon>
            <FontAwesomeIcon icon={faSearch} />
          </Icon>
        }
        value={searchValue}
        setValue={setSearchValue}
        enterHook={handleSearchFilterEdit}
      />
      <div className={styles.contentWrapper}>
        <div className={styles.filterItemList}>
          <FilterItemList
            filterItems={filters.availableCategories}
            filterItemsSetter={filters.setAvailableCategories}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.listTopNavigation}>
            <div className={styles.showing}>
              {/* TODO: use real values */}
              Showing <strong>1-20</strong> of <strong>327</strong> results
            </div>

            {filters.keywords.length > 0 ||
            Object.keys(filters.availableCategories).some(
              (k) => filters.availableCategories[k].value !== undefined
            ) ? (
              <div className={styles.selectedTags}>
                <CurrentFilters filters={filters} />
                <Button.Root
                  key="clearAllButton"
                  paddingSize="small"
                  colorScheme="transparentTertiary"
                  border-width="0px"
                  onClick={clearFilters}
                >
                  <Button.ButtonLabel fontSize="small">
                    Clear all
                  </Button.ButtonLabel>
                </Button.Root>
              </div>
            ) : null}

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
          <FiltersProvider filters={filters}>
            <Suspense
              fallback={
                <h2 className={styles.showing}>
                  🌀 Some Skeleton of the component...
                </h2>
              }
            >
              <PackageList
                communityId={communityId}
                userId={userId}
                teamId={teamId}
              />
            </Suspense>
          </FiltersProvider>
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

const selectOptions = [
  {
    value: "1",
    label: "Newest",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faStar} />
      </Icon>
    ),
  },
  {
    value: "2",
    label: "Hottest",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faFire} />
      </Icon>
    ),
  },
  {
    value: "3",
    label: "Top rated",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faThumbsUp} />
      </Icon>
    ),
  },
];
