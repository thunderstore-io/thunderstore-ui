"use client";
import { useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

import styles from "./CommunityList.module.css";
import { SortOptions } from "./CommunityListLayout";
import { CommunityCard } from "../../CommunityCard/CommunityCard";

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
    undefined,
    order,
    search,
  ]);

  return (
    <div className={styles.root}>
      {communities.results.map((community) => (
        <CommunityCard key={community.identifier} community={community} />
      ))}
    </div>
  );
}