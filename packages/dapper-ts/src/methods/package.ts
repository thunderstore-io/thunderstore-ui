import {
  fetchPackageChangelog,
  fetchPackageReadme,
  fetchPackageVersions,
  postPackageSubmission,
  fetchPackageSubmissionStatus,
} from "@thunderstore/thunderstore-api";
import { z } from "zod";

import { DapperTsInterface } from "../index";

export async function getPackageChangelog(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const data = await fetchPackageChangelog({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: {},
  });

  return data;
}

export async function getPackageReadme(
  this: DapperTsInterface,
  namespaceId: string,
  packageName: string,
  versionNumber?: string
) {
  const data = await fetchPackageReadme({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
      version_number: versionNumber,
    },
    data: {},
    queryParams: {},
  });

  return data;
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
  const data = await fetchPackageVersions({
    config: this.config,
    params: {
      namespace_id: namespaceId,
      package_name: packageName,
    },
    data: {},
    queryParams: {},
  });

  return data;
}

export async function postPackageSubmissionMetadata(
  this: DapperTsInterface,
  author_name: string,
  communities: string[],
  has_nsfw_content: boolean,
  upload_uuid: string,
  categories?: string[],
  community_categories?: { [key: string]: string[] }
) {
  const data = await postPackageSubmission({
    config: this.config,
    params: {},
    data: {
      author_name,
      communities,
      has_nsfw_content,
      upload_uuid,
      categories,
      community_categories,
    },
    queryParams: {},
  });

  return data;
}

export async function getPackageSubmissionStatus(
  this: DapperTsInterface,
  submissionId: string
) {
  const response = await fetchPackageSubmissionStatus({
    config: this.config,
    params: {
      submission_id: submissionId,
    },
    data: {},
    queryParams: {},
  });

  return response;
}
