import { z } from "zod";
import { fetchCommunityFilters } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { PackageCategory } from "../sharedSchemas";
import { formatErrorMessage } from "../utils";

const Section = z.object({
  uuid: z.string().uuid(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
  priority: z.number().int(),
});

const schema = z.object({
  package_categories: PackageCategory.array(),
  sections: Section.array(),
});

export async function getCommunityFilters(
  this: DapperTsInterface,
  communityId: string
) {
  const data = await fetchCommunityFilters(this.config, communityId);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
