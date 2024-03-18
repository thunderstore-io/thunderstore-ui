import { PackageDependantsLayout } from "@thunderstore/cyberstorm";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  return (
    <PackageDependantsLayout
      communityId={params.community}
      namespaceId={params.namespace}
      packageName={params.package}
    />
  );
}
