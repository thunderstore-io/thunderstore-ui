import {
  fetchPackageChangelog,
  fetchPackageReadme,
} from "@thunderstore/thunderstore-api";
import { z } from "zod";

import { DapperTsInterface } from "../index";
import { formatErrorMessage } from "../utils";

const prerenderedMarkup = z.object({
  html: z.string(),
});

export async function getPackageChangelog(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const data = await fetchPackageChangelog(
    this.config,
    namespaceId,
    packageName,
    versionNumber
  );
  const parsed = prerenderedMarkup.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}

export async function getPackageReadme(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const data = await fetchPackageReadme(
    this.config,
    namespaceId,
    packageName,
    versionNumber
  );
  const parsed = prerenderedMarkup.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
