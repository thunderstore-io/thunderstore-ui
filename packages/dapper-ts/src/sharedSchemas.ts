import { z } from "zod";

export const PackageCategory = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
});

export const paginatedResults = <T extends z.ZodTypeAny>(resultType: T) =>
  z.object({
    count: z.number().int().min(0),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(resultType),
  });
