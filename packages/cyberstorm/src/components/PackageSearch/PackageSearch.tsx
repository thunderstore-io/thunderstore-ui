"use client";
import {
  faFire,
  faSearch,
  faStar,
  faThumbsUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PackageCategory } from "@thunderstore/dapper/types";
import { Suspense, useState, createContext } from "react";
import { useDebounce } from "use-debounce";

import { CategoryMenu } from "./CategoryMenu/CategoryMenu";
import styles from "./PackageSearch.module.css";
import { CategorySelection } from "./types";
import * as Button from "../Button/";
import { Icon } from "../Icon/Icon";
import { Pagination } from "../Pagination/Pagination";
import { PackageList } from "../PackageList/PackageList";
import { Select } from "../Select/Select";
import { Tag } from "../Tag/Tag";
import { TextInput } from "../TextInput/TextInput";

interface CategoriesProps {
  [key: string]: {
    label: string;
    value: boolean | undefined;
  };
}

// TODO: OVERKILL???
export class Filters {
  availableCategories: CategoriesProps;
  setAvailableCategories: React.Dispatch<React.SetStateAction<CategoriesProps>>;

  constructor() {
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

  function removeFilter(key: string) {
    const cats = { ...filters.availableCategories };
    Object.values(cats).forEach((c) => {
      if (c.label === key) {
        c.value = undefined;
      }
    });

    filters.setAvailableCategories(cats);
  }

  return (
    <>
      {Object.values(filters.availableCategories)
        .filter((category) => category.value !== undefined)
        .map((cat, index) => (
          <Tag
            key={`categorySearch_${cat.label}_${index}`}
            label={cat.label}
            rightIcon={RemoveFilterIcon(() => removeFilter(cat.label))}
            colorScheme="borderless_removable"
          />
        ))}
    </>
  );
}

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

  const filters = new Filters();
  const [order, setOrder] = useState("1");
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);
  const [categories, setCategories] = useState<CategorySelection[]>(
    allCategories
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((c) => ({ ...c, selection: "off" }))
  );

  const clearFilters = () => {
    setSearchValue("");

    const cats = { ...filters.availableCategories };
    Object.values(cats).forEach((cat) => (cat.value = undefined));
    filters.setAvailableCategories(cats);
  };

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
            <div className={styles.showing}>
              {/* TODO: use real values */}
              Showing <strong>1-20</strong> of <strong>327</strong> results
              {debouncedSearchValue !== ""
                ? ` for "${debouncedSearchValue}"`
                : ""}
            </div>

            {Object.keys(filters.availableCategories).some(
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
                searchQuery={debouncedSearchValue}
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
