"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import rootStyles from "../../../../../../../../../../RootLayout.module.css";
import styles from "./DependantsPage.module.css";
import {
  BreadCrumbs,
  CyberstormLink,
  PackageSearch,
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
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Communities">Communities</CyberstormLink>
        <CyberstormLink linkId="Community" community={params.community}>
          {community.name}
        </CyberstormLink>
        Packages
        <CyberstormLink
          linkId="Team"
          community={params.community}
          team={params.namespace}
        >
          {params.namespace}
        </CyberstormLink>
        <CyberstormLink
          linkId="Package"
          community={params.community}
          namespace={params.namespace}
          package={params.package}
        >
          {params.package}
        </CyberstormLink>
        Dependants
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <div className={styles.header}>
          Mods that depend on{" "}
          <CyberstormLink
            linkId="Package"
            community={params.community}
            namespace={params.namespace}
            package={params.package}
          >
            {params.package}
          </CyberstormLink>
          {" by "}
          <CyberstormLink
            linkId="Team"
            community={params.community}
            team={params.namespace}
          >
            {params.namespace}
          </CyberstormLink>
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
  );
}
