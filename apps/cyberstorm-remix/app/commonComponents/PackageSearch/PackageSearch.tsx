import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faXmarkLarge, faSlidersUp } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PackageCategory,
  PackageListings,
  Section,
} from "@thunderstore/dapper/types";
import { useDeferredValue, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { CategoryTagCloud } from "./CategoryTagCloud/CategoryTagCloud";
import { CategoryMenu } from "./FilterMenus/CategoryMenu";
import { OthersMenu } from "./FilterMenus/OthersMenu";
import { SectionMenu } from "./FilterMenus/SectionMenu";
import styles from "./PackageSearch.module.css";
import packageListStyles from "./PackageList.module.css";
import { CategorySelection } from "./types";
import {
  Button,
  PackageCard,
  Pagination,
  TextInput,
} from "@thunderstore/cyberstorm";
import { useNavigation, useSearchParams } from "@remix-run/react";
import { StalenessIndicator } from "@thunderstore/cyberstorm/src/components/StalenessIndicator/StalenessIndicator";
import { PackageCount } from "./PackageCount";
import { PackageOrder, PackageOrderOptions } from "./PackageOrder";
import { CollapsibleMenu } from "./FilterMenus/CollapsibleMenu";
import { PackageRecent, PackageRecentOptions } from "./PackageRecent";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

const PER_PAGE = 20;

interface Props {
  listings: PackageListings;
  packageCategories: PackageCategory[];
  sections: Section[];
}

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const { listings, packageCategories: allCategories, sections } = props;
  const allSections = sections.sort((a, b) => a.priority - b.priority);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const [searchValue, setSearchValue] = useState(
    searchParams.getAll("search").join(" ")
  );

  const [categories, setCategories] = useState<CategorySelection[]>(
    allCategories
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((c) => ({ ...c, selection: "off" }))
  );
  const [section, setSection] = useState(allSections[0]?.uuid ?? "");
  const [deprecated, setDeprecated] = useState(false);
  const [nsfw, setNsfw] = useState(false);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(PackageOrderOptions.Updated);
  const [recentUpload, setRecentUpload] = useState(
    PackageRecentOptions.AllTime
  );
  const [recentUpdate, setRecentUpdate] = useState(
    PackageRecentOptions.AllTime
  );
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");
  const [updatedAfter, setUpdatedAfter] = useState("");
  const [updatedBefore, setUpdatedBefore] = useState("");

  const deferredCategories = useDeferredValue(categories);
  const deferredDeprecated = useDeferredValue(deprecated);
  const deferredNsfw = useDeferredValue(nsfw);
  const deferredSection = useDeferredValue(section);

  const deferredPage = useDeferredValue(page);
  const deferredOrder = useDeferredValue(order);
  const deferredRecentUpload = useDeferredValue(recentUpload);
  const deferredRecentUpdate = useDeferredValue(recentUpdate);

  const deferredIncludedCategories = deferredCategories
    .filter((c) => c.selection === "include")
    .map((c) => c.id);
  const deferredExcludedCategories = deferredCategories
    .filter((c) => c.selection === "exclude")
    .map((c) => c.id);

  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  const deferredCreatedAfter = useDeferredValue(createdAfter);
  const deferredCreatedBefore = useDeferredValue(createdBefore);
  const deferredUpdatedAfter = useDeferredValue(updatedAfter);
  const deferredUpdatedBefore = useDeferredValue(updatedBefore);

  useEffect(() => {
    if (debouncedSearchValue === "") {
      searchParams.delete("search");
    } else {
      searchParams.set("search", debouncedSearchValue);
    }

    if (deferredDeprecated === false) {
      searchParams.delete("deprecated");
    } else {
      searchParams.set("deprecated", "true");
    }

    if (deferredNsfw === false) {
      searchParams.delete("nsfw");
    } else {
      searchParams.set("nsfw", "true");
    }

    if (deferredSection === "") {
      searchParams.delete("section");
    } else {
      searchParams.set("section", deferredSection);
    }

    if (deferredIncludedCategories.length === 0) {
      searchParams.delete("includedCategories");
    } else {
      searchParams.set(
        "includedCategories",
        deferredIncludedCategories.join(",")
      );
    }

    if (deferredExcludedCategories.length === 0) {
      searchParams.delete("excludedCategories");
    } else {
      searchParams.set(
        "excludedCategories",
        deferredExcludedCategories.join(",")
      );
    }

    if (deferredPage === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", String(deferredPage));
    }

    if (deferredOrder === PackageOrderOptions.Updated) {
      searchParams.delete("order");
    } else {
      searchParams.set("order", deferredOrder);
    }

    if (deferredRecentUpload === PackageRecentOptions.AllTime) {
      searchParams.delete("created_recent");
    } else {
      searchParams.set("created_recent", deferredRecentUpload);
    }

    if (deferredRecentUpdate === PackageRecentOptions.AllTime) {
      searchParams.delete("updated_recent");
    } else {
      searchParams.set("updated_recent", deferredRecentUpdate);
    }

    if (deferredCreatedAfter === "") {
      searchParams.delete("created_after");
    } else {
      searchParams.set("created_after", deferredCreatedAfter);
    }

    if (deferredCreatedBefore === "") {
      searchParams.delete("created_before");
    } else {
      searchParams.set("created_before", deferredCreatedBefore);
    }

    if (deferredUpdatedAfter === "") {
      searchParams.delete("updated_after");
    } else {
      searchParams.set("updated_after", deferredUpdatedAfter);
    }

    if (deferredUpdatedBefore === "") {
      searchParams.delete("updated_before");
    } else {
      searchParams.set("updated_before", deferredUpdatedBefore);
    }

    setSearchParams(searchParams);
  }, [
    debouncedSearchValue,
    deferredDeprecated,
    deferredNsfw,
    deferredSection,
    deferredCategories,
    deferredPage,
    deferredOrder,
    deferredCreatedAfter,
    deferredCreatedBefore,
    deferredUpdatedAfter,
    deferredUpdatedBefore,
    deferredRecentUpload,
    deferredRecentUpdate,
  ]);

  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchRowItemWrapper}>
          <label className={styles.searchText} htmlFor="packageOrder">
            Sort by
          </label>
          <Button.Root
            iconAlignment="side"
            colorScheme="primary"
            paddingSize="largeBorderCompensated"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <Button.ButtonIcon>
              <FontAwesomeIcon
                icon={isFiltersVisible ? faXmarkLarge : faSlidersUp}
              />
            </Button.ButtonIcon>
            <Button.ButtonLabel>
              {isFiltersVisible ? "Close" : "Open"}
            </Button.ButtonLabel>
          </Button.Root>
        </div>
        <div
          className={classnames(
            styles.searchInputWrapper,
            styles.searchRowItemWrapper
          )}
        >
          <label className={styles.searchText} htmlFor="searchInput">
            Search
          </label>
          <TextInput
            placeholder="Filter Mods..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            leftIcon={<FontAwesomeIcon icon={faSearch} />}
            id="searchInput"
          />
        </div>
        <div className={styles.searchRowItemWrapper}>
          <label className={styles.searchText} htmlFor="packageOrder">
            Sort by
          </label>
          <PackageOrder order={order} setOrder={setOrder} />
        </div>
        <div className={styles.searchRowItemWrapper}>
          <label className={styles.searchText} htmlFor="packageRecentUpload">
            Upload time
          </label>
          <PackageRecent
            id={"packageRecentUpload"}
            value={recentUpload}
            setValue={setRecentUpload}
          />
        </div>
        <div className={styles.searchRowItemWrapper}>
          <label className={styles.searchText} htmlFor="packageRecentUpdate">
            Update time
          </label>
          <PackageRecent
            id={"packageRecentUpdate"}
            value={recentUpdate}
            setValue={setRecentUpdate}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div
          className={classnames(
            styles.sidebar,
            isFiltersVisible ? undefined : styles.sidebarIsHidden
          )}
          id="desktopSidebar"
        >
          <CollapsibleMenu headerTitle="Date filters" defaultOpen={false}>
            <div className={styles.dateFilterInputs}>
              <div className={styles.dateFilterInputsSet}>
                <label
                  className={styles.dateFilterHeader}
                  htmlFor="updatedAfter"
                >
                  Updated after
                </label>
                <input
                  type="date"
                  className={styles.dateFilterInput}
                  onChange={(e) => setUpdatedAfter(e.target.value)}
                  id="updatedAfter"
                />
              </div>
              <div className={styles.dateFilterInputsSet}>
                <label
                  className={styles.dateFilterHeader}
                  htmlFor="updatedBefore"
                >
                  Updated before
                </label>
                <input
                  type="date"
                  className={styles.dateFilterInput}
                  onChange={(e) => setUpdatedBefore(e.target.value)}
                  id="updatedBefore"
                />
              </div>
            </div>
            <div className={styles.dateFilterInputs}>
              <div className={styles.dateFilterInputsSet}>
                <label
                  className={styles.dateFilterHeader}
                  htmlFor="createdAfter"
                >
                  Created after
                </label>
                <input
                  type="date"
                  className={styles.dateFilterInput}
                  onChange={(e) => setCreatedAfter(e.target.value)}
                  id="createdAfter"
                />
              </div>
              <div className={styles.dateFilterInputsSet}>
                <label
                  className={styles.dateFilterHeader}
                  htmlFor="createdBefore"
                >
                  Created before
                </label>
                <input
                  type="date"
                  className={styles.dateFilterInput}
                  onChange={(e) => setCreatedBefore(e.target.value)}
                  id="createdBefore"
                />
              </div>
            </div>
          </CollapsibleMenu>

          {allSections.length > 0 ? (
            <CollapsibleMenu headerTitle="Sections" defaultOpen>
              <SectionMenu
                allSections={allSections}
                selected={section}
                setSelected={setSection}
              />
            </CollapsibleMenu>
          ) : null}

          <CollapsibleMenu headerTitle="Categories" defaultOpen>
            <CategoryMenu
              categories={categories}
              setCategories={setCategories}
            />
          </CollapsibleMenu>

          <CollapsibleMenu headerTitle="Other filters" defaultOpen>
            <OthersMenu
              deprecated={deprecated}
              setDeprecated={setDeprecated}
              nsfw={nsfw}
              setNsfw={setNsfw}
            />
          </CollapsibleMenu>
        </div>

        <div className={styles.content}>
          <div className={styles.root}>
            <div className={packageListStyles.top}>
              <StalenessIndicator
                isStale={navigation.state === "loading" ? true : false}
              >
                <PackageCount
                  page={page}
                  pageSize={PER_PAGE}
                  searchQuery={debouncedSearchValue}
                  totalCount={listings.count}
                />
              </StalenessIndicator>
              <CategoryTagCloud
                categories={categories}
                setCategories={setCategories}
              />
            </div>

            <StalenessIndicator
              isStale={navigation.state === "loading" ? true : false}
              className={classnames(
                packageListStyles.packages,
                isFiltersVisible
                  ? undefined
                  : packageListStyles.packagesIsFiltersVisible
              )}
            >
              {listings.results.map((p) => (
                <PackageCard key={`${p.namespace}-${p.name}`} package={p} />
              ))}
            </StalenessIndicator>
            <StalenessIndicator
              isStale={navigation.state === "loading" ? true : false}
            >
              <Pagination
                currentPage={page}
                onPageChange={setPage}
                pageSize={PER_PAGE}
                siblingCount={2}
                totalCount={listings.count}
              />
            </StalenessIndicator>
          </div>
        </div>
      </div>
    </div>
  );
}

PackageSearch.displayName = "PackageSearch";
