import { fetchPackageVersionDetails } from "@thunderstore/thunderstore-api";

import { type DapperTsInterface } from "../index";

export async function getPackageVersionDetails(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  packageVersion: string
) {
  const data = await fetchPackageVersionDetails({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      package_version: packageVersion,
    },
    data: {},
    queryParams: {},
  });

  return data;
}
