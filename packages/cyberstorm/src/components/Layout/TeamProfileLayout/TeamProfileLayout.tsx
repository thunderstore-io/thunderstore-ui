import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "./TeamProfileLayout.module.css";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunitiesLink, CommunityLink, TeamLink } from "../../Links/Links";
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

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={community}>{community}</CommunityLink>
          Packages
          {namespace}
        </BreadCrumbs>
      }
      header={
        <div className={styles.header}>
          Mods uploaded by{" "}
          <TeamLink community={community} team={namespace}>
            {namespace}
          </TeamLink>
        </div>
      }
      mainContent={
        <PackageSearch
          communityId={community}
          namespaceId={namespace}
          packageCategories={filters.package_categories}
          sections={filters.sections}
        />
      }
    />
  );
}

TeamProfileLayout.displayName = "TeamProfileLayout";
