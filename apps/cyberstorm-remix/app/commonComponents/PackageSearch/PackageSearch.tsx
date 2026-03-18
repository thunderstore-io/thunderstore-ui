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
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  type CurrentUser,
  type PackageListings,
} from "@thunderstore/dapper/types";
import {
  type CommunityFilters,
  type RequestConfig,
} from "@thunderstore/thunderstore-api";

import { CheckboxList } from "../CheckboxList/CheckboxList";
import { CollapsibleMenu } from "../Collapsible/Collapsible";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { type CategorySelection, type TRISTATE } from "../types";
import {
  type SearchParamsType,
  clearAll,
  compareSearchParamBlobs,
  parseCategories,
  resetParams,
  searchParamsToBlob,
  setParamsBlobCategories,
  synchronizeSearchParams,
} from "./PackageSearchLogic";
import { CategoryTagCloud } from "./components/CategoryTagCloud/CategoryTagCloud";
import { PackageCount } from "./components/PackageCount/PackageCount";
import { PackageOrder } from "./components/PackageOrder";
import { PackageOrderOptions } from "./components/packageOrderOptions";

const PER_PAGE = 20;

interface Props {
  listings: Promise<PackageListings> | PackageListings;
  filters: Promise<CommunityFilters> | CommunityFilters;
  config: () => RequestConfig;
  currentUser?: CurrentUser;
  dapper: DapperTs;
}

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
  >(
    possibleFilters?.sections
      ? [...possibleFilters.sections].sort((a, b) => b.priority - a.priority)
      : undefined
  );

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
        const sections = resolvedFilters.sections.sort(
          (a, b) => b.priority - a.priority
        );
        setSortedSections(sections);
        if (sections.length !== 0) {
          setSearchParamsBlob((prev) =>
            prev.section === "" ? { ...prev, section: sections[0].uuid } : prev
          );
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
      value: c.id,
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
  }, [searchParams, sortedSections]);

  useEffect(() => {
    if (
      navigationType !== "POP" ||
      (navigationType === "POP" &&
        searchParamsBlobRef.current !== debouncedSearchParamsBlob)
    ) {
      if (searchParamsBlobRef.current !== debouncedSearchParamsBlob) {
        const { useReplace, resetPage, newPage } = synchronizeSearchParams(
          searchParams,
          debouncedSearchParamsBlob,
          searchParamsBlobRef.current,
          sortedSections
        );

        if (newPage !== currentPage || resetPage) {
          setCurrentPage(newPage);
        }

        const uncommittedSearchParams = searchParamsToBlob(
          searchParams,
          sortedSections
        );

        if (
          !compareSearchParamBlobs(
            uncommittedSearchParams,
            searchParamsBlobRef.current
          )
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
  }, [debouncedSearchParamsBlob, sortedSections]);

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
                  value: "deprecated",
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
                  value: "nsfw",
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
