"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import rootStyles from "../../../../../../../RootLayout.module.css";
import styles from "./TeamProfileLayout.module.css";
import {
  BreadCrumbs,
  PackageSearch,
  CyberstormLink,
} from "@thunderstore/cyberstorm";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string };
}) {
  const { community, namespace } = params;

  const dapper = useDapper();
  const filters = usePromise(dapper.getCommunityFilters, [community]);

  const listingType = {
    kind: "namespace" as const,
    communityId: community,
    namespaceId: namespace,
  };

  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <>
          <BreadCrumbs>
            <CyberstormLink linkId="Communities">Communities</CyberstormLink>
            <CyberstormLink linkId="Community" community={community}>
              {community}
            </CyberstormLink>
            Packages
            {namespace}
          </BreadCrumbs>
          <header className={rootStyles.pageHeader}>
            <div className={styles.header}>
              Mods uploaded by{" "}
              <CyberstormLink
                linkId="Team"
                community={community}
                team={namespace}
              >
                {namespace}
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
      </div>
    </section>
  );
}
