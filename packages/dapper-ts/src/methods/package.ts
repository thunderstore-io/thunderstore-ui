import {
  fetchPackageChangelog,
  fetchPackageReadme,
  fetchPackageVersions,
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

const versionsSchema = z
  .object({
    version_number: z.string().nonempty(),
    datetime_created: z.string().datetime(),
    download_count: z.number().int().gte(0),
    download_url: z.string().nonempty(),
    install_url: z.string().nonempty(),
  })
  .array();

export async function getPackageVersions(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string
) {
  const data = await fetchPackageVersions(
    this.config,
    namespaceId,
    packageName
  );
  const parsed = versionsSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
