import { z } from "zod";

export const PackageCategory = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  slug: z.string().nonempty(),
});

export const paginatedResults = <T extends z.ZodTypeAny>(resultType: T) =>
  z.object({
    count: z.number().int().min(0),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(resultType),
  });
