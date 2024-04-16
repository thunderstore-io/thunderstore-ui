import {
  BreadCrumbs,
  CyberstormLink,
  PageHeader,
  SettingItem,
} from "@thunderstore/cyberstorm";
import rootStyles from "../../RootLayout.module.css";
import { ReactNode, Suspense } from "react";
import { ValidatorSkeleton } from "./@validator/ValidatorSkeleton";

export default function ManifestValidatorLayout({
  validator,
}: {
  validator: ReactNode;
}) {
  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <>
          <BreadCrumbs>
            <CyberstormLink linkId="ManifestValidator">
              Manifest Validator
            </CyberstormLink>
          </BreadCrumbs>
          <header className={rootStyles.pageHeader}>
            <PageHeader title="Manifest Validator" />
          </header>
          <main className={rootStyles.main}>
            <SettingItem
              title="Manifest Validator"
              description="Select a team to validate a package"
              content={
                <Suspense fallback={<ValidatorSkeleton />}>
                  {validator}
                </Suspense>
              }
            />
          </main>
        </>
      </div>
    </section>
  );
}
