import rootStyles from "../../../../../../../../../RootLayout.module.css";
import styles from "./PackageLayout.module.css";
import { BreadCrumbs, CyberstormLink } from "@thunderstore/cyberstorm";
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
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Communities">Communities</CyberstormLink>
        <CyberstormLink linkId="Community" community={params.community}>
          {params.community}
        </CyberstormLink>
        <CyberstormLink linkId="Team" team={params.namespace}>
          {params.namespace}
        </CyberstormLink>
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
  );
}
