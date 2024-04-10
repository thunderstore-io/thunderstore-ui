import rootStyles from "../../../../RootLayout.module.css";
import {
  BreadCrumbs,
  CommunitiesLink,
  CommunityLink,
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
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <>
          <BreadCrumbs>
            <CommunitiesLink>Communities</CommunitiesLink>
            <CommunityLink community={params.community}>
              {params.community}
            </CommunityLink>
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
      </div>
    </section>
  );
}
