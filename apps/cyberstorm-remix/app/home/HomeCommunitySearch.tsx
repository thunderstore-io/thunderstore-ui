import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Await, useNavigate } from "react-router";
import { FetchErrorState } from "~/commonComponents/FetchErrorState/FetchErrorState";

import {
  CardCommunity,
  Heading,
  NewLink,
  NewTextInput,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import type { Communities, Community } from "@thunderstore/dapper/types";

// Matches the card count of the home page community rows, so the results row
// lines up with the rest of the page (see .home__card-row).
const MAX_RESULTS = 7;

interface Props {
  communities: Communities | Promise<Communities>;
}

/**
 * Home page hero search. Filters the already-loaded community list into a
 * dropdown pane, so typing never hits the network.
 */
export function HomeCommunitySearch(props: Props) {
  const { communities } = props;
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paneId = useId();
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const query = searchValue.trim();
  const isVisible = isOpen && query !== "";
  const searchUrl = `/communities?search=${encodeURIComponent(query)}`;

  const closePane = useCallback(() => setIsOpen(false), []);

  // Mousedown closes on pointer dismissal, focusout on keyboard tab-out.
  useEffect(() => {
    if (!isVisible) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closePane();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, closePane]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && container.contains(nextTarget)) {
        return;
      }
      requestAnimationFrame(() => {
        if (!container.contains(document.activeElement)) {
          closePane();
        }
      });
    };

    container.addEventListener("focusout", handleFocusOut);
    return () => {
      container.removeEventListener("focusout", handleFocusOut);
    };
  }, [closePane]);

  return (
    <div className="home-search" ref={containerRef}>
      <NewTextInput
        onChange={(e) => {
          setSearchValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        enterHook={() => {
          if (query !== "") navigate(searchUrl);
        }}
        value={searchValue}
        placeholder="Search communities..."
        aria-label="Search communities"
        aria-expanded={isVisible}
        aria-controls={isVisible ? paneId : undefined}
        clearValue={() => setSearchValue("")}
        leftIcon={<FontAwesomeIcon icon={faSearch} />}
        type="search"
        rootClasses="home-search__input"
      />
      {isVisible ? (
        <div
          className="home-search__pane"
          id={paneId}
          role="region"
          aria-label="Community search results"
        >
          <Suspense fallback={<PaneSkeleton />}>
            <Await
              resolve={communities}
              errorElement={
                <FetchErrorState message="Couldn't load communities." />
              }
            >
              {(resolvedValue) => (
                <PaneContent
                  communitiesData={resolvedValue}
                  query={query}
                  searchQueryParams={`search=${encodeURIComponent(query)}`}
                />
              )}
            </Await>
          </Suspense>
        </div>
      ) : null}
    </div>
  );
}

function PaneContent(props: {
  communitiesData: Communities;
  query: string;
  searchQueryParams: string;
}) {
  const { communitiesData, query, searchQueryParams } = props;

  const results = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return communitiesData.results
      .filter((community: Community) =>
        community.name.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, MAX_RESULTS);
  }, [communitiesData, query]);

  return (
    <>
      <div className="home-search__pane-header">
        <Heading csLevel="2" csSize="3" rootClasses="home-search__pane-heading">
          Search results for &ldquo;{query}&rdquo;
        </Heading>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          queryParams={searchQueryParams}
          csVariant="cyber"
          rootClasses="home__see-all"
        >
          See all
        </NewLink>
      </div>
      {results.length > 0 ? (
        <div className="home__card-row">
          {results.map((community) => (
            <CardCommunity key={community.identifier} community={community} />
          ))}
        </div>
      ) : (
        <p className="home-search__empty">
          No communities matched your search.
        </p>
      )}
      <div className="home-search__pane-footer">
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Communities"
          rootClasses="home-search__all-link"
        >
          See all communities ({communitiesData.count})
        </NewLink>
      </div>
    </>
  );
}

const PaneSkeleton = memo(function PaneSkeleton() {
  return (
    <div className="home-search__pane-skeleton">
      <SkeletonBox />
    </div>
  );
});
