import {
  PackageActionsProps,
  PackageDependency,
  PackageHeaderProps,
  PackageInfoProps,
  PackageVersion,
} from "@thunderstore/components";
import { z } from "zod";

import { Dapper } from "../dapper";
import { packageCategorySchema } from "../schemas";
import { transformCategories } from "../transformers";

// Schema describing the data received from backend, used to validate the data.
const schema = z.object({
  bg_image_src: z.nullable(z.string()),
  categories: packageCategorySchema.array(),
  community_identifier: z.string().min(1),
  community_name: z.string().min(1),
  dependant_count: z.number().min(0),
  dependencies: z.array(
    z.object({
      community_identifier: z.string().nullable(),
      community_name: z.string().nullable(),
      description: z.string(),
      image_src: z.string().nullable(),
      package_name: z.string().min(1),
      version_number: z.string().min(1),
    })
  ),
  dependency_string: z.string().min(1),
  description: z.string(),
  download_count: z.number().min(0),
  download_url: z.string(),
  image_src: z.string().nullable(),
  install_url: z.string(),
  last_updated: z.string(),
  markdown: z.string(),
  package_name: z.string().min(1),
  rating_score: z.number().min(0),
  team_name: z.string().min(1),
  versions: z.array(
    z.object({
      date_created: z.string(),
      download_count: z.number().min(0),
      download_url: z.string(),
      install_url: z.string(),
      version_number: z.string().min(1),
    })
  ),
  website: z.string(),
});

// Define values returned by the Dapper method.
interface PackageDetails
  extends PackageActionsProps,
    PackageHeaderProps,
    PackageInfoProps {
  coverImage: string | null;
  requirements: PackageDependency[];
  versions: PackageVersion[];
}

// Method for transforming the received data to a format that will be
// passed on.
const transform = (viewData: z.infer<typeof schema>): PackageDetails => ({
  categories: transformCategories(viewData.categories),
  communityIdentifier: viewData.community_identifier,
  coverImage: viewData.bg_image_src,
  dependantCount: viewData.dependant_count,
  dependencyString: viewData.dependency_string,
  description: viewData.description,
  downloadCount: viewData.download_count,
  downloadUrl: viewData.download_url,
  installUrl: viewData.install_url,
  imageSrc: viewData.image_src,
  lastUpdated: viewData.last_updated,
  markdown: viewData.markdown,
  packageName: viewData.package_name,
  ratingScore: viewData.rating_score,
  requirements: viewData.dependencies.map((d) => ({
    communityIdentifier: d.community_identifier,
    description: d.description,
    imageSrc: d.image_src,
    packageName: d.package_name,
    preferredVersion: d.version_number,
  })),
  teamName: viewData.team_name,
  versions: viewData.versions.map((v) => ({
    downloadCount: v.download_count,
    downloadUrl: v.download_url,
    installUrl: v.install_url,
    uploaded: v.date_created,
    version: v.version_number,
  })),
  website: viewData.website,
});

// Dapper method type, defining the parameters required to fetch the data.
export type GetPackage = (
  communityIdentifier: string,
  packageName: string
) => Promise<PackageDetails>;

// Method implementation for Dapper class.
export const getPackage: GetPackage = async function (
  this: Dapper,
  communityIdentifier: string,
  packageName: string
) {
  const apiPath = `c/${communityIdentifier}/p/${packageName}/`;
  return await this.queryAndProcess(apiPath, [], schema, transform);
};
