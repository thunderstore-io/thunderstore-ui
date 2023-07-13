import { PackageDependantsLayout } from "@thunderstore/cyberstorm";
import { getPackageDummyData } from "@thunderstore/dapper/src/implementations/dummy/generate";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const packageData = getPackageDummyData(
    "1337",
    params.community,
    params.namespace,
    params.package
  );

  return <PackageDependantsLayout packageData={packageData} />;
}
