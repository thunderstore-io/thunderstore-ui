"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "../../../Markdown/Markdown.module.css";

interface Props {
  namespaceId: string;
  packageName: string;
  versionNumber?: string;
}

export function PackageChangeLog(props: Props) {
  const { namespaceId, packageName, versionNumber } = props;
  const dapper = useDapper();
  const { html: __html } = usePromise(dapper.getPackageChangelog, [
    namespaceId,
    packageName,
    versionNumber,
  ]);

  return <div dangerouslySetInnerHTML={{ __html }} className={styles.root} />;
}

PackageChangeLog.displayName = "PackageChangeLog";
