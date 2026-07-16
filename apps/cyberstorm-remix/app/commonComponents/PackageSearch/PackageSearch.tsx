import { faGhost, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faFilterList } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setParamsBlobValue } from "cyberstorm/utils/searchParamsUtils";
import { isPromise } from "cyberstorm/utils/typeChecks";
import {
  type ReactNode,
  Suspense,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { Await, useNavigationType, useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";
import { FetchErrorState } from "~/commonComponents/FetchErrorState/FetchErrorState";

import {
  CardPackage,
  Drawer,
  DrawerDivider,
  EmptyState,
  Heading,
  NewButton,
  NewIcon,
  NewPagination,
  NewTextInput,
  SkeletonBox,
  classnames,
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
  // `null` = the filters fetch failed; the search still renders with an in-place
  // filters error instead of throwing the route (TS-3397).
  filters: Promise<CommunityFilters> | CommunityFilters | null;
  config: () => RequestConfig;
  currentUser?: CurrentUser;
  dapper: DapperTs;
  teamName?: string;
  // Rendered at the top of the sidebar, above the filters. The community page
  // passes its 300×250 ad here; when set, the sidebar widens to hold it (see
  // .package-search--with-sidebar-ad in PackageSearch.css).
  sidebarSlot?: ReactNode;
}

/**
 * Component for filtering and rendering a PackageList
 */
export function PackageSearch(props: Props) {
  const {
    listings,
    filters,
    config,
    currentUser,
    dapper,
    teamName,
    sidebarSlot,
  } = props;

  const navigationType = useNavigationType();

  // This exists to resolve insert the initial sections and categories on server-side
  // so that we don't have to await the clientLoader to get the options, to then be able to
  // do the initial fetch
  const possibleFilters = filters && !isPromise(filters) ? filters : undefined;

  // `null` means the filters fetch failed — render an in-place error + retry.
  const filtersErrored = filters === null;

  const [sortedSections, setSortedSections] = useState<
    CommunityFilters["sections"] | undefined
  >(
    possibleFilters?.sections
      ? [...possibleFilters.sections].sort((a, b) => b.priority - a.priority)
      : undefined
  );

  const [categories, setCategories] = useState<CategorySelection[] | undefined>(
    possibleFilters?.package_categories
      ? [...possibleFilters.package_categories]
          .sort((a, b) => a.slug.localeCompare(b.slug))
          .map((c) => ({ ...c, selection: "off" }))
      : undefined
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams = searchParamsToBlob(searchParams, sortedSections);

  const [searchParamsBlob, setSearchParamsBlob] =
    useState<SearchParamsType>(initialParams);

  const [currentPage, setCurrentPage] = useState(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );

  // Seed the section + category lists once filters are available. `filters` may
  // be a Promise (client), already resolved (SSR), or null (fetch failed). Only
  // seeds while sortedSections is undefined: once on the happy path (the useState
  // initialisers already seeded from SSR data) and again after a retry recovers
  // from null. Clones before sorting to avoid mutating loader data; selections
  // live in the URL, so re-seeding never drops the user's picks.
  useEffect(() => {
    if (!filters || sortedSections !== undefined) return;
    let cancelled = false;
    const seed = (resolved: CommunityFilters) => {
      if (cancelled) return;
      const sections = [...resolved.sections].sort(
        (a, b) => b.priority - a.priority
      );
      setSortedSections(sections);
      if (sections.length !== 0) {
        setSearchParamsBlob((prev) =>
          prev.section === "" ? { ...prev, section: sections[0].uuid } : prev
        );
      }
      setCategories(
        [...resolved.package_categories]
          .sort((a, b) => a.slug.localeCompare(b.slug))
          .map((c) => ({ ...c, selection: "off" }))
      );
    };
    // A rejected promise is surfaced via the `filters === null` path, not here.
    if (isPromise(filters)) filters.then(seed, () => undefined);
    else seed(filters);
    return () => {
      cancelled = true;
    };
  }, [filters, sortedSections]);

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
          const isOnlyPageChange = !resetPage && newPage !== currentPage;

          // Suppress ScrollRestoration on every navigation; on a page change we
          // scroll to the top ourselves so it's instant instead of being
          // animated by the global `scroll-behavior: smooth`.
          if (useReplace) {
            setSearchParams(searchParams, {
              replace: true,
              preventScrollReset: true,
            });
          } else {
            setSearchParams(searchParams, { preventScrollReset: true });
          }

          if (isOnlyPageChange) {
            const root = document.documentElement;
            const previousScrollBehavior = root.style.scrollBehavior;
            root.style.scrollBehavior = "auto";
            window.scrollTo(0, 0);
            root.style.scrollBehavior = previousScrollBehavior;
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

  const filtersContent = filtersErrored ? (
    <FetchErrorState message="Couldn't load filters." />
  ) : (
    <>
      {sortedSections ? (
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
              searchParamsBlob.section === "" || sortedSections.length === 0
                ? sortedSections.length > 0
                  ? sortedSections[0].uuid
                  : "all"
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
                )(typeof v === "boolean" ? v : v === "include" ? true : false),
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
                )(typeof v === "boolean" ? v : v === "include" ? true : false),
              label: "NSFW",
              value: "nsfw",
            },
          ]}
        />
      </CollapsibleMenu>
    </>
  );

  return (
    <div
      className={classnames(
        "package-search",
        sidebarSlot ? "package-search--with-sidebar-ad" : undefined
      )}
    >
      <div className="package-search__sidebar">
        {sidebarSlot}
        <div className="package-search__filters">{filtersContent}</div>
      </div>

      <div className="package-search__content">
        <div className="package-search__search-wrapper">
          <NewTextInput
            placeholder="Search Mods..."
            aria-label="Search mods"
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
          <Drawer
            popoverId="package-search-filters-drawer"
            headerContent={
              <Heading csLevel="3" csSize="3">
                Filters
              </Heading>
            }
            trigger={
              <NewButton
                popoverTarget="package-search-filters-drawer"
                aria-label="Filters"
                rootClasses="package-search__drawer-toggle"
                csVariant="secondary"
                csModifiers={["only-icon"]}
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faFilterList} />
                </NewIcon>
              </NewButton>
            }
          >
            <div className="package-search__filters package-search__filters--drawer">
              <div className="package-search__drawer-sorting">
                <PackageOrder
                  order={searchParamsBlob.order ?? PackageOrderOptions.Updated}
                  setOrder={setParamsBlobValue(
                    setSearchParamsBlob,
                    searchParamsBlob,
                    "order"
                  )}
                />
              </div>
              <DrawerDivider />
              {filtersContent}
            </div>
          </Drawer>
        </div>
        <div className="package-search__search-params">
          <div className="package-search__results">
            <Suspense fallback={<SkeletonBox />}>
              {/* Silent on failure — the grid Await owns the visible error. */}
              <Await resolve={listings} errorElement={<></>}>
                {(resolvedValue) => (
                  <PackageCount
                    page={currentPage}
                    pageSize={PER_PAGE}
                    totalCount={resolvedValue.count}
                  />
                )}
              </Await>
            </Suspense>
          </div>
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
        </div>
        <div className="package-search__packages">
          <Suspense fallback={<PackageSearchPackagesSkeleton />}>
            <Await
              resolve={listings}
              errorElement={
                <FetchErrorState message="Couldn't load packages." />
              }
            >
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
                          {teamName
                            ? `Team ${teamName} hasn't uploaded any mods for this community yet.`
                            : "Be the first to upload a mod!"}
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
            <Await resolve={listings} errorElement={<></>}>
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
          <Suspense fallback={<SkeletonBox />}>
            <Await resolve={listings} errorElement={<></>}>
              {(resolvedValue) =>
                resolvedValue.count > 0 ? (
                  <PackageCount
                    page={currentPage}
                    pageSize={PER_PAGE}
                    totalCount={resolvedValue.count}
                  />
                ) : null
              }
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
