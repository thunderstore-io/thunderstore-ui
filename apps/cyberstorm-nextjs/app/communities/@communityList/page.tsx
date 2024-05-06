import { faGhost } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";

import styles from "./CommunityList.module.css";
import { EmptyState, CommunityCard } from "@thunderstore/cyberstorm";
import { isStringArray } from "@thunderstore/cyberstorm/src/utils/type_guards";
import { use } from "react";
import { unstable_cache } from "next/cache";

enum SortOptions {
  Name = "name",
  Latest = "-datetime_created",
  Popular = "-aggregated_fields__package_count",
  MostDownloads = "-aggregated_fields__download_count",
}

interface Props {
  searchParams: {
    order: SortOptions[] | SortOptions;
    search: string[] | string;
  };
}

export default function Page(props: Props) {
  const { searchParams } = props;

  const page = undefined;

  const order = isStringArray(searchParams.order)
    ? searchParams.order[0]
    : typeof searchParams.order === "string"
    ? searchParams.order
    : SortOptions.Popular;

  const search = isStringArray(searchParams.search)
    ? searchParams.search.join(" ")
    : typeof searchParams.search === "string"
    ? searchParams.search
    : "";

  const dapper = useDapper();

  // TODO: the component doesn't currently support pagination, while this
  // only returns the first 100 items (we don't have 100 communities).
  // Pagination support should be added with NextJS and query params
  const communities = use(
    unstable_cache(
      async (page, order, search) => dapper.getCommunities(page, order, search),
      ["communities-page-communities"],
      { revalidate: 300 }
    )(page, order, search)
  );

  const cards = communities.results.map((community) => (
    <CommunityCard key={community.identifier} community={community} />
  ));

  return cards.length > 0 ? (
    <div className={styles.root}>{cards}</div>
  ) : (
    <EmptyState.Root className={styles.noResultPadding}>
      <EmptyState.Icon wrapperClasses={styles.ghostBounce}>
        <FontAwesomeIcon icon={faGhost} />
      </EmptyState.Icon>
      <EmptyState.Title>It&apos;s empty in there.</EmptyState.Title>
    </EmptyState.Root>
  );
}
