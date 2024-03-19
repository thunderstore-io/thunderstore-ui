"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "../Markdown.module.css";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const { html: __html } = usePromise(dapper.getPackageChangelog, [
    params.namespace,
    params.package,
  ]);

  return <div dangerouslySetInnerHTML={{ __html }} className={styles.root} />;
}
