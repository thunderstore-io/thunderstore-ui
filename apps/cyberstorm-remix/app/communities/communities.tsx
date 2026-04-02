import {
  faArrowDownAZ,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faFire, faGhost } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { memo, useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigationType,
  useSearchParams,
} from "react-router";
import { useDebounce } from "use-debounce";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { SuspenseIfPromise } from "~/commonComponents/SuspenseIfPromise/SuspenseIfPromise";

import {
  CardCommunity,
  EmptyState,
  NewSelect,
  NewTextInput,
  SkeletonBox,
} from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";
import type { Communities } from "@thunderstore/dapper/types";

import type { Route } from "./+types/communities";
import "./Communities.css";

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

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const order = searchParams.get("order") ?? SortOptions.Popular;
  const search = searchParams.get("search");
  const page = undefined;
  const dapper = new DapperTs(() => {
    return {
      apiHost: getApiHostForSsr(),
      sessionId: undefined,
    };
  });
  return {
    communities: await dapper.getCommunities(
      page,
      order === null ? undefined : order,
      search === null ? undefined : search
    ),
    seo: createSeo({
      descriptors: [
        { title: "Communities | Thunderstore" },
        {
          name: "description",
          content: "Browse all communities on Thunderstore",
        },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: `${url.origin}/communities`,
        },
        { property: "og:title", content: "Communities | Thunderstore" },
        {
          property: "og:description",
          content: "Browse all communities on Thunderstore",
        },
        { property: "og:site_name", content: "Thunderstore" },
      ],
    }),
  };
}

export async function clientLoader({
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
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

  const serverData = await serverLoader();

  return {
    communities: dapper.getCommunities(
      page,
      order ?? SortOptions.Popular,
      search ?? ""
    ),
    seo: serverData.seo,
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
          <SuspenseIfPromise
            resolve={communities}
            fallback={<CommunitiesListSkeleton />}
            errorElement={<div>Error loading communities</div>}
          >
            {(resolvedValue) => (
              <CommunitiesList communitiesData={resolvedValue} />
            )}
          </SuspenseIfPromise>
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
