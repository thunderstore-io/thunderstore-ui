import { PackageDependantsLayout } from "@thunderstore/cyberstorm";
import { Package } from "@thunderstore/dapper/schema";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  // TODO: dummy data for now, the component shouldn't consume Package
  // object anyway.
  const packageData = {
    community: params.community,
    namespace: params.namespace,
    name: params.package,
  } as Package;

  return <PackageDependantsLayout packageData={packageData} />;
}
