"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import rootStyles from "../../../../../../../../../../RootLayout.module.css";
import styles from "./DependantsPage.module.css";
import {
  BreadCrumbs,
  CommunitiesLink,
  CommunityLink,
  PackageLink,
  PackageSearch,
  TeamLink,
} from "@thunderstore/cyberstorm";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const community = usePromise(dapper.getCommunity, [params.community]);
  const filters = usePromise(dapper.getCommunityFilters, [params.community]);

  const listingType = {
    kind: "package-dependants" as const,
    communityId: params.community,
    namespaceId: params.namespace,
    packageName: params.package,
  };

  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <>
          <BreadCrumbs>
            <CommunitiesLink>Communities</CommunitiesLink>
            <CommunityLink community={params.community}>
              {community.name}
            </CommunityLink>
            Packages
            <TeamLink community={params.community} team={params.namespace}>
              {params.namespace}
            </TeamLink>
            <PackageLink
              community={params.community}
              namespace={params.namespace}
              package={params.package}
            >
              {params.package}
            </PackageLink>
            Dependants
          </BreadCrumbs>
          <header className={rootStyles.pageHeader}>
            <div className={styles.header}>
              Mods that depend on{" "}
              <PackageLink
                community={params.community}
                namespace={params.namespace}
                package={params.package}
              >
                {params.package}
              </PackageLink>
              {" by "}
              <TeamLink community={params.community} team={params.namespace}>
                {params.namespace}
              </TeamLink>
            </div>
          </header>
          <main className={rootStyles.main}>
            <PackageSearch
              listingType={listingType}
              packageCategories={filters.package_categories}
              sections={filters.sections}
            />
          </main>
        </>
      </div>
    </section>
  );
}
