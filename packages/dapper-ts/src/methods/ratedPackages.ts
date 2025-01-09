import { z } from "zod";
import { fetchRatedPackages } from "@thunderstore/thunderstore-api";

import { DapperTsInterface } from "../index";
import { formatErrorMessage } from "../utils";

export const ratedPackagesSchema = z.object({
  rated_packages: z.string().array(),
});

const schema = z.object({
  rated_packages: z.string().array(),
});

export async function getRatedPackages(this: DapperTsInterface) {
  const data = await fetchRatedPackages(this.config);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
