"use client";
import { faGhost } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "./CommunityList.module.css";
import { EmptyState, CommunityCard } from "@thunderstore/cyberstorm";

enum SortOptions {
  Name = "name",
  Latest = "-datetime_created",
  Popular = "-aggregated_fields__download_count",
}

interface Props {
  order: SortOptions;
  search: string;
}

export function CommunityList(props: Props) {
  const { order, search } = props;
  const dapper = useDapper();

  // TODO: the component doesn't currently support pagination, while this
  // only returns the first 100 items (we don't have 100 communities).
  const communities = usePromise(dapper.getCommunities, [
    undefined,
    order,
    search,
  ]);

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
