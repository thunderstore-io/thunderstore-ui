/**
 * Explicitly define the scope of results expected from GetPackageListings.
 *
 * Each discriminating union part should also include all the arguments
 * required to query the first page of results using default filters etc.
 */
export type PackageListingType =
  | {
      kind: "community";
      communityId: string;
    }
  | {
      kind: "namespace";
      communityId: string;
      namespaceId: string;
    };
