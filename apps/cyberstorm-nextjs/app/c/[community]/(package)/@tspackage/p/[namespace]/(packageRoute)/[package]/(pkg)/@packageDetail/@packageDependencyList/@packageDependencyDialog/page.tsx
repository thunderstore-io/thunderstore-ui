"use client";
import {
  ImageWithFallback,
  PackageLink,
  PackageVersionLink,
} from "@thunderstore/cyberstorm";
import styles from "./PackageDependencyDialog.module.css";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { ReactNode } from "react";

export default function Page({
  params,
}: {
  packageDependencyDialog: ReactNode;
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);

  return (
    <div className={styles.root}>
      {packageData.dependencies.map((depData, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.image}>
            <ImageWithFallback src={depData.icon_url} type="package" square />
          </div>
          <div>
            <div className={styles.title}>
              <PackageLink
                community={depData.community_identifier}
                namespace={depData.namespace}
                package={depData.name}
              >
                {depData.name}
              </PackageLink>
            </div>
            <div className={styles.description}>{depData.description}</div>
            <p className={styles.preferredVersion}>
              Preferred version:{" "}
              <span className={styles.preferredVersion__version}>
                <PackageVersionLink
                  community={depData.community_identifier}
                  namespace={depData.namespace}
                  package={depData.name}
                  version={depData.version_number}
                >
                  {depData.version_number}
                </PackageVersionLink>
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
