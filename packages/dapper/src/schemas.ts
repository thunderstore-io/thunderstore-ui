/**
 * Collection of shared Zod schemas.
 */
import { z } from "zod";

const isDate = (value: string): boolean => {
  const timestamp = Date.parse(value);
  return !isNaN(timestamp);
};

export const packageCategorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
});

export const packageCardSchema = z.object({
  categories: z.array(packageCategorySchema),
  community_name: z.string().min(1),
  community_identifier: z.string().min(1),
  description: z.string(),
  download_count: z.number().nonnegative().int(),
  image_src: z.nullable(z.string()),
  is_deprecated: z.boolean(),
  is_nsfw: z.boolean(),
  is_pinned: z.boolean(),
  last_updated: z.string().refine(isDate),
  package_name: z.string().min(1),
  rating_score: z.number().nonnegative().int(),
  team_name: z.string().min(1),
});
