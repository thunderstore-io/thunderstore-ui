import { PackageDetailLayout } from "@thunderstore/cyberstorm";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  return (
    <PackageDetailLayout
      community={params.community}
      namespace={params.namespace}
      packageName={params.package}
    />
  );
}
