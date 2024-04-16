"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "./TeamProfileLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CyberstormLink } from "../../Links/Links";
import { PackageSearch } from "../../PackageSearch/PackageSearch";

interface Props {
  community: string;
  namespace: string;
}

/**
 * Team's public profile view.
 *
 * Due to changes in plans this layout is a bit badly names. It was
 * supposed to be team's profile page which would be independent from
 * communities, and match similar UserProfileLayout in functionality.
 * However it's now used to list the teams packages under a single
 * community. The naming should be rethinked when the actual profile
 * page is implemented.
 *
 * TODO: use Dapper to fetch community's name and use it in CommunityLink.
 */
export function TeamProfileLayout(props: Props) {
  const { community, namespace } = props;

  const dapper = useDapper();
  const filters = usePromise(dapper.getCommunityFilters, [community]);

  const listingType = {
    kind: "namespace" as const,
    communityId: community,
    namespaceId: namespace,
  };

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="Communities">Communities</CyberstormLink>
          <CyberstormLink linkId="Community" community={community}>
            {community}
          </CyberstormLink>
          Packages
          {namespace}
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods uploaded by{" "}
          <CyberstormLink linkId="Team" community={community} team={namespace}>
            {namespace}
          </CyberstormLink>
        </div>
      }
      mainContent={
        <PackageSearch
          listingType={listingType}
          packageCategories={filters.package_categories}
          sections={filters.sections}
        />
      }
    />
  );
}

TeamProfileLayout.displayName = "TeamProfileLayout";
