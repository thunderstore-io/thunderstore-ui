import { PackageCardProps, SelectOption } from "@thunderstore/components";
import { z } from "zod";

import { Dapper } from "../dapper";
import { packageCardSchema, packageCategorySchema } from "../schemas";
import { transformCategories, transformPackageCards } from "../transformers";

// Schema describing the data received from backend, used to validate the data.
const schema = z.object({
  bg_image_src: z.nullable(z.string()),
  categories: z.array(packageCategorySchema),
  community_name: z.string(),
  packages: z.array(packageCardSchema),
});

// Define values returned by the Dapper method.
interface CommunityPackageListing {
  categories: SelectOption[];
  communityName: string;
  coverImage: string | null;
  packages: PackageCardProps[];
}

// Dapper method type, defining the parameters required to fetch the data.
export type GetCommunityPackageListing = (
  identifier: string,
  ordering?: string,
  page?: number,
  query?: string,
  sections?: string[],
  includedCategories?: string[],
  excludedCategories?: string[],
  deprecated?: boolean,
  nsfw?: boolean
) => Promise<CommunityPackageListing>;

// Method for transforming the received data to a format that will be
// passed on.
const transform = (
  viewData: z.infer<typeof schema>
): CommunityPackageListing => ({
  categories: transformCategories(viewData.categories),
  communityName: viewData.community_name,
  coverImage: viewData.bg_image_src,
  packages: transformPackageCards(viewData.packages),
});

// Method implementation for Dapper class.
export const getCommunityPackageListing: GetCommunityPackageListing =
  async function (
    this: Dapper,
    identifier,
    ordering,
    page,
    query,
    sections,
    includedCategories,
    excludedCategories,
    deprecated,
    nsfw
  ) {
    const apiPath = `c/${identifier}/packages/`;
    const queryParams = [
      { key: "ordering", value: ordering, impotent: "last-updated" },
      { key: "page", value: page, impotent: 1 },
      { key: "q", value: query },
      { key: "sections", value: sections },
      { key: "included_categories", value: includedCategories },
      { key: "excluded_categories", value: excludedCategories },
      { key: "deprecated", value: deprecated, impotent: false },
      { key: "nsfw", value: nsfw, impotent: false },
    ];

    return await this.queryAndProcess(apiPath, queryParams, schema, transform);
  };
