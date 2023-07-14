import { z } from "zod";

export function getPaginationSchema<ObjectType extends z.ZodTypeAny>(
  objectType: ObjectType
) {
  return z.object({
    count: z.number().int(),
    next: z.string().nullish(),
    previous: z.string().nullish(),
    results: z.array(objectType),
  });
}

export type PaginatedList<T> = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
};

export type Community = {
  name: string;
  identifier: string;

  total_download_count: number;
  total_package_count: number;
  total_server_count: number;
  background_image_url?: string | null;
  portrait_image_url?: string | null;

  description?: string | null;
  discord_url?: string | null;
};

export type CommunityList = PaginatedList<Community>;

export const communitySchema = z.object({
  name: z.string(),
  identifier: z.string(),

  total_download_count: z.number().int(),
  total_package_count: z.number().int(),
  total_server_count: z.number().int(),
  background_image_url: z.string().nullish(),
  portrait_image_url: z.string().nullish(),

  description: z.string().nullish(),
  discord_url: z.string().nullish(),
});

export const communityListSchema = getPaginationSchema(communitySchema);
