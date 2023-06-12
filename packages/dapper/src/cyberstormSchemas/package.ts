import { z } from "zod";
import { teamMemberSchema } from "./team";
import { isDate } from "./utils";

export const packageDependencySchema = z.object({
  name: z.string(),
  namespace: z.string(),
  community: z.string(),
  shortDescription: z.string(),
  imageSource: z.optional(z.string()),
  version: z.string(),
});

export const packageVersionSchema = z.object({
  version: z.string(),
  changelog: z.string(),
  uploadDate: z.string().refine(isDate),
  downloadCount: z.number().nonnegative().int(),
});

export const packageCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export const packagePreviewSchema = z.object({
  name: z.string().min(1),
  namespace: z.string().min(1),
  community: z.string().min(1),
  shortDescription: z.optional(z.string()),
  imageSource: z.optional(z.string()),
  downloadCount: z.number().nonnegative().int(),
  likes: z.number().nonnegative().int(),
  size: z.number().nonnegative().int(),
  author: z.optional(z.string().min(1)),
  lastUpdated: z.string().refine(isDate),
  isPinned: z.optional(z.boolean()),
  isNsfw: z.optional(z.boolean()),
  isDeprecated: z.optional(z.boolean()),
  categories: z.array(packageCategorySchema),
});

export const packageSchema = packagePreviewSchema.extend({
  description: z.optional(z.string()),
  additionalImages: z.optional(z.array(z.string())),
  gitHubLink: z.optional(z.string()),
  firstUploaded: z.optional(z.string().refine(isDate)),
  dependencyString: z.string(),
  dependencies: z.optional(z.array(packageDependencySchema)),
  dependantCount: z.number(),
  team: z.object({ name: z.string(), members: z.array(teamMemberSchema) }),
  versions: z.optional(z.array(packageVersionSchema)),
});
