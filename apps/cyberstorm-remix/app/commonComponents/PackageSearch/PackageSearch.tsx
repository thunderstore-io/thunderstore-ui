import { faGhost, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faFilterList, faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PackageCategory,
  PackageListings,
  Section,
} from "@thunderstore/dapper/types";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { CategoryTagCloud } from "./CategoryTagCloud/CategoryTagCloud";
import { CategoryMenu } from "./FilterMenus/CategoryMenu";
import { OthersMenu } from "./FilterMenus/OthersMenu";
import { SectionMenu } from "./FilterMenus/SectionMenu";
import styles from "./PackageSearch.module.css";
import packageListStyles from "./PackageList.module.css";
import { CategorySelection } from "./types";
import {
  CardPackage,
  EmptyState,
  Heading,
  NewButton,
  NewIcon,
  NewPagination,
  NewTextInput,
} from "@thunderstore/cyberstorm";
import {
  useNavigation,
  useNavigationType,
  useSearchParams,
} from "@remix-run/react";
import { StalenessIndicator } from "@thunderstore/cyberstorm/src/components/StalenessIndicator/StalenessIndicator";
import { PackageCount } from "./PackageCount";
import {
  isPackageOrderOptions,
  PackageOrder,
  PackageOrderOptions,
  PackageOrderOptionsType,
} from "./PackageOrder";
import { CollapsibleMenu } from "./FilterMenus/CollapsibleMenu";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

const PER_PAGE = 20;

interface Props {
  listings: PackageListings;
  packageCategories: PackageCategory[];
  sections: Section[];
}

