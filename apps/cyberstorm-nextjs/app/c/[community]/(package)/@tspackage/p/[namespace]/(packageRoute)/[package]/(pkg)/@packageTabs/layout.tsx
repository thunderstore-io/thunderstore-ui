"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { ReactNode, Suspense } from "react";
import Tabs from "@thunderstore/cyberstorm/src/components/NewTabs/Tabs";
import {
  faFileLines,
  faFilePlus,
  faCodeBranch,
} from "@fortawesome/pro-solid-svg-icons";

export default function PacakgeTabsLayout({
  packageReadme,
  packageChangelog,
  packageVersions,
  params,
}: {
  packageReadme: ReactNode;
  packageChangelog: ReactNode;
  packageVersions: ReactNode;
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);

  return (
    <Tabs>
      <Tabs.Tab name="details" label="Details" icon={faFileLines}>
        <Suspense fallback={<p>TODO: Readme Skeleton</p>}>
          {packageReadme}
        </Suspense>
      </Tabs.Tab>

      <Tabs.Tab
        name="changelog"
        label="Changelog"
        icon={faFilePlus}
        disabled={!packageData.has_changelog}
      >
        <Suspense fallback={<p>TODO: Changelog Skeleton</p>}>
          {packageChangelog}
        </Suspense>
      </Tabs.Tab>

      <Tabs.Tab name="versions" label="Versions" icon={faCodeBranch}>
        <Suspense fallback={<p>TODO: Versions Skeleton</p>}>
          {packageVersions}
        </Suspense>
      </Tabs.Tab>
    </Tabs>
  );
}
