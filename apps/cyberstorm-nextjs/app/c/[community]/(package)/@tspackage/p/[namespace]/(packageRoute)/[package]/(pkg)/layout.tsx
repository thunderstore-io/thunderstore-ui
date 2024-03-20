import rootStyles from "../../../../../../../../../RootLayout.module.css";
import styles from "./PackageLayout.module.css";
import {
  BreadCrumbs,
  CommunitiesLink,
  CommunityLink,
  TeamLink,
} from "@thunderstore/cyberstorm";
import { ReactNode, Suspense } from "react";

export default function PackageLayout({
  packageCard,
  packageTabs,
  packageDetail,
  params,
}: {
  packageCard: ReactNode;
  packageTabs: ReactNode;
  packageDetail: ReactNode;
  params: { community: string; namespace: string; package: string };
}) {
  const displayName = params.package.replace(/_/g, " ");
  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <>
          <BreadCrumbs>
            <CommunitiesLink>Communities</CommunitiesLink>
            <CommunityLink community={params.community}>
              {params.community}
            </CommunityLink>
            <TeamLink team={params.namespace}>{params.namespace}</TeamLink>
            {displayName}
          </BreadCrumbs>
          <header className={rootStyles.pageHeader}>
            <Suspense fallback={<p>TODO: SKELETON communityCard</p>}>
              {packageCard}
            </Suspense>
          </header>
          <main className={rootStyles.main}>
            <div className={styles.packageContainer}>
              <Suspense fallback={<p>TODO: SKELETON packageTabs</p>}>
                {packageTabs}
              </Suspense>
              <Suspense fallback={<p>TODO: SKELETON packageDetail</p>}>
                {packageDetail}
              </Suspense>
            </div>
          </main>
        </>
      </div>
    </section>
  );
}
