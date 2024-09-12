import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Container,
  CardCommunity,
  CommunityCardSkeleton,
  EmptyState,
  Heading,
  NewBreadCrumbs,
  range,
  NewTextInput,
  NewSelect,
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
  const [debouncedSearchValue] = useDebounce(searchValue, 300, {
    maxWait: 300,
  });

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
      <NewBreadCrumbs>Communities</NewBreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <Heading level="2" variant="primary" mode="display">
          Communities
        </Heading>
      </header>
      <main className={rootStyles.main}>
        <Container
          rootClasses={searchAndOrderStyles.root}
          csVariant="tertiary"
          csTextStyles={["fontWeightBold", "lineHeightAuto", "fontSizeS"]}
        >
          <div className={searchAndOrderStyles.searchTextInput}>
            Search
            <NewTextInput
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              placeholder="Search communities..."
              clearValue={() => setSearchValue("")}
              leftIcon={<FontAwesomeIcon icon={faSearch} />}
              csColor="cyber-green"
            />
          </div>
          <div className={searchAndOrderStyles.searchFilters}>
            Sort by
            <NewSelect
              onChange={changeOrder}
              options={selectOptions}
              value={searchParams.get("order") ?? SortOptions.Popular}
            />
          </div>
        </Container>

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
          <CardCommunity key={community.identifier} community={community} />
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
