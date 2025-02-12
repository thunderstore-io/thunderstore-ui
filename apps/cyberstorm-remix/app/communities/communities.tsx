import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  CardCommunity,
  EmptyState,
  NewTextInput,
  NewSelect,
  Heading,
} from "@thunderstore/cyberstorm";
import "./Communities.css";
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
  useNavigationType,
  // useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { Communities } from "@thunderstore/dapper/types";
// import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { DapperTs } from "@thunderstore/dapper-ts";

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
  const dapper = new DapperTs(() => {
    return {
      apiHost: process.env.PUBLIC_API_URL,
      sessionId: undefined,
    };
  });
  return await dapper.getCommunities(page, order ?? "", search ?? "");
}

export async function clientLoader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const order = searchParams.get("order") ?? SortOptions.Popular;
  const search = searchParams.get("search");
  const page = undefined;
  const dapper = window.Dapper;
  return await dapper.getCommunities(page, order ?? "", search ?? "");
}

export default function CommunitiesPage() {
  const communitiesData = useLoaderData<typeof loader | typeof clientLoader>();
  const navigationType = useNavigationType();

  const [searchParams, setSearchParams] = useSearchParams();
  // TODO: Disabled until we can figure out how a proper way to display skeletons
  // const navigation = useNavigation();

  const changeOrder = (v: SortOptions) => {
    searchParams.set("order", v);
    setSearchParams(searchParams);
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

  useEffect(() => {
    if (debouncedSearchValue === "") {
      searchParams.delete("search");
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set("search", debouncedSearchValue);
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedSearchValue]);

  return (
    <div className="container container--y container--full layout__content">
      <section className="container container--y nimbus-communities">
        {/* <PageHeader heading="Communities" headingLevel="1" headingSize="2" /> */}
        <Heading
          csLevel="1"
          csSize="2"
          rootClasses="container container--stretch communities__heading"
        >
          Communities
        </Heading>

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
            />
            <span className="container container--x">
              <NewSelect
                onChange={changeOrder}
                options={selectOptions}
                value={searchParams.get("order") ?? SortOptions.Popular}
                aria-label="Sort communities by"
              />
            </span>
          </div>

          <div className="container container--x container--stretch communities__results">
            <CommunitiesList communitiesData={communitiesData} />
          </div>
        </div>
        {/* {navigation.state === "loading" ? (
          <CommunitiesListSkeleton />
        ) : (
          <CommunitiesList communitiesData={communitiesData} />
        )} */}
      </section>
    </div>
  );
}

function CommunitiesList(props: { communitiesData: Communities }) {
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
}
