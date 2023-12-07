import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "../../../Markdown/Markdown.module.css";

interface Props {
  namespaceId: string;
  packageName: string;
  versionNumber?: string;
}

export function PackageReadme(props: Props) {
  const { namespaceId, packageName, versionNumber } = props;
  const dapper = useDapper();
  const { html: __html } = usePromise(dapper.getPackageReadme, [
    namespaceId,
    packageName,
    versionNumber,
  ]);

  return <div dangerouslySetInnerHTML={{ __html }} className={styles.root} />;
}

PackageReadme.displayName = "PackageReadme";
