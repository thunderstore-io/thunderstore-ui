import rootStyles from "../RootLayout.module.css";
import { BreadCrumbs, PageHeader } from "@thunderstore/cyberstorm";
import { ReactNode, Suspense } from "react";

import { CommunityListSkeleton } from "./@communityList/CommunityListSkeleton";
import { SearchAndOrderSkeleton } from "./@searchAndOrder/searchAndOrderSkeleton";

export default function CommunitiesLayout({
  communityList,
  searchAndOrder,
}: {
  communityList: ReactNode;
  searchAndOrder: ReactNode;
}) {
  return (
    <>
      <BreadCrumbs>Communities</BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <PageHeader title="Communities" />
      </header>
      <main className={rootStyles.main}>
        <Suspense fallback={<SearchAndOrderSkeleton />}>
          {searchAndOrder}
        </Suspense>
        <Suspense fallback={<CommunityListSkeleton />}>
          {communityList}
        </Suspense>
      </main>
    </>
  );
}
