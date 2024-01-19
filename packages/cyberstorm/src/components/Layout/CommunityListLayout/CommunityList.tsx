"use client";
import { faGhost } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "./CommunityList.module.css";
import { SortOptions } from "./CommunityListLayout";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { EmptyState } from "../../EmptyState/EmptyState";
import { EmptyStateIcon, EmptyStateTitle } from "../../EmptyState";

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
    <EmptyState className={styles.noResultPadding}>
      <EmptyStateIcon wrapperClasses={styles.ghostBounce}>
        <FontAwesomeIcon icon={faGhost} />
      </EmptyStateIcon>
      <EmptyStateTitle>It&apos;s empty in there.</EmptyStateTitle>
    </EmptyState>
  );
}
