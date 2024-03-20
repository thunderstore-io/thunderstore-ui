"use client";
import { Button } from "@thunderstore/cyberstorm";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import {
  PackageDeprecateAction,
  PackageEditForm,
} from "@thunderstore/cyberstorm-forms";
import { useState } from "react";

export default function Page({
  params,
}: {
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageDataInitial = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);
  const communityData = usePromise(dapper.getCommunityFilters, [
    params.community,
  ]);
  const options = communityData.package_categories.map((cat) => {
    return { label: cat.name, value: cat.slug };
  });

  const [packageData, setPackageData] = useState(packageDataInitial);

  // TODO: Convert to using usePromise's cache replace, when it can handle manual busts
  // Or React Query stuff
  async function useUpdatePackageData() {
    const dapper = useDapper();
    const packageDataUpdate = await dapper.getPackageListingDetails(
      params.community,
      params.namespace,
      params.package
    );
    setPackageData(packageDataUpdate);
  }

  return (
    <PackageEditForm
      options={options}
      community={params.community}
      namespace={params.namespace}
      package={params.package}
      current_categories={packageData.categories}
      isDeprecated={packageData.is_deprecated}
      packageDataUpdateTrigger={useUpdatePackageData}
      deprecationButton={
        <Button.Root
          type="button"
          onClick={PackageDeprecateAction({
            packageName: params.package,
            namespace: packageData.namespace,
            isDeprecated: packageData.is_deprecated,
            packageDataUpdateTrigger: useUpdatePackageData,
          })}
          colorScheme={packageData.is_deprecated ? "warning" : "default"}
          paddingSize="large"
        >
          {packageData.is_deprecated ? (
            <Button.ButtonLabel>Undeprecate</Button.ButtonLabel>
          ) : (
            <Button.ButtonLabel>Deprecate</Button.ButtonLabel>
          )}
        </Button.Root>
      }
    />
  );
}
