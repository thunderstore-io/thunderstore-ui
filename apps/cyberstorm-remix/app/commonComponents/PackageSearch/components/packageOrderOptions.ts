export enum PackageOrderOptions {
  Created = "newest",
  Downloaded = "most-downloaded",
  Rated = "top-rated",
  Updated = "last-updated",
}

export type PackageOrderOptionsType = `${PackageOrderOptions}`;

export function isPackageOrderOptions(value: string) {
  const enumValues = Object.values(PackageOrderOptions) as string[];
  return enumValues.includes(value);
}
