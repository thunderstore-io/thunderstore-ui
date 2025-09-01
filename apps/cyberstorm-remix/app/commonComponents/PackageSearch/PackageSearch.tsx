import { faGhost, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CurrentUser,
  PackageCategory,
  PackageListings,
  Section,
} from "@thunderstore/dapper/types";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import "./PackageSearch.css";
import { CategorySelection, TRISTATE } from "../types";
import {
  CardPackage,
  EmptyState,
  NewButton,
  NewPagination,
  NewTextInput,
} from "@thunderstore/cyberstorm";
import { Await, useNavigationType, useSearchParams } from "react-router";
import { PackageCount } from "./components/PackageCount/PackageCount";
import {
  isPackageOrderOptions,
  PackageOrder,
  PackageOrderOptions,
  PackageOrderOptionsType,
} from "./components/PackageOrder";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { CategoryTagCloud } from "./components/CategoryTagCloud/CategoryTagCloud";
import { CollapsibleMenu } from "../Collapsible/Collapsible";
import { CheckboxList } from "../CheckboxList/CheckboxList";
// import { StalenessIndicator } from "../StalenessIndicator/StalenessIndicator";
import { PackageLikeAction } from "@thunderstore/cyberstorm-forms";
import { RequestConfig } from "@thunderstore/thunderstore-api";
import { DapperTs } from "@thunderstore/dapper-ts";

const PER_PAGE = 20;

interface Props {
  listings: Promise<PackageListings>;
  packageCategories: PackageCategory[];
  sections: Section[];
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
  sections: Section[]
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
    section: sections.length === 0 ? "" : initialSection ?? sections[0]?.uuid,
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
  categories: CategorySelection[],
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
  const {
    listings,
    packageCategories: allCategories,
    sections,
    config,
    currentUser,
    dapper,
  } = props;

  const navigationType = useNavigationType();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams = searchParamsToBlob(searchParams, sections);

  const [searchParamsBlob, setSearchParamsBlob] =
    useState<SearchParamsType>(initialParams);

  const [currentPage, setCurrentPage] = useState(initialParams.page);

  // Start setters
  const setSearch = (v: string) => {
    setSearchParamsBlob({ ...searchParamsBlob, search: v });
  };

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

  const setOrder = (v: PackageOrderOptionsType) => {
    setSearchParamsBlob({ ...searchParamsBlob, order: v });
  };

  const resetParams = (order: PackageOrderOptionsType | undefined) => {
    setSearchParamsBlob({
      search: "",
      order: order,
      section: sections.length === 0 ? "" : sections[0]?.uuid,
      deprecated: false,
      nsfw: false,
      page: 1,
      includedCategories: "",
      excludedCategories: "",
    });
    // setOrdering(order);
    // setPage(1);
    // setSearchValue("");
  };

  const clearAll = () =>
    setSearchParamsBlob({
      ...searchParamsBlob,
      search: "",
      includedCategories: "",
      excludedCategories: "",
    });
  // End setters

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
    setSearchParamsBlob({ ...newSearchParams });
  };

  const parsedCategories = parseCategories(
    categories,
    searchParamsBlob.includedCategories,
    searchParamsBlob.excludedCategories
  );

  const updateCatSelection = (catId: string, v: TRISTATE) => {
    setCategories(
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
        const spb = searchParamsToBlob(searchParams, sections);
        setSearchParamsBlob(spb);
        setCurrentPage(spb.page);
        searchParamsRef.current = searchParams;
      }
      searchParamsBlobRef.current = searchParamsToBlob(searchParams, sections);
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
        // Because of the first section being a empty value, the logic check is a bit funky

        // If no section in search params, delete
        if (sections.length === 0) searchParams.delete("section");

        // If new section is empty, delete (defaults to first)
        if (debouncedSearchParamsBlob.section === "")
          searchParams.delete("section");

        // If new section is the first one, delete. And reset page number if section is different from last render.
        if (debouncedSearchParamsBlob.section === sections[0]?.uuid) {
          if (
            searchParamsBlobRef.current.section !==
            debouncedSearchParamsBlob.section
          ) {
            resetPage = true;
          }
          searchParams.delete("section");
        }

        // If new section is different and not the first one, set it.
        if (
          searchParamsBlobRef.current.section !==
            debouncedSearchParamsBlob.section &&
          debouncedSearchParamsBlob.section !== sections[0]?.uuid
        ) {
          searchParams.set("section", debouncedSearchParamsBlob.section);
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
          sections
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

  // End updating page

  // Start actions
  const likeAction = PackageLikeAction({
    isLoggedIn: Boolean(currentUser?.username),
    dataUpdateTrigger: fetchAndSetRatedPackages,
    config: config,
  });
  // End actions

  return (
    <div className="package-search">
      <div className="package-search__sidebar">
        <NewTextInput
          placeholder="Search Mods..."
          value={searchParamsBlob.search}
          onChange={(e) => setSearch(e.target.value)}
          clearValue={() => setSearch("")}
          leftIcon={<FontAwesomeIcon icon={faSearch} />}
          id="searchInput"
          type="search"
          rootClasses="package-search__search"
        />
        <div className="package-search__filters">
          {sections.length > 0 ? (
            <CollapsibleMenu headerTitle="Sections" defaultOpen>
              <RadioGroup
                sections={[
                  ...sections,
                  {
                    uuid: "all",
                    name: "All",
                    slug: "all",
                    priority: -999999999,
                  },
                ]}
                selected={searchParamsBlob.section ?? sections[0]?.uuid}
                setSelected={setSection}
              />
            </CollapsibleMenu>
          ) : null}
          {categories.length > 0 ? (
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
                    setDeprecated(
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
                    setNsfw(
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
        <div className="package-search__search-params">
          <CategoryTagCloud
            searchValue={searchParamsBlob.search}
            setSearchValue={setSearch}
            categories={parseCategories(
              categories,
              searchParamsBlob.includedCategories ?? "",
              searchParamsBlob.excludedCategories ?? ""
            )}
            setCategories={setCategories}
            rootClasses="package-search__tags"
            clearAll={clearAll}
          />
          <div className="package-search__tools">
            <div className="package-search__results">
              <Suspense fallback={<>Loading...</>}>
                <Await resolve={listings} errorElement={<></>}>
                  {(resolvedValue) => {
                    return (
                      <PackageCount
                        page={currentPage}
                        pageSize={PER_PAGE}
                        searchQuery={searchParamsBlob.search}
                        totalCount={resolvedValue.count}
                      />
                    );
                  }}
                </Await>
              </Suspense>
            </div>
            <div className="package-search__listing-actions">
              {/* <div className="__display"></div> */}
              <div className="package-search__sorting">
                <PackageOrder
                  order={searchParamsBlob.order ?? PackageOrderOptions.Updated}
                  setOrder={setOrder}
                />
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<>Loading...</>}>
          <Await resolve={listings} errorElement={<></>}>
            {(resolvedValue) => {
              return (
                <div className="package-search__packages">
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
                        onClick={() => resetParams(searchParamsBlob.order)}
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
                </div>
              );
            }}
          </Await>
        </Suspense>
        <div className="package-search__pagination">
          <Suspense fallback={<>Loading...</>}>
            <Await resolve={listings} errorElement={<></>}>
              {(resolvedValue) => {
                return (
                  <NewPagination
                    currentPage={currentPage}
                    onPageChange={setPage}
                    pageSize={PER_PAGE}
                    siblingCount={4}
                    totalCount={resolvedValue.count}
                  />
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

PackageSearch.displayName = "PackageSearch";
