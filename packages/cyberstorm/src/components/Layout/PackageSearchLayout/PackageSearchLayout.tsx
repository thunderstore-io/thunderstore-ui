"use client";
import { Suspense, lazy, useState, createContext, ReactNode } from "react";
import styles from "./PackageSearchLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faSearch,
  faStar,
  faThumbsUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Select } from "../../Select/Select";
import { Pagination } from "../../Pagination/Pagination";
import { FilterItemList } from "../../FilterItemList/FilterItemList";
import { Button } from "../../Button/Button";
import { Tag } from "../../Tag/Tag";
import { TextInput } from "../../TextInput/TextInput";
import { faGrid, faList } from "@fortawesome/pro-light-svg-icons";

const PackageListings = lazy(
  () => import("../PackageListings/PackageListings")
);

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
  categories: {
    label: string;
    value: boolean | undefined;
  }[];
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

function RemoveFilterIcon(
  key: string,
  filterType: "keyword" | "category",
  hook: (key: string, filterType: string) => void
) {
  return (
    // TODO: Fix to work with keyboard presses, so linting doesnt complain
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div onClick={() => hook(key, filterType)}>
      <FontAwesomeIcon icon={faXmark} fixedWidth />
    </div>
  );
}

interface TagListProps {
  searchKeywords: string[];
  keywordsSetter: React.Dispatch<React.SetStateAction<string[]>>;
  searchCategories: CategoriesProps;
  categoriesSetter: React.Dispatch<React.SetStateAction<CategoriesProps>>;
}

function CurrentFilters(props: TagListProps) {
  const { searchKeywords, keywordsSetter, searchCategories, categoriesSetter } =
    props;

  function removeFilter(key: string, filterType: string) {
    if (filterType === "keyword") {
      keywordsSetter(searchKeywords.filter((x) => x !== key));
    }
    if (filterType === "category") {
      searchCategories[key].value = undefined;
      categoriesSetter(searchCategories);
    }
  }

  const categories: ReactNode[] = [];
  Object.keys(searchCategories).forEach(function (key, index) {
    if (searchCategories[key].value !== undefined) {
      categories.push(
        <Tag
          key={"categorySearch" + key + index.toString()}
          label={key}
          rightIcon={RemoveFilterIcon(key, "category", removeFilter)}
          colorScheme={
            searchCategories[key].value === false ? "removable" : "default"
          }
        />
      );
    }
  });

  return (
    <>
      {searchKeywords?.map((keyword, index: number) => {
        return (
          <Tag
            key={"keywordSearch" + keyword + index.toString()}
            label={`"${keyword}"`}
            rightIcon={RemoveFilterIcon(keyword, "keyword", removeFilter)}
          />
        );
      })}
      {categories}
    </>
  );
}

/**
 * Cyberstorm PackageList Layout
 */
export default function PackageSearchLayout(props: PackageSearchLayoutProps) {
  const {
    communityId = undefined,
    userId = undefined,
    teamId = undefined,
  } = props;

  // Prep
  const filters = new Filters();
  const [order, setOrder] = useState("1");
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  // Helper function
  const handleSearchFilterEdit = (e: string) => {
    let found = false;
    const newSearchTerms = filters.keywords?.map((keyword) => {
      if (keyword === e) {
        found = true;
      }
      return keyword;
    });
    if (!found) {
      newSearchTerms.push(e);
    }
    filters.setKeywords(newSearchTerms);
  };

  // React Node return
  return (
    <div className={styles.content}>
      <TextInput
        placeHolder="Filter Mods..."
        leftIcon={<FontAwesomeIcon icon={faSearch} fixedWidth />}
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
              Showing <strong>1-20</strong> of <strong>327</strong>
            </div>

            {filters.keywords.length > 0 ||
            Object.keys(filters.availableCategories).some(
              (k) => filters.availableCategories[k].value !== undefined
            ) ? (
              <div className={styles.selectedTags}>
                <CurrentFilters
                  searchKeywords={filters.keywords}
                  keywordsSetter={filters.setKeywords}
                  searchCategories={filters.availableCategories}
                  categoriesSetter={filters.setAvailableCategories}
                />
                <Button
                  key="clearAllButton"
                  size="small"
                  colorScheme="transparentDefault"
                  label="Clear all"
                  onClick={() => {
                    filters.setKeywords([]);
                    const updatedAvailableCategories: CategoriesProps = {};
                    Object.keys(filters.availableCategories).forEach(function (
                      key
                    ) {
                      updatedAvailableCategories[key] = {
                        label: filters.availableCategories[key].label,
                        value: undefined,
                      };
                    });
                    filters.setAvailableCategories(updatedAvailableCategories);
                  }}
                />
              </div>
            ) : null}

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
          <FiltersProvider filters={filters}>
            <Suspense
              fallback={
                <h2 className={styles.showing}>
                  🌀 Some Skeleton of the component...
                </h2>
              }
            >
              <PackageListings
                communityId={communityId}
                userId={userId}
                teamId={teamId}
              />
            </Suspense>
          </FiltersProvider>
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

PackageSearchLayout.displayName = "PackageSearchLayout";

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
