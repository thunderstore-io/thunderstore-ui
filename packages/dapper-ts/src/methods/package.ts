import {
  fetchPackageChangelog,
  fetchPackageReadme,
  fetchPackageVersions,
  postPackageSubmission,
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

export const versionsSchema = z
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

export const packageSubmissionStatusSchema = z.object({
  id: z.string().nonempty(),
  status: z.string().nonempty(),
  form_errors: z.string().array(),
  task_error: z.boolean(),
  result: z.string(),
});

export async function postPackageSubmissionMetadata(
  this: DapperTsInterface,
  author_name: string,
  categories: string[],
  communities: string[],
  has_nsfw_content: boolean,
  upload_uuid: string,
  community_categories: string[]
) {
  const data = await postPackageSubmission(
    this.config,
    {
      author_name,
      categories,
      communities,
      has_nsfw_content,
      upload_uuid,
      community_categories,
    },
    { useSession: true }
  );
  const parsed = packageSubmissionStatusSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(formatErrorMessage(parsed.error));
  }

  return parsed.data;
}
