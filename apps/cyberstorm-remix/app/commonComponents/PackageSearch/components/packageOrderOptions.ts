import { isTrendingSortEnabled } from "cyberstorm/utils/env";

export enum PackageOrderOptions {
  Created = "newest",
  Downloaded = "most-downloaded",
  NewAndTrending = "new-and-trending",
  Rated = "top-rated",
  Trending = "trending",
  Updated = "last-updated",
}

export type PackageOrderOptionsType = `${PackageOrderOptions}`;

const TRENDING_OPTIONS: string[] = [
  PackageOrderOptions.NewAndTrending,
  PackageOrderOptions.Trending,
];

export function isPackageOrderOptions(value: string) {
  const enumValues = Object.values(PackageOrderOptions) as string[];
  if (!enumValues.includes(value)) return false;
  return isTrendingSortEnabled() || !TRENDING_OPTIONS.includes(value);
}

export function getDefaultPackageOrder(): PackageOrderOptionsType {
  return isTrendingSortEnabled()
    ? PackageOrderOptions.Trending
    : PackageOrderOptions.Updated;
}

export function getPackageOrder(
  searchParams: URLSearchParams
): PackageOrderOptionsType {
  const ordering = searchParams.get("ordering");
  return ordering && isPackageOrderOptions(ordering)
    ? (ordering as PackageOrderOptionsType)
    : getDefaultPackageOrder();
}
