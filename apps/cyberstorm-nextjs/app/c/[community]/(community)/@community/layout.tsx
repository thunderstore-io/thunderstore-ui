import rootStyles from "../../../../RootLayout.module.css";
import {
  BreadCrumbs,
  CyberstormLink,
  PackageSearchSkeleton,
} from "@thunderstore/cyberstorm";
import { ReactNode, Suspense } from "react";
import { CommunityCardSkeleton } from "./@communityCard/communityCardSkeleton";

export default function CommunityProfileLayout({
  communityCard,
  packageSearch,
  params,
}: {
  communityCard: ReactNode;
  packageSearch: ReactNode;
  params: { community: string };
}) {
  return (
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Communities">Communities</CyberstormLink>
        <CyberstormLink linkId="Community" community={params.community}>
          {params.community}
        </CyberstormLink>
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <Suspense fallback={<CommunityCardSkeleton />}>
          {communityCard}
        </Suspense>
      </header>
      <main className={rootStyles.main}>
        <Suspense fallback={<PackageSearchSkeleton />}>
          {packageSearch}
        </Suspense>
      </main>
    </>
  );
}
