import { faGhost, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setParamsBlobValue } from "cyberstorm/utils/searchParamsUtils";
import { isPromise } from "cyberstorm/utils/typeChecks";
import { Suspense, memo, useEffect, useRef, useState } from "react";
import { Await, useNavigationType, useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";

import {
  CardPackage,
  EmptyState,
  NewButton,
  NewPagination,
  NewTextInput,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import { PackageLikeAction } from "@thunderstore/cyberstorm-forms";
import {
  type CurrentUser,
  type PackageListings,
  type Section,
} from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  type CommunityFilters,
  type RequestConfig,
} from "@thunderstore/thunderstore-api";

import { CheckboxList } from "../CheckboxList/CheckboxList";
import { CollapsibleMenu } from "../Collapsible/Collapsible";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { type CategorySelection, type TRISTATE } from "../types";
import "./PackageSearch.css";
import { CategoryTagCloud } from "./components/CategoryTagCloud/CategoryTagCloud";
import { PackageCount } from "./components/PackageCount/PackageCount";
import {
  PackageOrder,
  PackageOrderOptions,
  type PackageOrderOptionsType,
  isPackageOrderOptions,
} from "./components/PackageOrder";

const PER_PAGE = 20;

interface Props {
  listings: Promise<PackageListings> | PackageListings;
  filters: Promise<CommunityFilters> | CommunityFilters;
  config: () => RequestConfig;
  currentUser?: CurrentUser;
  dapper: DapperTs;
}

type SearchParamsType = {
  search: string;
  order: PackageOrderOptionsType | undefined;
  section: string;
  deprecated: boolean;
  nsfw: boolean;
  page: number;
  includedCategories: string;
  excludedCategories: string;
};

const searchParamsToBlob = (
  searchParams: URLSearchParams,
  sections?: Section[]
) => {
  const initialSearch = searchParams.getAll("search").join(" ");
  const initialOrder = searchParams.get("ordering");
  const initialSection = searchParams.get("section");
  const initialDeprecated = searchParams.get("deprecated");
  const initialNsfw = searchParams.get("nsfw");
  const initialPage = searchParams.get("page");
  const initialIncludedCategories = searchParams.get("includedCategories");
  const initialExcludedCategories = searchParams.get("excludedCategories");

  return {
    search: initialSearch,
    order:
      initialOrder && isPackageOrderOptions(initialOrder)
        ? (initialOrder as PackageOrderOptionsType)
        : undefined,
    section: sections
      ? sections.length === 0
        ? ""
        : initialSection ?? sections[0]?.uuid
      : initialSection ?? "",
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
  };
};

function parseCategories(
  includedCategories: string,
  excludedCategories: string,
  categories?: CategorySelection[]
): CategorySelection[] {
  if (!categories) return [];
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

const compareSearchParamBlobs = (
  b1: SearchParamsType,
  b2: SearchParamsType
) => {
  if (b1.search !== b2.search) return false;
  if (b1.includedCategories !== b2.includedCategories) return false;
  if (b1.excludedCategories !== b2.excludedCategories) return false;
  if (b1.page !== b2.page) return false;
  if (b1.deprecated !== b2.deprecated) return false;
  if (b1.nsfw !== b2.nsfw) return false;
  if (b1.order !== b2.order) return false;
  if (b1.section !== b2.section) return false;
  return true;
};

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const { listings, filters, config, currentUser, dapper } = props;

  const navigationType = useNavigationType();

  // This exists to resolve insert the initial sections and categories on server-side
  // so that we don't have to await the clientLoader to get the options, to then be able to
  // do the initial fetch
  const possibleFilters = isPromise(filters) ? undefined : filters;

  const [sortedSections, setSortedSections] = useState<
    CommunityFilters["sections"] | undefined
  >(possibleFilters?.sections);

  const [categories, setCategories] = useState<CategorySelection[] | undefined>(
    possibleFilters?.package_categories
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((c) => ({ ...c, selection: "off" }))
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams = searchParamsToBlob(searchParams, sortedSections);

  const [searchParamsBlob, setSearchParamsBlob] =
    useState<SearchParamsType>(initialParams);

  const [currentPage, setCurrentPage] = useState(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );

  const categoriesRef = useRef<
    undefined | Awaited<Promise<CommunityFilters>>["package_categories"]
  >(undefined);

  useEffect(() => {
    if (isPromise(filters)) {
      // On mount, resolve filters promise and set sections and categories states
      filters.then((resolvedFilters) => {
        // Set sorted sections
        setSortedSections(
          resolvedFilters.sections.sort((a, b) => b.priority - a.priority)
        );
        if (sortedSections && sortedSections.length !== 0) {
          setSearchParamsBlob((prev) => ({
            ...prev,
            section: sortedSections[0].uuid,
          }));
        }
        if (resolvedFilters.package_categories !== categoriesRef.current) {
          // Set current "initial" categories
          const categories: CategorySelection[] =
            resolvedFilters.package_categories
              .sort((a, b) => a.slug.localeCompare(b.slug))
              .map((c) => ({ ...c, selection: "off" }));
          setCategories(categories);
          categoriesRef.current = resolvedFilters.package_categories;
        }
      });
    }
  }, []);

  // Categories start

  const parsedCategories = parseCategories(
    searchParamsBlob.includedCategories,
    searchParamsBlob.excludedCategories,
    categories
  );

  const updateCatSelection = (catId: string, v: TRISTATE) => {
    setParamsBlobCategories(
      setSearchParamsBlob,
      searchParamsBlob,
      parsedCategories.map((uc) => {
        if (uc.id === catId) {
          return {
            ...uc,
            selection: v,
          };
        }
        return uc;
      })
    );
  };

  const filtersCategoriesItems = parsedCategories.map((c) => {
    return {
      state: c.selection,
      setStateFunc: (v: boolean | TRISTATE) =>
        updateCatSelection(
          c.id,
          typeof v === "string" ? v : v ? "include" : "off"
        ),
      label: c.name,
    };
  });
  // Categories end

  // Start updating page
  /**
   * This code gets really messy, but at this moment should cover all the following requirements:
   * 1. All actions have debouncing, so that user isn't hit with a 429.
   * 2. Editing the "search" searchParam, replaces the entry in current history index.
   * 3. Reset page to page 1 on
   *    - Search change
   *    - Category change
   *    - Section change
   *    - Other filter change (deprecated and nsfw)
   *    - Ordering change
   *  4. When navigating backwards or forwards in history stack; don't setSearchParams, just update the non-`searchParams`
   *     variable dependant states. Many of the components take in the searchParamsBlobs values, which is updated when the
   *     client-loader re-runs on navigation.
   *  5. Prevent scroll restoration on all setSearchParams calls, e.g. on all actions.
   *
   * TODO: Take a look at this whole logic stack and see if it can be cleaned to be more readable.
   */

  const [debouncedSearchParamsBlob] = useDebounce(searchParamsBlob, 300, {
    maxWait: 300,
  });

  const searchParamsBlobRef = useRef(debouncedSearchParamsBlob);

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    if (navigationType === "POP") {
      if (searchParamsRef.current !== searchParams) {
        const spb = searchParamsToBlob(searchParams, sortedSections);
        setSearchParamsBlob(spb);
        setCurrentPage(spb.page);
        searchParamsRef.current = searchParams;
      }
      searchParamsBlobRef.current = searchParamsToBlob(
        searchParams,
        sortedSections
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      navigationType !== "POP" ||
      (navigationType === "POP" &&
        searchParamsBlobRef.current !== debouncedSearchParamsBlob)
    ) {
      if (searchParamsBlobRef.current !== debouncedSearchParamsBlob) {
        let useReplace = false;
        let resetPage = false;
        const oldSearch = searchParams.getAll("search").join(" ");
        const oldOrdering = searchParams.get("ordering") ?? undefined;
        // const oldSection = searchParams.get("section") ?? "";
        const oldDeprecated = searchParams.get("deprecated") ? true : false;
        const oldNSFW = searchParams.get("nsfw") ? true : false;
        const oldIncludedCategories =
          searchParams.get("includedCategories") ?? "";
        const oldExcludedCategories =
          searchParams.get("excludedCategories") ?? "";
        const oldPage = searchParams.get("page")
          ? Number(searchParams.get("page"))
          : 1;

        // Search
        if (oldSearch !== debouncedSearchParamsBlob.search) {
          if (debouncedSearchParamsBlob.search === "") {
            searchParams.delete("search");
          } else {
            searchParams.set("search", debouncedSearchParamsBlob.search);
          }
          resetPage = true;
          useReplace = true;
        }
        // Order
        if (oldOrdering !== debouncedSearchParamsBlob.order) {
          if (
            debouncedSearchParamsBlob.order === undefined ||
            debouncedSearchParamsBlob.order === PackageOrderOptions.Updated
          ) {
            searchParams.delete("ordering");
          } else {
            searchParams.set("ordering", debouncedSearchParamsBlob.order);
          }
          resetPage = true;
        }
        // Section
        if (
          debouncedSearchParamsBlob.section === "" ||
          (sortedSections && sortedSections.length === 0)
        ) {
          searchParams.delete("section");
        } else {
          if (sortedSections && sortedSections.length !== 0) {
            if (debouncedSearchParamsBlob.section === sortedSections[0]?.uuid) {
              // If the first one, ensure the search param isn't set as it's defaulted to the first one in SearchParmsToBlob function.
              searchParams.delete("section");
            } else {
              searchParams.set("section", debouncedSearchParamsBlob.section);
            }
          } else {
            // This else is for completeness
            searchParams.delete("section");
          }
        }

        // Reset page if section has changed
        if (
          searchParamsBlobRef.current.section !==
          debouncedSearchParamsBlob.section
        ) {
          resetPage = true;
        }

        // Deprecated
        if (oldDeprecated !== debouncedSearchParamsBlob.deprecated) {
          if (debouncedSearchParamsBlob.deprecated === false) {
            searchParams.delete("deprecated");
          } else {
            searchParams.set("deprecated", "true");
          }
          resetPage = true;
        }
        // NSFW
        if (oldNSFW !== debouncedSearchParamsBlob.nsfw) {
          if (debouncedSearchParamsBlob.nsfw === false) {
            searchParams.delete("nsfw");
          } else {
            searchParams.set("nsfw", "true");
          }
          resetPage = true;
        }
        // Categories
        if (
          oldIncludedCategories !== debouncedSearchParamsBlob.includedCategories
        ) {
          if (debouncedSearchParamsBlob.includedCategories === "") {
            searchParams.delete("includedCategories");
          } else {
            searchParams.set(
              "includedCategories",
              debouncedSearchParamsBlob.includedCategories
            );
          }
          resetPage = true;
        }
        if (
          oldExcludedCategories !== debouncedSearchParamsBlob.excludedCategories
        ) {
          if (debouncedSearchParamsBlob.excludedCategories === "") {
            searchParams.delete("excludedCategories");
          } else {
            searchParams.set(
              "excludedCategories",
              debouncedSearchParamsBlob.excludedCategories
            );
          }
          resetPage = true;
        }
        // Page number
        if (oldPage !== debouncedSearchParamsBlob.page) {
          if (debouncedSearchParamsBlob.page === 1 || resetPage) {
            searchParams.delete("page");
            setCurrentPage(1);
          } else {
            searchParams.set("page", String(debouncedSearchParamsBlob.page));
            setCurrentPage(debouncedSearchParamsBlob.page);
          }
        } else {
          if (resetPage) {
            searchParams.delete("page");
            setCurrentPage(1);
          }
        }
        const uncommittedSearchParams = searchParamsToBlob(
          searchParams,
          sortedSections
        );

        if (
          navigationType !== "POP" ||
          (navigationType === "POP" &&
            !compareSearchParamBlobs(
              uncommittedSearchParams,
              searchParamsBlobRef.current
            ) &&
            compareSearchParamBlobs(
              uncommittedSearchParams,
              debouncedSearchParamsBlob
            ))
        ) {
          if (useReplace) {
            setSearchParams(searchParams, {
              replace: true,
              preventScrollReset: true,
            });
          } else {
            setSearchParams(searchParams, { preventScrollReset: true });
          }
        }
        searchParamsBlobRef.current = debouncedSearchParamsBlob;
      }
    }
  }, [debouncedSearchParamsBlob]);

  // WHOLE LIKE THING
  const [ratedPackages, setRatedPackages] = useState<string[]>([]);
  const fetchAndSetRatedPackages = async () => {
    setRatedPackages((await dapper.getRatedPackages()).rated_packages);
  };

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    if (currentUserRef.current !== currentUser && currentUser?.username) {
      fetchAndSetRatedPackages();
      currentUserRef.current = currentUser;
    }
  }, [currentUser]);

  const likeAction = PackageLikeAction({
    isLoggedIn: Boolean(currentUser?.username),
    dataUpdateTrigger: fetchAndSetRatedPackages,
    config: config,
  });
  // WHOLE LIKE THING

  return (
    <div className="package-search">
      <div className="package-search__sidebar">
        <div className="package-search__filters">
          {sortedSections && sortedSections.length > 0 ? (
            <CollapsibleMenu headerTitle="Sections" defaultOpen>
              <RadioGroup
                sections={[
                  ...sortedSections,
                  {
                    uuid: "all",
                    name: "All",
                    slug: "all",
                    priority: -999999999,
                  },
                ]}
                selected={
                  searchParamsBlob.section === ""
                    ? sortedSections[0]?.uuid
                    : searchParamsBlob.section
                }
                setSelected={setParamsBlobValue(
                  setSearchParamsBlob,
                  searchParamsBlob,
                  "section"
                )}
              />
            </CollapsibleMenu>
          ) : null}
          {categories && categories.length > 0 ? (
            <CollapsibleMenu headerTitle="Categories" defaultOpen>
              <CheckboxList items={filtersCategoriesItems} />
            </CollapsibleMenu>
          ) : null}
          <CollapsibleMenu headerTitle="Other filters" defaultOpen>
            <CheckboxList
              items={[
                {
                  state: searchParamsBlob.deprecated,
                  setStateFunc: (v: boolean | TRISTATE) =>
                    setParamsBlobValue(
                      setSearchParamsBlob,
                      searchParamsBlob,
                      "deprecated"
                    )(
                      typeof v === "boolean"
                        ? v
                        : v === "include"
                          ? true
                          : false
                    ),
                  label: "Deprecated",
                },
                {
                  state: searchParamsBlob.nsfw,
                  setStateFunc: (v: boolean | TRISTATE) =>
                    setParamsBlobValue(
                      setSearchParamsBlob,
                      searchParamsBlob,
                      "nsfw"
                    )(
                      typeof v === "boolean"
                        ? v
                        : v === "include"
                          ? true
                          : false
                    ),
                  label: "NSFW",
                },
              ]}
            />
          </CollapsibleMenu>
        </div>
      </div>

      <div className="package-search__content">
        <NewTextInput
          placeholder="Search Mods..."
          value={searchParamsBlob.search}
          onChange={(e) =>
            setParamsBlobValue(
              setSearchParamsBlob,
              searchParamsBlob,
              "search"
            )(e.target.value)
          }
          clearValue={() =>
            setParamsBlobValue(
              setSearchParamsBlob,
              searchParamsBlob,
              "search"
            )("")
          }
          leftIcon={<FontAwesomeIcon icon={faSearch} />}
          id="searchInput"
          type="search"
          rootClasses="package-search__search"
        />
        <div className="package-search__search-params">
          <CategoryTagCloud
            searchValue={searchParamsBlob.search}
            setSearchValue={setParamsBlobValue(
              setSearchParamsBlob,
              searchParamsBlob,
              "search"
            )}
            categories={parseCategories(
              searchParamsBlob.includedCategories ?? "",
              searchParamsBlob.excludedCategories ?? "",
              categories
            )}
            setCategories={(v) =>
              setParamsBlobCategories(setSearchParamsBlob, searchParamsBlob, v)
            }
            rootClasses="package-search__tags"
            clearAll={clearAll(setSearchParamsBlob, searchParamsBlob)}
          />
          <div className="package-search__tools">
            <div className="package-search__listing-actions">
              <div className="package-search__sorting">
                <PackageOrder
                  order={searchParamsBlob.order ?? PackageOrderOptions.Updated}
                  setOrder={setParamsBlobValue(
                    setSearchParamsBlob,
                    searchParamsBlob,
                    "order"
                  )}
                />
              </div>
            </div>
            <div className="package-search__results">
              <Suspense fallback={<SkeletonBox />}>
                <Await resolve={listings}>
                  {(resolvedValue) => (
                    <PackageCount
                      page={currentPage}
                      pageSize={PER_PAGE}
                      searchQuery={searchParamsBlob.search}
                      totalCount={resolvedValue.count}
                    />
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
        <div className="package-search__packages">
          <Suspense fallback={<PackageSearchPackagesSkeleton />}>
            <Await resolve={listings}>
              {(resolvedValue) => (
                <>
                  {resolvedValue.results.length > 0 ? (
                    <div className="package-search__grid">
                      {resolvedValue.results.map((p) => (
                        <CardPackage
                          key={`${p.namespace}-${p.name}`}
                          packageData={p}
                          isLiked={ratedPackages.includes(
                            `${p.namespace}-${p.name}`
                          )}
                          packageLikeAction={() => {
                            if (likeAction) {
                              likeAction(
                                ratedPackages.includes(
                                  `${p.namespace}-${p.name}`
                                ),
                                p.namespace,
                                p.name,
                                Boolean(currentUser?.username)
                              );
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (searchParamsBlob.order !== undefined &&
                      searchParams.size > 1) ||
                    (searchParamsBlob.order === undefined &&
                      searchParams.size > 0) ? (
                    <EmptyState.Root className="no-result">
                      <EmptyState.Icon wrapperClasses="no-result__ghostbounce">
                        <FontAwesomeIcon icon={faSearch} />
                      </EmptyState.Icon>
                      <div className="no-result__info">
                        <EmptyState.Title>No results found</EmptyState.Title>
                        <EmptyState.Message>
                          Make sure all keywords are spelled correctly or try
                          different search parameters.
                        </EmptyState.Message>
                      </div>
                      <NewButton
                        onClick={() =>
                          resetParams(
                            setSearchParamsBlob,
                            searchParamsBlob.order,
                            sortedSections
                          )
                        }
                        rootClasses="no-result__button"
                      >
                        Clear all filters
                      </NewButton>
                    </EmptyState.Root>
                  ) : (
                    <EmptyState.Root className="no-result">
                      <EmptyState.Icon wrapperClasses="no-result__ghostbounce">
                        <FontAwesomeIcon icon={faGhost} />
                      </EmptyState.Icon>
                      <div className="no-result__info">
                        <EmptyState.Title>
                          It&apos;s empty in here
                        </EmptyState.Title>
                        <EmptyState.Message>
                          Be the first to upload a mod!
                        </EmptyState.Message>
                      </div>
                    </EmptyState.Root>
                  )}
                </>
              )}
            </Await>
          </Suspense>
        </div>
        <div className="package-search__pagination">
          <Suspense fallback={<SkeletonBox />}>
            <Await resolve={listings}>
              {(resolvedValue) => (
                <NewPagination
                  currentPage={currentPage}
                  onPageChange={setParamsBlobValue(
                    setSearchParamsBlob,
                    searchParamsBlob,
                    "page"
                  )}
                  pageSize={PER_PAGE}
                  siblingCount={4}
                  totalCount={resolvedValue.count}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

PackageSearch.displayName = "PackageSearch";

// Start setters
const setParamsBlobCategories = (
  setter: (v: SearchParamsType) => void,
  oldBlob: SearchParamsType,
  v: CategorySelection[]
) => {
  const newSearchParams = { ...oldBlob };
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
  setter({ ...newSearchParams });
};

const resetParams = (
  setter: (v: SearchParamsType) => void,
  order: PackageOrderOptionsType | undefined,
  sortedSections: CommunityFilters["sections"] | undefined
) => {
  setter({
    search: "",
    order: order,
    section: sortedSections
      ? sortedSections.length === 0
        ? ""
        : sortedSections[0]?.uuid
      : "",
    deprecated: false,
    nsfw: false,
    page: 1,
    includedCategories: "",
    excludedCategories: "",
  });
};

const clearAll =
  (setter: (v: SearchParamsType) => void, oldBlob: SearchParamsType) => () =>
    setter({
      ...oldBlob,
      search: "",
      includedCategories: "",
      excludedCategories: "",
    });
// End setters

const PackageSearchPackagesSkeleton = memo(
  function PackageSearchPackagesSkeleton() {
    return (
      <div className="package-search__grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonBox key={index} />
        ))}
      </div>
    );
  }
);
