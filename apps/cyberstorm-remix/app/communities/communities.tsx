import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  BreadCrumbs,
  CommunityCard,
  CommunityCardSkeleton,
  EmptyState,
  PageHeader,
  Select,
  TextInput,
  range,
} from "@thunderstore/cyberstorm";
import rootStyles from "../RootLayout.module.css";
import searchAndOrderStyles from "./SearchAndOrder.module.css";
import communitiesListStyles from "./CommunityList.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowDownAZ,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faGhost, faFire } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "use-debounce";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { Communities } from "@thunderstore/dapper/types";
import { getDapper } from "cyberstorm/dapper/sessionUtils";

export const meta: MetaFunction = () => {
  return [
    { title: "Communities" },
    {
      name: "description",
      content:
        "Browse all the available communities for games in Thunderstore!",
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
  const dapper = await getDapper();
  return await dapper.getCommunities(page, order ?? "", search ?? "");
  // REMIX TODO: Add sentry and try except so, that we get a proper error page
  // throw new Response("Community not found", { status: 404 });
}

export async function clientLoader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const order = searchParams.get("order") ?? SortOptions.Popular;
  const search = searchParams.get("search");
  const page = undefined;
  const dapper = await getDapper(true);
  return await dapper.getCommunities(page, order ?? "", search ?? "");
  // REMIX TODO: Add sentry and try except so, that we get a proper error page
  // throw new Response("Community not found", { status: 404 });
}

export default function CommunitiesPage() {
  const communitiesData = useLoaderData<typeof loader | typeof clientLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const changeOrder = (v: SortOptions) => {
    searchParams.set("order", v);
    setSearchParams(searchParams);
  };

  const [searchValue, setSearchValue] = useState(
    searchParams.getAll("search").join(" ")
  );
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  useEffect(() => {
    if (debouncedSearchValue === "") {
      searchParams.delete("search");
      setSearchParams(searchParams);
    } else {
      searchParams.set("search", debouncedSearchValue);
      setSearchParams(searchParams);
    }
  }, [debouncedSearchValue]);

  return (
    <>
      <BreadCrumbs>Communities</BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <PageHeader title="Communities" />
      </header>
      <main className={rootStyles.main}>
        <div className={searchAndOrderStyles.root}>
          <div className={searchAndOrderStyles.searchTextInput}>
            <TextInput
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              placeholder="Search communities..."
              clearValue={() => setSearchValue("")}
              leftIcon={<FontAwesomeIcon icon={faSearch} />}
            />
          </div>
          <div className={searchAndOrderStyles.searchFilters}>
            <div className={searchAndOrderStyles.searchFiltersSortLabel}>
              Sort by
            </div>
            <Select
              onChange={changeOrder}
              options={selectOptions}
              value={searchParams.get("order") ?? SortOptions.Popular}
            />
          </div>
        </div>

        {navigation.state === "loading" ? (
          <CommunitiesListSkeleton />
        ) : (
          <CommunitiesList communitiesData={communitiesData} />
        )}
      </main>
    </>
  );
}

function CommunitiesList(props: { communitiesData: Communities }) {
  const { communitiesData } = props;

  if (communitiesData.results.length > 0) {
    return (
      <div className={communitiesListStyles.root}>
        {communitiesData.results.map((community) => (
          <CommunityCard key={community.identifier} community={community} />
        ))}
      </div>
    );
  } else {
    return (
      <EmptyState.Root className={communitiesListStyles.noResultPadding}>
        <EmptyState.Icon wrapperClasses={communitiesListStyles.ghostBounce}>
          <FontAwesomeIcon icon={faGhost} />
        </EmptyState.Icon>
        <EmptyState.Title>It&apos;s empty in there.</EmptyState.Title>
      </EmptyState.Root>
    );
  }
}

export const CommunitiesListSkeleton = () => {
  return (
    <div className={communitiesListStyles.root}>
      {range(1, 18).map((community) => (
        <CommunityCardSkeleton key={community} />
      ))}
    </div>
  );
};
