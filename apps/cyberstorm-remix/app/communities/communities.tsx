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
  useSearchParams,
} from "react-router";
import type { Communities } from "@thunderstore/dapper/types";
import { DapperTs } from "@thunderstore/dapper-ts";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const order = searchParams.get("order") ?? SortOptions.Popular;
  const search = searchParams.get("search");
  const page = undefined;
  const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
  const dapper = new DapperTs(() => {
    return {
      apiHost: publicEnvVariables.VITE_API_URL,
      sessionId: undefined,
    };
  });
  return {
    communities: await dapper.getCommunities(
      page,
      order === null ? undefined : order,
      search === null ? undefined : search
    ),
  };
}

export async function clientLoader({ request }: LoaderFunctionArgs) {
  const tools = getSessionTools();
  const dapper = new DapperTs(() => {
    return {
      apiHost: tools?.getConfig().apiHost,
      sessionId: tools?.getConfig().sessionId,
    };
  });
  const searchParams = new URL(request.url).searchParams;
  const order = searchParams.get("order");
  const search = searchParams.get("search");
  const page = undefined;
  return {
    communities: dapper.getCommunities(
      page,
      order ?? SortOptions.Popular,
      search ?? ""
    ),
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
            <Await
              resolve={communities}
              errorElement={<div>Error loading communities</div>}
            >
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
