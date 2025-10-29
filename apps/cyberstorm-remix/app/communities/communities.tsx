import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  CardCommunity,
  EmptyState,
  NewTextInput,
  NewSelect,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import "./Communities.css";
import { useState, useEffect, useRef, memo, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowDownAZ,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faGhost, faFire } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "use-debounce";
import {
  Await,
  useLoaderData,
  useNavigationType,
  useRouteError,
  useSearchParams,
} from "react-router";
import type { Communities } from "@thunderstore/dapper/types";
import { DapperTs } from "@thunderstore/dapper-ts";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import {
  FORBIDDEN_MAPPING,
  SIGN_IN_REQUIRED_MAPPING,
} from "cyberstorm/utils/errors/loaderMappings";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import { Heading } from "@thunderstore/cyberstorm";

const communitiesErrorMappings = [SIGN_IN_REQUIRED_MAPPING, FORBIDDEN_MAPPING];

export const meta: MetaFunction = () => {
  return [
    { title: "Communities | Thunderstore" },
    {
      name: "description",
      content: "Browse all communities on Thunderstore",
    },
  ];
};

enum SortOptions {
  Name = "name",
  Latest = "-datetime_created",
  Popular = "-aggregated_fields__package_count",
  MostDownloads = "-aggregated_fields__download_count",
}

const selectOptions = [
  {
    value: SortOptions.Name,
    label: "Name",
    leftIcon: <FontAwesomeIcon icon={faArrowDownAZ} />,
  },
  {
    value: SortOptions.Latest,
    label: "Latest",
    leftIcon: <FontAwesomeIcon icon={faStar} />,
  },
  {
    value: SortOptions.Popular,
    label: "Popular",
    leftIcon: <FontAwesomeIcon icon={faFire} />,
  },
];

interface CommunitiesQuery {
  order: SortOptions;
  search: string | undefined;
}

/**
 * Extracts the current query parameters governing the communities list.
 */
function resolveCommunitiesQuery(request: Request): CommunitiesQuery {
  const searchParams = new URL(request.url).searchParams;
  const orderParam = searchParams.get("order");
  const orderValues = Object.values(SortOptions);
  const order =
    orderParam && orderValues.includes(orderParam as SortOptions)
      ? (orderParam as SortOptions)
      : SortOptions.Popular;
  const search = searchParams.get("search") ?? undefined;

  return {
    order,
    search,
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const query = resolveCommunitiesQuery(request);
  const page = undefined;
  const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
  const dapper = new DapperTs(() => {
    return {
      apiHost: publicEnvVariables.VITE_API_URL,
      sessionId: undefined,
    };
  });
  try {
    return {
      communities: await dapper.getCommunities(page, query.order, query.search),
    };
  } catch (error) {
    handleLoaderError(error, { mappings: communitiesErrorMappings });
  }
}

export function clientLoader({ request }: LoaderFunctionArgs) {
  const tools = getSessionTools();
  const dapper = new DapperTs(() => {
    return {
      apiHost: tools?.getConfig().apiHost,
      sessionId: tools?.getConfig().sessionId,
    };
  });
  const query = resolveCommunitiesQuery(request);
  const page = undefined;
  return {
    communities: dapper.getCommunities(page, query.order, query.search),
  };
}

export default function CommunitiesPage() {
  const { communities } = useLoaderData<typeof loader | typeof clientLoader>();
  const navigationType = useNavigationType();

  const [searchParams, setSearchParams] = useSearchParams();
  // TODO: Disabled until we can figure out how a proper way to display skeletons
  // const navigation = useNavigation();

  const changeOrder = (v: SortOptions) => {
    if (v === SortOptions.Popular) {
      searchParams.delete("order");
    } else {
      searchParams.set("order", v);
    }
    setSearchParams(searchParams, { preventScrollReset: true });
  };

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

  const searchRef = useRef(debouncedSearchValue);

  useEffect(() => {
    if (debouncedSearchValue !== searchRef.current) {
      if (debouncedSearchValue === "") {
        searchParams.delete("search");
        setSearchParams(searchParams, {
          replace: true,
          preventScrollReset: true,
        });
      } else {
        searchParams.set("search", debouncedSearchValue);
        setSearchParams(searchParams, {
          replace: true,
          preventScrollReset: true,
        });
      }
      searchRef.current = debouncedSearchValue;
    }
  }, [debouncedSearchValue]);

  return (
    <>
      <PageHeader headingLevel="1" headingSize="3">
        Communities
      </PageHeader>
      <div className="container container--y container--full communities__content">
        <div className="container container--stretch communities__tools">
          <NewTextInput
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder="Search communities..."
            clearValue={() => setSearchValue("")}
            leftIcon={<FontAwesomeIcon icon={faSearch} />}
            type="search"
            rootClasses="communities__search"
            csSize="small"
          />
          <span className="container container--x">
            <NewSelect
              onChange={(val) => changeOrder(val as SortOptions)}
              options={selectOptions}
              value={searchParams.get("order") ?? SortOptions.Popular}
              aria-label="Sort communities by"
            />
          </span>
        </div>

        <div className="container container--x container--stretch communities__results">
          <Suspense fallback={<CommunitiesListSkeleton />}>
            <Await resolve={communities}>
              {(resolvedValue) => (
                <CommunitiesList communitiesData={resolvedValue} />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </>
  );
}

/**
 * Renders a user-facing message when the communities route loader rejects.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <div className="container container--y container--full communities__error">
      <Heading csLevel="2" csSize="3" csVariant="primary" mode="display">
        {payload.headline}
      </Heading>
      {payload.description ? (
        <p className="communities__error-description">{payload.description}</p>
      ) : null}
    </div>
  );
}

const CommunitiesList = memo(function CommunitiesList(props: {
  communitiesData: Communities;
}) {
  const { communitiesData } = props;

  if (communitiesData.results.length > 0) {
    return (
      <div className="communities__communities-list">
        {communitiesData.results.map((community) => (
          <CardCommunity
            key={community.identifier}
            community={community}
            isPopular={community.total_package_count > 1000}
            isNew={
              new Date(community.datetime_created).getTime() >
              new Date().getTime() - 1000 * 60 * 60 * 336
            }
          />
        ))}
      </div>
    );
  } else {
    return (
      <EmptyState.Root className="no-result">
        <EmptyState.Icon wrapperClasses="no-result__ghostbounce">
          <FontAwesomeIcon icon={faGhost} />
        </EmptyState.Icon>
        <EmptyState.Title>It&apos;s empty in there.</EmptyState.Title>
      </EmptyState.Root>
    );
  }
});

const CommunitiesListSkeleton = memo(function CommunitiesListSkeleton() {
  return (
    <div className="communities__communities-list">
      {Array.from({ length: 14 }).map((_, index) => (
        <div key={index} className="communities__community-skeleton">
          <div className="communities__community-skeleton-image">
            <SkeletonBox />
          </div>
          <div className="communities__community-skeleton-content">
            <div className="communities__community-skeleton-title">
              <SkeletonBox />
            </div>
            <div className="communities__community-skeleton-meta">
              <SkeletonBox />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