type SearchParamsType = {
  order?: PackageOrderOptionsType;
  section: string;
  deprecated: boolean;
  nsfw: boolean;
  page: number;
  includedCategories: string;
  excludedCategories: string;
};

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const { listings, packageCategories: allCategories, sections } = props;
  // TODO: Remove this customization when /p is doned
  const domain = getPublicEnvVariables(["PUBLIC_SITE_URL"]).PUBLIC_SITE_URL;
  const allSections = sections.sort((a, b) => a.priority - b.priority);

  // const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  // REMIX START

  const navigationType = useNavigationType();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialOrder = searchParams.get("ordering");
  const initialSection = searchParams.get("section");
  const initialDeprecated = searchParams.get("deprecated");
  const initialNsfw = searchParams.get("nsfw");
  const initialPage = searchParams.get("page");
  const initialIncludedCategories = searchParams.get("includedCategories");
  const initialExcludedCategories = searchParams.get("excludedCategories");

  const [searchParamsBlob, setSearchParamsBlob] = useState<SearchParamsType>({
    order:
      initialOrder && isPackageOrderOptions(initialOrder)
        ? (initialOrder as PackageOrderOptionsType)
        : undefined,
    section:
      allSections.length === 0 ? "" : initialSection ?? allSections[0]?.uuid,
    deprecated:
      initialDeprecated === null
        ? false
        : initialDeprecated === "true"
          ? true
          : initialDeprecated === "false"
            ? false
            : false,
    nsfw:
      initialNsfw === null
        ? false
        : initialNsfw === "true"
          ? true
          : initialNsfw === "false"
            ? false
            : false,
    page:
      initialPage &&
      !Number.isNaN(Number.parseInt(initialPage)) &&
      Number.isSafeInteger(Number.parseInt(initialPage))
        ? Number.parseInt(initialPage)
        : 1,
    includedCategories:
      initialIncludedCategories !== null ? initialIncludedCategories : "",
    excludedCategories:
      initialExcludedCategories !== null ? initialExcludedCategories : "",
  });

  // TODO: Disabled until we can figure out how a proper way to display skeletons
  // const navigation = useNavigation();

  // Order start
  const changeOrder = (v: PackageOrderOptionsType) => {
    setSearchParamsBlob({ ...searchParamsBlob, order: v });
  };
  // Order end

  // Search start
  const [searchValue, setSearchValue] = useState(
    searchParams.getAll("search").join(" ")
  );

  useEffect(() => {
    if (navigationType === "POP") {
      setSearchValue(searchParams.getAll("search").join(" "));
    }
  }, [searchParams]);

  const [debouncedSearchValue] = useDebounce(searchValue, 300, {
    maxWait: 300,
  });

  useEffect(() => {
    if (debouncedSearchValue === "") {
      searchParams.delete("search");
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set("search", debouncedSearchValue);
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedSearchValue]);
  // Search end

  const setSection = (v: string) => {
    setSearchParamsBlob({ ...searchParamsBlob, section: v });
  };

  const setDeprecated = (v: boolean) => {
    setSearchParamsBlob({ ...searchParamsBlob, deprecated: v });
  };

  const setNsfw = (v: boolean) => {
    setSearchParamsBlob({ ...searchParamsBlob, nsfw: v });
  };

  const setPage = (v: number) => {
    setSearchParamsBlob({ ...searchParamsBlob, page: v });
  };

  // Categories start
  const categories: CategorySelection[] = allCategories
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((c) => ({ ...c, selection: "off" }));

  const setCategories = (v: CategorySelection[]) => {
    const newSearchParams = { ...searchParamsBlob };
    const includedCategories = v
      .filter((c) => c.selection === "include")
      .map((c) => c.id);
    if (includedCategories.length === 0) {
      newSearchParams.includedCategories = "";
    } else {
      newSearchParams.includedCategories = includedCategories.join(",");
    }
    const excludedCategories = v
      .filter((c) => c.selection === "exclude")
      .map((c) => c.id);
    if (excludedCategories.length === 0) {
      newSearchParams.excludedCategories = "";
    } else {
      newSearchParams.excludedCategories = excludedCategories.join(",");
    }
    setSearchParamsBlob(newSearchParams);
  };
  // Categories end

  const resetParams = (order?: PackageOrderOptionsType) => {
    setSearchParamsBlob({
      order: order,
      section: allSections.length === 0 ? "" : allSections[0]?.uuid,
      deprecated: false,
      nsfw: false,
      page: 1,
      includedCategories: "",
      excludedCategories: "",
    });
    setSearchValue("");
  };

  const [debouncedSearchParamsBlob] = useDebounce(searchParamsBlob, 750, {
    maxWait: 750,
  });

  useEffect(() => {
    // Order
    if (
      debouncedSearchParamsBlob.order === undefined ||
      debouncedSearchParamsBlob.order === PackageOrderOptions.Updated
    ) {
      searchParams.delete("ordering");
    } else {
      searchParams.set("ordering", debouncedSearchParamsBlob.order);
    }
    // Section
    if (
      allSections.length === 0 ||
      debouncedSearchParamsBlob.section === allSections[0]?.uuid ||
      debouncedSearchParamsBlob.section === ""
    ) {
      searchParams.delete("section");
    } else {
      searchParams.set("section", debouncedSearchParamsBlob.section);
    }
    // Deprecated
    if (debouncedSearchParamsBlob.deprecated === false) {
      searchParams.delete("deprecated");
    } else {
      searchParams.set("deprecated", "true");
    }
    // NSFW
    if (debouncedSearchParamsBlob.nsfw === false) {
      searchParams.delete("nsfw");
    } else {
      searchParams.set("nsfw", "true");
    }
    // Page number
    if (debouncedSearchParamsBlob.page === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", String(debouncedSearchParamsBlob.page));
    }
    // Categories
    if (debouncedSearchParamsBlob.includedCategories === "") {
      searchParams.delete("includedCategories");
    } else {
      searchParams.set(
        "includedCategories",
        debouncedSearchParamsBlob.includedCategories
      );
    }
    if (debouncedSearchParamsBlob.excludedCategories === "") {
      searchParams.delete("excludedCategories");
    } else {
      searchParams.set(
        "excludedCategories",
        debouncedSearchParamsBlob.excludedCategories
      );
    }
    setSearchParams(searchParams);
  }, [debouncedSearchParamsBlob]);

  function parseCategories(
    includedCategories: string,
    excludedCategories: string
  ): CategorySelection[] {
    const iCArr = includedCategories.split(",");
    const eCArr = excludedCategories.split(",");
    return categories.map((c) =>
      iCArr.includes(c.id)
        ? { ...c, selection: "include" }
        : eCArr.includes(c.id)
          ? { ...c, selection: "exclude" }
          : c
    );
  }

  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchGroupOne}>
          <div
            className={classnames(
              styles.searchRowItemGroup,
              styles.searchFilters
            )}
          >
            <div className={styles.searchRowItemWrapper}>
              <label
                className={classnames(styles.searchText, "nimbus-hide-s")}
                htmlFor="filtersMenuToggle"
              >
                Filters
              </label>
              <div className={styles.bgWrapper}>
                <NewButton
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  id="filtersMenuToggle"
                  csVariant={isFiltersVisible ? "primary" : "secondary"}
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon
                      icon={isFiltersVisible ? faXmarkLarge : faFilterList}
                    />
                  </NewIcon>
                  <span className={"nimbus-hide-s"}>Filters</span>
                </NewButton>
              </div>
            </div>
          </div>
          <div
            className={classnames(
              styles.searchRowItemGroup,
              styles.searchSearch
            )}
          >
            <div
              className={classnames(
                styles.searchInputWrapper,
                styles.searchRowItemWrapper
              )}
            >
              <label
                className={classnames(styles.searchText, "nimbus-hide-s")}
                htmlFor="searchInput"
              >
                Search
              </label>
              <div className={styles.bgWrapper}>
                <NewTextInput
                  placeholder="Filter Mods..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  clearValue={() => setSearchValue("")}
                  leftIcon={<FontAwesomeIcon icon={faSearch} />}
                  id="searchInput"
                  type="search"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={classnames(
            styles.searchRowItemGroup,
            styles.listingOptions
          )}
        >
          <div className={styles.searchRowItemWrapper}>
            <label
              className={classnames(styles.searchText, "nimbus-hide-s")}
              htmlFor="packageOrder"
            >
              Sort by
            </label>
            <div className={styles.bgWrapper}>
              <PackageOrder
                order={
                  (searchParamsBlob.order as PackageOrderOptions) ??
                  PackageOrderOptions.Updated
                }
                setOrder={changeOrder}
              />
            </div>
          </div>
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
          <Heading csLevel="3" csSize="3" rootClasses={styles.sidebarHeading}>
            Filters
          </Heading>
          {allSections.length > 0 ? (
            <>
              <div className={styles.sidebarDivider} />
              <CollapsibleMenu headerTitle="Sections" defaultOpen>
                <SectionMenu
                  allSections={allSections}
                  selected={searchParamsBlob.section ?? allSections[0]?.uuid}
                  setSelected={setSection}
                />
              </CollapsibleMenu>
            </>
          ) : null}
          {categories.length > 0 ? (
            <>
              <div className={styles.sidebarDivider} />
              <CollapsibleMenu headerTitle="Categories" defaultOpen>
                <CategoryMenu
                  categories={categories}
                  includedCategories={searchParamsBlob.includedCategories}
                  excludedCategories={searchParamsBlob.excludedCategories}
                  setCategories={setCategories}
                />
              </CollapsibleMenu>
            </>
          ) : null}
          <div className={styles.sidebarDivider} />
          <CollapsibleMenu headerTitle="Other filters" defaultOpen>
            <OthersMenu
              deprecated={searchParamsBlob.deprecated ? true : false}
              setDeprecated={setDeprecated}
              nsfw={searchParamsBlob.nsfw ? true : false}
              setNsfw={setNsfw}
            />
          </CollapsibleMenu>
        </div>

        <div className={styles.content}>
          <div className={styles.root}>
            <div className={packageListStyles.top}>
              <PackageCount
                page={searchParamsBlob.page ? Number(searchParamsBlob.page) : 1}
                pageSize={PER_PAGE}
                searchQuery={debouncedSearchValue}
                totalCount={listings.count}
              />
              <CategoryTagCloud
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                categories={parseCategories(
                  searchParamsBlob.includedCategories ?? "",
                  searchParamsBlob.excludedCategories ?? ""
                )}
                setCategories={setCategories}
              />
            </div>

            <StalenessIndicator
              isStale={navigation.state === "loading" ? true : false}
            >
              {listings.results.length > 0 ? (
                <div className={packageListStyles.packages}>
                  {listings.results.map((p) => (
                    <CardPackage
                      key={`${p.namespace}-${p.name}`}
                      packageData={p}
                      // TODO: Remove this customization when /p is doned
                      domain={domain ?? "https://thunderstore.io"}
                    />
                  ))}
                </div>
              ) : (searchParamsBlob.order !== undefined &&
                  searchParams.size > 1) ||
                (searchParamsBlob.order === undefined &&
                  searchParams.size > 0) ? (
                <EmptyState.Root className="nimbus-noresult">
                  <EmptyState.Icon wrapperClasses="nimbus-noresult__ghostbounce">
                    <FontAwesomeIcon icon={faSearch} />
                  </EmptyState.Icon>
                  <div className="nimbus-noresult__info">
                    <EmptyState.Title>No results found</EmptyState.Title>
                    <EmptyState.Message>
                      Make sure all keywords are spelled correctly or try
                      different search parameters.
                    </EmptyState.Message>
                  </div>
                  <NewButton
                    onClick={() => resetParams(searchParamsBlob.order)}
                    rootClasses="nimbus-noresult__button"
                  >
                    Clear all filters
                  </NewButton>
                </EmptyState.Root>
              ) : (
                <EmptyState.Root className="nimbus-noresult">
                  <EmptyState.Icon wrapperClasses="nimbus-noresult__ghostbounce">
                    <FontAwesomeIcon icon={faGhost} />
                  </EmptyState.Icon>
                  <div className="nimbus-noresult__info">
                    <EmptyState.Title>It&apos;s empty in here</EmptyState.Title>
                    <EmptyState.Message>
                      Be the first to upload a mod!
                    </EmptyState.Message>
                  </div>
                </EmptyState.Root>
              )}
            </StalenessIndicator>

            <NewPagination
              currentPage={
                searchParamsBlob.page ? Number(searchParamsBlob.page) : 1
              }
              onPageChange={setPage}
              pageSize={PER_PAGE}
              siblingCount={4}
              totalCount={listings.count}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

PackageSearch.displayName = "PackageSearch";
