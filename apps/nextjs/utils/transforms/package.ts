import {
  PackageActionsProps,
  PackageDependency,
  PackageHeaderProps,
  PackageInfoProps,
  PackageVersion,
} from "@thunderstore/components";

import { categoriesToSelectOptions, Category } from "./category";

interface BackendPackageDependency {
  community_name: string;
  community_identifier: string;
  description: string;
  image_src: string | null;
  package_name: string;
  version_number: string;
}

const dependencyToProps = (
  dependecy: BackendPackageDependency
): PackageDependency => ({
  communityIdentifier: dependecy.community_identifier,
  description: dependecy.description,
  imageSrc: dependecy.image_src,
  packageName: dependecy.package_name,
  preferredVersion: dependecy.version_number,
});

interface BackendPackageVersion {
  date_created: string;
  download_count: number;
  download_url: string;
  install_url: string;
  version_number: string;
}

const versionToProps = (version: BackendPackageVersion): PackageVersion => ({
  downloadCount: version.download_count,
  downloadUrl: version.download_url,
  installUrl: version.install_url,
  uploaded: version.date_created,
  version: version.version_number,
});

export interface BackendPackage {
  categories: Category[];
  community_name: string;
  community_identifier: string;
  dependant_count: number;
  dependencies: BackendPackageDependency[];
  dependency_string: string;
  description: string;
  download_count: number;
  download_url: string;
  image_src: string | null;
  install_url: string;
  last_updated: string;
  markdown: string;
  package_name: string;
  rating_score: number;
  team_name: string;
  versions: BackendPackageVersion[];
  website: string;
}

export interface PackageProps
  extends PackageActionsProps,
    PackageHeaderProps,
    PackageInfoProps {
  requirements: PackageDependency[];
  versions: PackageVersion[];
}

// Transform backend's Package-related info to format suitable to components.
export const packageToProps = (pkg: BackendPackage): PackageProps => ({
  categories: categoriesToSelectOptions(pkg.categories),
  communityIdentifier: pkg.community_identifier,
  dependantCount: pkg.dependant_count,
  dependencyString: pkg.dependency_string,
  description: pkg.description,
  downloadCount: pkg.download_count,
  downloadUrl: pkg.download_url,
  installUrl: pkg.install_url,
  imageSrc: pkg.image_src,
  lastUpdated: pkg.last_updated,
  markdown: pkg.markdown,
  packageName: pkg.package_name,
  ratingScore: pkg.rating_score,
  requirements: pkg.dependencies.map(dependencyToProps),
  teamName: pkg.team_name,
  versions: pkg.versions.map(versionToProps),
  website: pkg.website,
});
